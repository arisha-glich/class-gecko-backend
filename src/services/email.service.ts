import { Resend } from 'resend'
import { appEventEmitter, type MailEvent } from '~/lib/event-emitter'

// Lazy initialization to avoid errors if API key is missing
let resend: Resend | null = null

function getResendClient(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error(
        'RESEND_API_KEY is not set. Please add it to your .env file. Get your API key from https://resend.com'
      )
    }
    resend = new Resend(apiKey)
  }
  return resend
}

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType?: string
  }>
}

class EmailService {
  async send({ to, subject, html, from, attachments }: SendEmailOptions): Promise<void> {
    // Normalize recipients - ensure they're valid email addresses
    const recipients = (Array.isArray(to) ? to : [to])
      .map(email => {
        if (!email || typeof email !== 'string') {
          throw new Error(`Invalid email address: ${email}`)
        }
        return email.trim().toLowerCase()
      })
      .filter(email => {
        if (!email.includes('@')) {
          console.error('❌ [EMAIL] Invalid email format:', email)
          return false
        }
        return true
      })

    if (recipients.length === 0) {
      throw new Error('No valid email addresses provided')
    }

    const fromEmail = from || process.env.RESEND_FROM_EMAIL || 'hello@classgecko.com'

    console.log('📧 [EMAIL] EmailService.send called:', {
      recipients,
      subject,
      from: fromEmail,
      htmlLength: html.length,
      hasApiKey: !!process.env.RESEND_API_KEY,
    })

    try {
      const client = getResendClient()
      console.log('📧 [EMAIL] Sending email via Resend to:', recipients.join(', '))
      const result = await client.emails.send({
        from: fromEmail,
        to: recipients,
        subject,
        html,
        attachments: attachments?.map(att => ({
          filename: att.filename,
          content: typeof att.content === 'string' ? Buffer.from(att.content) : att.content,
          contentType: att.contentType,
        })),
      })

      // Check for errors in the response (Resend returns errors in the response object, not as exceptions)
      if (result.error) {
        const errorMessage = result.error.message || 'Unknown error from Resend API'
        const error = new Error(`Resend API error: ${errorMessage}`)
        console.error(
          '❌ [EMAIL] Resend API returned an error:',
          JSON.stringify(result.error, null, 2)
        )
        console.error('❌ [EMAIL] Full response:', JSON.stringify(result, null, 2))
        appEventEmitter.emitMailError(error, { to, subject, html })
        throw error
      }

      console.log('✅ [EMAIL] Resend API response:', JSON.stringify(result, null, 2))
      console.log('✅ [EMAIL] Email successfully sent to:', recipients.join(', '))
    } catch (error) {
      console.error('❌ [EMAIL] Failed to send email via Resend:', error)
      if (error instanceof Error) {
        console.error('❌ [EMAIL] Error message:', error.message)
        console.error('❌ [EMAIL] Error stack:', error.stack)
      }
      appEventEmitter.emitMailError(error as Error, { to, subject, html })
      throw error
    }
  }
}

export const emailService = new EmailService()

export function registerEmailListeners(): void {
  console.log('📧 [EMAIL] Registering email listeners...')
  appEventEmitter.onSendMail(async (eventData: MailEvent) => {
    console.log('📧 [EMAIL] mail:send event received:', {
      to: eventData.to,
      subject: eventData.subject,
      htmlLength: eventData.html?.length || 0,
    })
    try {
      await emailService.send({
        to: eventData.to,
        subject: eventData.subject,
        html: eventData.html || '',
        attachments: eventData.attachments,
      })
      console.log('✅ [EMAIL] Email sent successfully via Resend')
    } catch (error) {
      console.error('❌ [EMAIL] Failed to send email:', error)
      throw error
    }
  })
  console.log('✅ [EMAIL] Email listeners registered')
}
