'use client';

import React from 'react';
import { CoverLetterTemplate, CoverLetterContent } from '@/types/cover-letter';
import { SAMPLE_COVER_LETTER_CONTENT } from '@/lib/templates/cover-letter';

interface TemplatePreviewProps {
  template: CoverLetterTemplate;
  content?: CoverLetterContent;
  className?: string;
}

export function TemplatePreview({
  template,
  content = SAMPLE_COVER_LETTER_CONTENT,
  className = ''
}: TemplatePreviewProps) {
  const renderCoverLetterContent = () => {
    const { recipient, salutation, introduction, body, conclusion, signature } = content;

    return (
      <div
        className="bg-white text-gray-900 p-8 max-w-4xl mx-auto text-sm leading-relaxed"
        style={{
          fontFamily: template.structure.styling.fontFamily,
          lineHeight: template.structure.styling.lineHeight === 'tight' ? '1.2' :
                     template.structure.styling.lineHeight === 'relaxed' ? '1.6' : '1.4',
        }}
      >
        {/* Header with recipient information */}
        <div className="mb-6">
          <div className="text-right">
            <div className="font-semibold">{recipient.name}</div>
            <div>{recipient.position}</div>
            <div>{recipient.company}</div>
            {recipient.address && <div className="mt-1">{recipient.address}</div>}
          </div>
        </div>

        {/* Date */}
        <div className="mb-6">
          <div className="text-right">
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* Salutation */}
        <div className="mb-4">
          {salutation || 'Dear Hiring Manager,'}
        </div>

        {/* Introduction */}
        <div className="mb-4">
          {introduction || 'I am writing to express my interest in the available position at your company. With my background in the field, I am confident I can make a valuable contribution to your team.'}
        </div>

        {/* Body paragraphs */}
        {body.map((paragraph, index) => (
          <div key={index} className="mb-4">
            {paragraph || 'This paragraph would contain information about your relevant experience, skills, and achievements that make you a strong candidate for the position.'}
          </div>
        ))}

        {/* Conclusion */}
        <div className="mb-6">
          {conclusion || 'Thank you for considering my application. I would welcome the opportunity to discuss how my skills and experience can benefit your organization. I look forward to the possibility of contributing to your team.'}
        </div>

        {/* Signature */}
        <div className="mt-8">
          <div>{signature.name || 'John Doe'}</div>
          {signature.title && <div>{signature.title}</div>}
          {signature.email && <div>{signature.email}</div>}
          {signature.phone && <div>{signature.phone}</div>}
        </div>
      </div>
    );
  };

  return (
    <div className={`border rounded-lg overflow-hidden shadow-sm ${className}`}>
      {/* Template header */}
      <div className="bg-gray-50 px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{template.name}</h3>
            <p className="text-sm text-gray-600">{template.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              template.category === 'professional' ? 'bg-blue-100 text-blue-800' :
              template.category === 'creative' ? 'bg-purple-100 text-purple-800' :
              template.category === 'modern' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {template.category}
            </span>
            {template.isPremium && (
              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                Premium
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Preview content */}
      <div className="bg-gray-25 p-4" style={{ maxHeight: '600px', overflow: 'auto' }}>
        {renderCoverLetterContent()}
      </div>
    </div>
  );
}