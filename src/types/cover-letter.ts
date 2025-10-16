export interface CoverLetterRecipient {
  name: string;
  company: string;
  position: string;
  address?: string;
}

export interface CoverLetterContent {
  recipient: CoverLetterRecipient;
  salutation?: string;
  introduction: string;
  body: string[];
  conclusion: string;
  signature: {
    name: string;
    title?: string;
    phone?: string;
    email?: string;
  };
}

export interface CoverLetterTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'professional' | 'creative' | 'modern' | 'traditional';
  isPremium: boolean;
  structure: {
    sections: Array<{
      id: string;
      title: string;
      required: boolean;
      placeholder?: string;
      helpText?: string;
    }>;
    styling: {
      fontFamily: string;
      fontSize: 'small' | 'medium' | 'large';
      lineHeight: 'tight' | 'normal' | 'relaxed';
      margins: {
        top: string;
        bottom: string;
        left: string;
        right: string;
      };
    };
  };
}

export interface CoverLetter {
  id: string;
  userId: string;
  title: string;
  slug: string;
  templateId: string;
  content: CoverLetterContent;
  isDraft: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CoverLetterDraft extends Omit<CoverLetter, 'isDraft'> {
  isDraft: true;
}

export type CoverLetterSection = keyof CoverLetterContent;