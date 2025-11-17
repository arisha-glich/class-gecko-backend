import { render } from '@react-email/components'
import * as React from 'react'

export type EmailTemplate = never

export const emailSubjects: Record<EmailTemplate, string> = {} as Record<EmailTemplate, string>

export async function renderEmailTemplate(
  template: EmailTemplate,
  // biome-ignore lint/suspicious/noExplicitAny: Email template data can have various shapes
  data: Record<string, any>
): Promise<string> {
  throw new Error(`Unknown email template: ${template}`)
}
