import { type EmailTemplate, emailSubjects, renderEmailTemplate } from '~/lib/email-render'
import { appEventEmitter } from '~/lib/event-emitter'
import {
  emailService as baseEmailService,
  registerEmailListeners as baseRegister,
} from '~/services/email.service'

export function registerEmailListeners() {
  baseRegister()

  // Listen for template-based email events
  appEventEmitter.on(
    'mail:send-template',
    async (data: {
      to: string | string[]
      template: EmailTemplate
      // biome-ignore lint/suspicious/noExplicitAny: Email template payload can have various shapes
      payload: Record<string, any>
    }) => {
      console.log('📧 [EMAIL] mail:send-template event received:', {
        to: data.to,
        template: data.template,
      })
      try {
        console.log('📧 [EMAIL] Rendering email template...')
        const html = await renderEmailTemplate(data.template, data.payload)
        const subject = emailSubjects[data.template]
        console.log('✅ [EMAIL] Template rendered, HTML length:', html.length)
        console.log('📧 [EMAIL] Emitting mail:send event...')
        appEventEmitter.emitSendMail({ to: data.to, subject, html })
        console.log('✅ [EMAIL] mail:send event emitted')
      } catch (error) {
        console.error('❌ [EMAIL] Error rendering email template:', error)
        throw error
      }
    }
  )
}

export const emailHelpers = {}

export const emailService = baseEmailService
