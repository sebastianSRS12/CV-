import { CoverLetterTemplate } from '@/types/cover-letter';

export const MINIMAL_TEMPLATE: CoverLetterTemplate = {
  id: 'minimal-clean',
  name: 'Minimal Clean',
  description: 'Simple, elegant design focusing on content over decoration',
  preview: '/templates/cover-letter-minimal.png',
  category: 'minimal',
  isPremium: false,
  structure: {
    sections: [
      {
        id: 'recipient',
        title: 'Recipient Information',
        required: true,
        placeholder: 'Enter recipient details (name, company, position)',
        helpText: 'Who will receive this cover letter?'
      },
      {
        id: 'salutation',
        title: 'Salutation',
        required: false,
        placeholder: 'Dear Hiring Manager,',
        helpText: 'How would you like to address the recipient?'
      },
      {
        id: 'introduction',
        title: 'Introduction',
        required: true,
        placeholder: 'State the position you are applying for and how you found it...',
        helpText: 'Be direct and concise'
      },
      {
        id: 'qualification',
        title: 'Qualification Summary',
        required: true,
        placeholder: 'Summarize your most relevant qualifications...',
        helpText: 'Focus on key strengths and experience'
      },
      {
        id: 'achievement',
        title: 'Key Achievement',
        required: false,
        placeholder: 'Highlight one significant accomplishment...',
        helpText: 'Show results with metrics when possible'
      },
      {
        id: 'fit',
        title: 'Company Fit',
        required: true,
        placeholder: 'Explain why you are interested in this specific company...',
        helpText: 'Show you have researched the company'
      },
      {
        id: 'closing',
        title: 'Closing',
        required: true,
        placeholder: 'Reiterate your interest and request an interview...',
        helpText: 'End professionally with clear next steps'
      },
      {
        id: 'signature',
        title: 'Signature',
        required: true,
        placeholder: 'Best regards, [Your Name]',
        helpText: 'Simple, professional sign-off'
      }
    ],
    styling: {
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontSize: 'medium',
      lineHeight: 'normal',
      margins: {
        top: '1in',
        bottom: '1in',
        left: '1in',
        right: '1in'
      }
    }
  }
};