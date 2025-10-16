import { NextRequest, NextResponse } from 'next/server';
import { getCoverLetterTemplateById } from '@/lib/templates/cover-letter';
import { CoverLetterContent } from '@/types/cover-letter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, content }: { templateId: string; content: CoverLetterContent } = body;

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: 'Cover letter content is required' },
        { status: 400 }
      );
    }

    const template = getCoverLetterTemplateById(templateId);

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Generate the final cover letter
    const generatedCoverLetter = generateCoverLetter(template, content);

    return NextResponse.json({
      success: true,
      coverLetter: generatedCoverLetter,
      template,
    });

  } catch (error) {
    console.error('Error generating cover letter:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateCoverLetter(template: any, content: CoverLetterContent) {
  const { recipient, salutation, introduction, body, conclusion, signature } = content;

  // Filter out empty body paragraphs
  const filteredBody = body.filter(paragraph => paragraph.trim().length > 0);

  return {
    id: `temp-${Date.now()}`, // Temporary ID for preview
    templateId: template.id,
    content: {
      recipient,
      salutation: salutation || 'Dear Hiring Manager,',
      introduction,
      body: filteredBody,
      conclusion,
      signature,
    },
    renderedHTML: renderCoverLetterHTML(template, content),
    metadata: {
      generatedAt: new Date().toISOString(),
      templateName: template.name,
      wordCount: calculateWordCount(content),
      estimatedReadingTime: Math.ceil(calculateWordCount(content) / 200), // Assuming 200 words per minute
    },
  };
}

function renderCoverLetterHTML(template: any, content: CoverLetterContent): string {
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

function calculateWordCount(content: CoverLetterContent): number {
  const text = [
    content.introduction,
    ...content.body,
    content.conclusion,
  ].join(' ');

  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}