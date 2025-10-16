import { CoverLetterTemplate } from '@/types/cover-letter';
import { PROFESSIONAL_TEMPLATE } from './professional';
import { CREATIVE_TEMPLATE } from './creative';
import { MINIMAL_TEMPLATE } from './minimal';

/**
 * Predefined cover letter templates with different styles and layouts
 * Each template includes metadata and content structure
 */
export const COVER_LETTER_TEMPLATES: CoverLetterTemplate[] = [
  PROFESSIONAL_TEMPLATE,
  CREATIVE_TEMPLATE,
  MINIMAL_TEMPLATE,
];

/**
 * Default cover letter content structure used when creating new cover letters
 * Provides empty but properly structured data for all cover letter sections
 */
export const DEFAULT_COVER_LETTER_CONTENT = {
  recipient: {
    name: '',
    company: '',
    position: '',
    address: '',
  },
  salutation: 'Dear Hiring Manager,',
  introduction: '',
  body: [''],
  conclusion: '',
  signature: {
    name: '',
    title: '',
    phone: '',
    email: '',
  },
};

/**
 * Sample cover letter content for demonstration purposes
 * Used in template previews and as example data
 */
export const SAMPLE_COVER_LETTER_CONTENT = {
  recipient: {
    name: 'Sarah Johnson',
    company: 'TechCorp Inc.',
    position: 'Senior Software Engineer',
    address: '123 Innovation Drive, San Francisco, CA 94105',
  },
  salutation: 'Dear Sarah Johnson,',
  introduction: 'I am excited to apply for the Senior Software Engineer position at TechCorp Inc. With over 5 years of experience in full-stack development and a passion for building scalable web applications, I am confident I would be a valuable addition to your engineering team.',
  body: [
    'In my current role at StartupXYZ, I have successfully led the development of three major product features that increased user engagement by 40%. I specialize in React, Node.js, and cloud technologies, and have a proven track record of delivering high-quality code on time and within budget.',
    'I am particularly drawn to TechCorp because of your innovative approach to solving complex technical challenges and your commitment to fostering a collaborative engineering culture. I am eager to bring my expertise in modern web development practices to contribute to your mission of building cutting-edge solutions.'
  ],
  conclusion: 'I would welcome the opportunity to discuss how my skills and experience align with TechCorp\'s needs. Thank you for considering my application. I look forward to the possibility of contributing to your team.',
  signature: {
    name: 'John Doe',
    title: 'Senior Software Engineer',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@example.com',
  },
};

/**
 * Gets a cover letter template by its ID
 * @param templateId - The unique identifier of the template
 * @returns The template object or undefined if not found
 */
export function getCoverLetterTemplateById(templateId: string): CoverLetterTemplate | undefined {
  return COVER_LETTER_TEMPLATES.find(template => template.id === templateId);
}

/**
 * Gets cover letter templates filtered by category
 * @param category - The template category to filter by
 * @returns Array of templates in the specified category
 */
export function getCoverLetterTemplatesByCategory(category: CoverLetterTemplate['category']): CoverLetterTemplate[] {
  return COVER_LETTER_TEMPLATES.filter(template => template.category === category);
}

/**
 * Gets all free cover letter templates (non-premium)
 * @returns Array of free templates
 */
export function getFreeCoverLetterTemplates(): CoverLetterTemplate[] {
  return COVER_LETTER_TEMPLATES.filter(template => !template.isPremium);
}

/**
 * Gets all premium cover letter templates
 * @returns Array of premium templates
 */
export function getPremiumCoverLetterTemplates(): CoverLetterTemplate[] {
  return COVER_LETTER_TEMPLATES.filter(template => template.isPremium);
}