import { CoverLetterTemplate } from '@/types/cover-letter';

export const PROFESSIONAL_TEMPLATE: CoverLetterTemplate = {
  id: 'professional-standard',
  name: 'Professional Standard',
  description: 'Clean, formal layout perfect for corporate and traditional industries',
  preview: '/templates/cover-letter-professional.png',
  category: 'professional',
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
        title: 'Introduction Paragraph',
        required: true,
        placeholder: 'Briefly introduce yourself and state the position you are applying for...',
        helpText: 'Grab attention and state your purpose'
      },
      {
        id: 'body-1',
        title: 'Body Paragraph 1',
        required: true,
        placeholder: 'Highlight your relevant experience and skills...',
        helpText: 'Showcase your qualifications'
      },
      {
        id: 'body-2',
        title: 'Body Paragraph 2',
        required: false,
        placeholder: 'Provide specific examples of your achievements...',
        helpText: 'Demonstrate your value with concrete examples'
      },
      {
        id: 'conclusion',
        title: 'Conclusion Paragraph',
        required: true,
        placeholder: 'Express your enthusiasm and call to action...',
        helpText: 'Reiterate interest and request next steps'
      },
      {
        id: 'signature',
        title: 'Signature',
        required: true,
        placeholder: 'Your full name and contact information',
        helpText: 'How you would like to sign off'
      }
    ],
    styling: {
      fontFamily: 'Times New Roman, serif',
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