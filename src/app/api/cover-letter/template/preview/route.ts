import { NextRequest, NextResponse } from 'next/server';
import { getCoverLetterTemplateById, SAMPLE_COVER_LETTER_CONTENT } from '@/lib/templates/cover-letter';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get('templateId');

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
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

    // Render the template with sample data
    const html = renderTemplatePreview(template, SAMPLE_COVER_LETTER_CONTENT);

    return NextResponse.json({
      template,
      html,
      sampleData: SAMPLE_COVER_LETTER_CONTENT,
    });

  } catch (error) {
    console.error('Error generating template preview:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function renderTemplatePreview(template: any, content: any): string {
  const { recipient, salutation, introduction, body, conclusion, signature } = content;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${template.name} - Preview</title>
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
        }
      </style>
    </head>
    <body>
      <!-- Header with recipient information -->
      <div style="margin-bottom: 24px; text-align: right;">
        <div style="font-weight: 600;">${recipient.name}</div>
        <div>${recipient.position}</div>
        <div>${recipient.company}</div>
        ${recipient.address ? `<div style="margin-top: 4px;">${recipient.address}</div>` : ''}
      </div>

      <!-- Date -->
      <div style="margin-bottom: 24px; text-align: right;">
        <div>${new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</div>
      </div>

      <!-- Salutation -->
      <div style="margin-bottom: 16px;">
        ${salutation || 'Dear Hiring Manager,'}
      </div>

      <!-- Introduction -->
      <div style="margin-bottom: 16px;">
        ${introduction || 'I am writing to express my interest in the available position at your company. With my background in the field, I am confident I can make a valuable contribution to your team.'}
      </div>

      <!-- Body paragraphs -->
      ${body.map((paragraph: string) => `
        <div style="margin-bottom: 16px;">
          ${paragraph || 'This paragraph would contain information about your relevant experience, skills, and achievements that make you a strong candidate for the position.'}
        </div>
      `).join('')}

      <!-- Conclusion -->
      <div style="margin-bottom: 24px;">
        ${conclusion || 'Thank you for considering my application. I would welcome the opportunity to discuss how my skills and experience can benefit your organization. I look forward to the possibility of contributing to your team.'}
      </div>

      <!-- Signature -->
      <div style="margin-top: 32px;">
        <div>${signature.name || 'John Doe'}</div>
        ${signature.title ? `<div>${signature.title}</div>` : ''}
        ${signature.email ? `<div>${signature.email}</div>` : ''}
        ${signature.phone ? `<div>${signature.phone}</div>` : ''}
      </div>
    </body>
    </html>
  `.trim();
}