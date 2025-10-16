'use client';

import React, { useState } from 'react';
import { CoverLetterTemplate, CoverLetterContent } from '@/types/cover-letter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CoverLetterEditorProps {
  template: CoverLetterTemplate;
  content: CoverLetterContent;
  onChange: (content: CoverLetterContent) => void;
  className?: string;
}

export function CoverLetterEditor({
  template,
  content,
  onChange,
  className = '',
}: CoverLetterEditorProps) {
  const [activeSection, setActiveSection] = useState<string>('recipient');

  const updateContent = (updates: Partial<CoverLetterContent>) => {
    onChange({ ...content, ...updates });
  };

  const updateRecipient = (field: keyof CoverLetterContent['recipient'], value: string) => {
    updateContent({
      recipient: { ...content.recipient, [field]: value }
    });
  };

  const updateSignature = (field: keyof CoverLetterContent['signature'], value: string) => {
    updateContent({
      signature: { ...content.signature, [field]: value }
    });
  };

  const addBodyParagraph = () => {
    updateContent({
      body: [...content.body, '']
    });
  };

  const updateBodyParagraph = (index: number, value: string) => {
    const newBody = [...content.body];
    newBody[index] = value;
    updateContent({ body: newBody });
  };

  const removeBodyParagraph = (index: number) => {
    if (content.body.length > 1) {
      updateContent({
        body: content.body.filter((_, i) => i !== index)
      });
    }
  };

  const renderSection = (sectionId: string) => {
    const section = template.structure.sections.find(s => s.id === sectionId);
    if (!section) return null;

    switch (sectionId) {
      case 'recipient':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recipient-name">Recipient Name</Label>
                <Input
                  id="recipient-name"
                  value={content.recipient.name}
                  onChange={(e) => updateRecipient('name', e.target.value)}
                  placeholder="e.g., Sarah Johnson"
                />
              </div>
              <div>
                <Label htmlFor="recipient-position">Position</Label>
                <Input
                  id="recipient-position"
                  value={content.recipient.position}
                  onChange={(e) => updateRecipient('position', e.target.value)}
                  placeholder="e.g., Hiring Manager"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="recipient-company">Company</Label>
              <Input
                id="recipient-company"
                value={content.recipient.company}
                onChange={(e) => updateRecipient('company', e.target.value)}
                placeholder="e.g., TechCorp Inc."
              />
            </div>
            <div>
              <Label htmlFor="recipient-address">Address (Optional)</Label>
              <Input
                id="recipient-address"
                value={content.recipient.address || ''}
                onChange={(e) => updateRecipient('address', e.target.value)}
                placeholder="e.g., 123 Innovation Drive, San Francisco, CA 94105"
              />
            </div>
          </div>
        );

      case 'salutation':
        return (
          <div>
            <Label htmlFor="salutation">Salutation</Label>
            <Input
              id="salutation"
              value={content.salutation || ''}
              onChange={(e) => updateContent({ salutation: e.target.value })}
              placeholder="e.g., Dear Hiring Manager,"
            />
          </div>
        );

      case 'introduction':
        return (
          <div>
            <Label htmlFor="introduction">Introduction Paragraph</Label>
            <Textarea
              id="introduction"
              rows={4}
              value={content.introduction}
              onChange={(e) => updateContent({ introduction: e.target.value })}
              placeholder={section.placeholder}
            />
          </div>
        );

      case 'body-1':
      case 'body-2':
      case 'story':
      case 'value':
      case 'qualification':
      case 'achievement':
      case 'fit':
        const bodyIndex = sectionId === 'body-1' ? 0 : 1;
        return (
          <div>
            <Label htmlFor={`body-${bodyIndex}`}>{section.title}</Label>
            <Textarea
              id={`body-${bodyIndex}`}
              rows={4}
              value={content.body[bodyIndex] || ''}
              onChange={(e) => updateBodyParagraph(bodyIndex, e.target.value)}
              placeholder={section.placeholder}
            />
          </div>
        );

      case 'passion':
      case 'body':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Body Paragraphs</Label>
              <Button type="button" variant="outline" size="sm" onClick={addBodyParagraph}>
                <Plus className="w-4 h-4 mr-2" />
                Add Paragraph
              </Button>
            </div>
            {content.body.map((paragraph, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1">
                  <Textarea
                    rows={3}
                    value={paragraph}
                    onChange={(e) => updateBodyParagraph(index, e.target.value)}
                    placeholder={`Paragraph ${index + 1}...`}
                  />
                </div>
                {content.body.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeBodyParagraph(index)}
                    className="self-start"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        );

      case 'conclusion':
      case 'closing':
      case 'call-to-action':
        return (
          <div>
            <Label htmlFor="conclusion">{section.title}</Label>
            <Textarea
              id="conclusion"
              rows={4}
              value={content.conclusion}
              onChange={(e) => updateContent({ conclusion: e.target.value })}
              placeholder={section.placeholder}
            />
          </div>
        );

      case 'signature':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="signature-name">Full Name</Label>
              <Input
                id="signature-name"
                value={content.signature.name}
                onChange={(e) => updateSignature('name', e.target.value)}
                placeholder="e.g., John Doe"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="signature-title">Job Title (Optional)</Label>
                <Input
                  id="signature-title"
                  value={content.signature.title || ''}
                  onChange={(e) => updateSignature('title', e.target.value)}
                  placeholder="e.g., Software Engineer"
                />
              </div>
              <div>
                <Label htmlFor="signature-phone">Phone (Optional)</Label>
                <Input
                  id="signature-phone"
                  value={content.signature.phone || ''}
                  onChange={(e) => updateSignature('phone', e.target.value)}
                  placeholder="e.g., +1 (555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="signature-email">Email (Optional)</Label>
                <Input
                  id="signature-email"
                  value={content.signature.email || ''}
                  onChange={(e) => updateSignature('email', e.target.value)}
                  placeholder="e.g., john@example.com"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cover Letter Sections</CardTitle>
          <CardDescription>
            Complete each section to build your cover letter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {template.structure.sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`p-3 text-left rounded-lg border transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary-50 border-primary-200 text-primary-700'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{section.title}</span>
                  {section.required && (
                    <span className="text-xs text-red-500">*</span>
                  )}
                </div>
                {section.helpText && (
                  <p className="text-xs text-gray-600 mt-1">{section.helpText}</p>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Section Editor */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>
              {template.structure.sections.find(s => s.id === activeSection)?.title}
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    {template.structure.sections.find(s => s.id === activeSection)?.helpText}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          {renderSection(activeSection)}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            const currentIndex = template.structure.sections.findIndex(s => s.id === activeSection);
            if (currentIndex > 0) {
              setActiveSection(template.structure.sections[currentIndex - 1].id);
            }
          }}
          disabled={template.structure.sections.findIndex(s => s.id === activeSection) === 0}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {template.structure.sections.map((section) => (
            <div
              key={section.id}
              className={`w-2 h-2 rounded-full ${
                content[section.id as keyof CoverLetterContent]?.toString().trim()
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
              title={section.title}
            />
          ))}
        </div>

        <Button
          onClick={() => {
            const currentIndex = template.structure.sections.findIndex(s => s.id === activeSection);
            if (currentIndex < template.structure.sections.length - 1) {
              setActiveSection(template.structure.sections[currentIndex + 1].id);
            }
          }}
          disabled={template.structure.sections.findIndex(s => s.id === activeSection) === template.structure.sections.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}