import { CoverLetterTemplate, CoverLetterContent } from '@/types/cover-letter';
import { getCoverLetterTemplateById } from '@/lib/templates/cover-letter';

export interface GeneratedCoverLetter {
  id: string;
  templateId: string;
  content: CoverLetterContent;
  renderedHTML: string;
  metadata: {
    generatedAt: string;
    templateName: string;
    wordCount: number;
    estimatedReadingTime: number;
  };
}

export interface GenerationOptions {
  includeAIEnhancements?: boolean;
  aiModel?: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4o';
  enhanceLanguage?: boolean;
  improveStructure?: boolean;
}

/**
 * Main service for generating cover letters from templates and user content
 */
export class CoverLetterGenerator {
  /**
   * Generates a cover letter from template and user content
   */
  static async generate(
    templateId: string,
    content: CoverLetterContent,
    options: GenerationOptions = {}
  ): Promise<GeneratedCoverLetter> {
    const template = getCoverLetterTemplateById(templateId);

    if (!template) {
      throw new Error(`Template with ID '${templateId}' not found`);
    }

    // Validate required content
    this.validateContent(content, template);

    // Enhance content with AI if requested
    let enhancedContent = content;
    if (options.includeAIEnhancements) {
      enhancedContent = await this.enhanceWithAI(content, template, options);
    }

    // Generate the final cover letter
    const generatedCoverLetter = this.createCoverLetter(template, enhancedContent);

    return generatedCoverLetter;
  }

  /**
   * Validates that all required content sections are filled
   */
  private static validateContent(content: CoverLetterContent, template: CoverLetterTemplate): void {
    const requiredSections = template.structure.sections.filter(section => section.required);

    for (const section of requiredSections) {
      const value = this.getSectionValue(content, section.id);

      if (!value || (Array.isArray(value) && value.every(v => !v?.trim()))) {
        throw new Error(`Required section '${section.title}' is empty`);
      }
    }

    // Validate recipient information
    if (!content.recipient.name?.trim()) {
      throw new Error('Recipient name is required');
    }

    if (!content.recipient.company?.trim()) {
      throw new Error('Recipient company is required');
    }

    if (!content.recipient.position?.trim()) {
      throw new Error('Recipient position is required');
    }
  }

  /**
   * Gets the value of a specific section from the content
   */
  private static getSectionValue(content: CoverLetterContent, sectionId: string): any {
    switch (sectionId) {
      case 'recipient':
        return content.recipient;
      case 'salutation':
        return content.salutation;
      case 'introduction':
        return content.introduction;
      case 'body':
      case 'body-1':
      case 'body-2':
      case 'story':
      case 'value':
      case 'qualification':
      case 'achievement':
      case 'fit':
        return content.body;
      case 'conclusion':
      case 'closing':
      case 'call-to-action':
        return content.conclusion;
      case 'signature':
        return content.signature;
      default:
        return null;
    }
  }

  /**
   * Enhances content using AI services (placeholder for future implementation)
   */
  private static async enhanceWithAI(
    content: CoverLetterContent,
    template: CoverLetterTemplate,
    options: GenerationOptions
  ): Promise<CoverLetterContent> {
    // TODO: Implement AI enhancement logic
    // This would integrate with OpenAI, Claude, or other AI services
    // to improve language, structure, and content quality

    console.log('AI enhancement requested but not yet implemented', {
      options,
      template: template.id,
    });

    return content;
  }

  /**
   * Creates the final cover letter object
   */
  private static createCoverLetter(
    template: CoverLetterTemplate,
    content: CoverLetterContent
  ): GeneratedCoverLetter {
    const renderedHTML = this.renderCoverLetterHTML(template, content);
    const wordCount = this.calculateWordCount(content);

    return {
      id: `cl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      templateId: template.id,
      content,
      renderedHTML,
      metadata: {
        generatedAt: new Date().toISOString(),
        templateName: template.name,
        wordCount,
        estimatedReadingTime: Math.ceil(wordCount / 200), // Assuming 200 words per minute
      },
    };
  }

  /**
   * Renders the cover letter as HTML
   */
  private static renderCoverLetterHTML(template: CoverLetterTemplate, content: CoverLetterContent): string {
    const { recipient, salutation, introduction, body, conclusion, signature } = content;

    // Filter out empty body paragraphs
    const filteredBody = body.filter(paragraph => paragraph.trim().length > 0);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Cover Letter - ${recipient.name || 'Recipient'}</title>
        <style>
          body {
            font-family: ${template.structure.styling.fontFamily};
            font-size: ${template.structure.styling.fontSize === 'small' ? '12px' :
                        template.structure.styling.fontSize === 'large' ? '16px' : '14px'};
            line-height: ${template.structure.styling.lineHeight === 'tight' ? '1.2' :
                          template.structure.styling.lineHeight === 'relaxed' ? '1.6' : '1.4'};
            margin: ${template.structure.styling.margins.top} ${template.structure.styling.margins.right}
                     ${template.structure.styling.margins.bottom} ${template.structure.styling.margins.left};
            color: #1f2937;
            background: white;
            max-width: 8.5in;
          }
          .header {
            text-align: right;
            margin-bottom: 1.5rem;
          }
          .date {
            text-align: right;
            margin-bottom: 1.5rem;
          }
          .salutation {
            margin-bottom: 1rem;
          }
          .paragraph {
            margin-bottom: 1rem;
            text-align: justify;
          }
          .signature {
            margin-top: 2rem;
          }
          .signature-name {
            font-weight: 600;
          }
          @media print {
            body { margin: 0.5in; }
          }
        </style>
      </head>
      <body>
        <!-- Header with recipient information -->
        <div class="header">
          <div class="recipient-info">
            <div class="recipient-name">${recipient.name}</div>
            <div class="recipient-position">${recipient.position}</div>
            <div class="recipient-company">${recipient.company}</div>
            ${recipient.address ? `<div class="recipient-address">${recipient.address}</div>` : ''}
          </div>
        </div>

        <!-- Date -->
        <div class="date">
          ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>

        <!-- Salutation -->
        <div class="salutation">
          ${salutation || 'Dear Hiring Manager,'}
        </div>

        <!-- Introduction -->
        ${introduction ? `<div class="paragraph">${introduction}</div>` : ''}

        <!-- Body paragraphs -->
        ${filteredBody.map(paragraph => `
          <div class="paragraph">${paragraph}</div>
        `).join('')}

        <!-- Conclusion -->
        ${conclusion ? `<div class="paragraph">${conclusion}</div>` : ''}

        <!-- Signature -->
        <div class="signature">
          <div class="signature-name">${signature.name}</div>
          ${signature.title ? `<div class="signature-title">${signature.title}</div>` : ''}
          ${signature.phone ? `<div class="signature-contact">${signature.phone}</div>` : ''}
          ${signature.email ? `<div class="signature-contact">${signature.email}</div>` : ''}
        </div>
      </body>
      </html>
    `.trim();
  }

  /**
   * Calculates the word count of the cover letter content
   */
  private static calculateWordCount(content: CoverLetterContent): number {
    const text = [
      content.introduction,
      ...content.body,
      content.conclusion,
    ].join(' ');

    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Generates a preview of the cover letter (client-side)
   */
  static generatePreview(templateId: string, content: CoverLetterContent): string | null {
    const template = getCoverLetterTemplateById(templateId);
    if (!template) return null;

    return this.renderCoverLetterHTML(template, content);
  }
}