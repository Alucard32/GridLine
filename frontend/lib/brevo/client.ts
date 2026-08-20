/**
 * Brevo API client configuration
 * @see docs/PRD-BREVO-EMAIL-AUTOMATION.md
 */

import {
  ContactsApi,
  TransactionalEmailsApi,
  ContactsApiApiKeys,
  TransactionalEmailsApiApiKeys,
} from '@getbrevo/brevo';

const apiKey = process.env.BREVO_API_KEY;

if (!apiKey && process.env.NODE_ENV !== 'test') {
  console.warn('BREVO_API_KEY not configured - email features disabled');
}

// Contacts API client
export const contactsApi = new ContactsApi();
if (apiKey) {
  contactsApi.setApiKey(ContactsApiApiKeys.apiKey, apiKey);
}

// Transactional Emails API client
export const transactionalApi = new TransactionalEmailsApi();
if (apiKey) {
  transactionalApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);
}

// Sender config from environment
export const brevoSender = {
  name: process.env.BREVO_SENDER_NAME || 'Holy from GridLine',
  email: process.env.BREVO_SENDER_EMAIL || 'hello@gridline.eu',
};

// Check if Brevo is configured
export function isBrevoConfigured(): boolean {
  return !!process.env.BREVO_API_KEY;
}
