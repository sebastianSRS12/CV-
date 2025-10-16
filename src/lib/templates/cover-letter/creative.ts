import { CoverLetterTemplate } from '@/types/cover-letter';

export const CREATIVE_TEMPLATE: CoverLetterTemplate = {
  id: 'creative-modern',
  name: 'Creative Modern',
  description: 'Bold, contemporary design for creative industries and innovative companies',
  preview: '/templates/cover-letter-creative.png',
  category: 'creative',
  isPremium: true,
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
        placeholder: 'Hi [Name],',
        helpText: 'How would you like to address the recipient?'
      },
      {
        id: 'hook',
        title: 'Attention Hook',
        required: true,
        placeholder: 'Start with something that grabs attention...',
        helpText: 'Begin with a bold statement or question'
      },
      {
        id: 'story',
        title: 'Your Story',
        required: true,
        placeholder: 'Share your journey and what drives you...',
        helpText: 'Tell your professional story in a compelling way'
      },
      {
        id: 'value',
        title: 'Value Proposition',
        required: true,
        placeholder: 'Explain what makes you uniquely valuable...',
        helpText: 'Show how you can solve their problems'
      },
      {
        id: 'passion',
        title: 'Passion Statement',
        required: false,
        placeholder: 'Share why you are passionate about this opportunity...',
        helpText: 'Show genuine enthusiasm for the role/company'
      },
      {
        id: 'call-to-action',
        title: 'Call to Action',
        required: true,
        placeholder: 'Suggest next steps and express eagerness to connect...',
        helpText: 'End with a strong, confident close'
      },
      {
        id: 'signature',
        title: 'Signature',
        required: true,
        placeholder: 'Your name and creative title',
        helpText: 'Sign off with personality'
      }
    ],
    styling: {
      fontFamily: 'Inter, sans-serif',
      fontSize: 'medium',
      lineHeight: 'relaxed',
      margins: {
        top: '0.75in',
        bottom: '0.75in',
        left: '1in',
        right: '1in'
      }
    }
  }
};