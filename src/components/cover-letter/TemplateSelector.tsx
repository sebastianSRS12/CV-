'use client';

import React, { useState } from 'react';
import { CoverLetterTemplate } from '@/types/cover-letter';
import { COVER_LETTER_TEMPLATES } from '@/lib/templates/cover-letter';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Star } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplateId?: string;
  onSelectTemplate: (template: CoverLetterTemplate) => void;
  showPreview?: boolean;
}

export function TemplateSelector({
  selectedTemplateId,
  onSelectTemplate,
  showPreview = true,
}: TemplateSelectorProps) {
  const [previewTemplate, setPreviewTemplate] = useState<CoverLetterTemplate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePreviewTemplate = (template: CoverLetterTemplate) => {
    if (!showPreview) return;

    setPreviewTemplate(template);
    setIsPreviewOpen(true);
  };

  const handleSelectTemplate = (template: CoverLetterTemplate) => {
    onSelectTemplate(template);
  };

  const getCategoryColor = (category: CoverLetterTemplate['category']) => {
    switch (category) {
      case 'professional':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'creative':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'modern':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'traditional':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose a Template</h2>
          <p className="text-gray-600">
            Select a cover letter template that matches your style and the position you're applying for.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COVER_LETTER_TEMPLATES.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedTemplateId === template.id
                  ? 'ring-2 ring-primary-500 shadow-lg'
                  : 'hover:shadow-md'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {template.name}
                      {template.isPremium && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {template.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Badge className={getCategoryColor(template.category)}>
                    {template.category}
                  </Badge>
                  {template.isPremium && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Premium
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex gap-2">
                  {showPreview && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreviewTemplate(template)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  )}
                  <Button
                    onClick={() => handleSelectTemplate(template)}
                    disabled={template.isPremium}
                    className="flex-1"
                    variant={selectedTemplateId === template.id ? "default" : "outline"}
                  >
                    {template.isPremium ? 'Upgrade' : 'Select'}
                  </Button>
                </div>

                {template.isPremium && (
                  <p className="text-xs text-yellow-600 mt-2 text-center">
                    Premium template - upgrade required
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedTemplateId && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-green-900">Template Selected</h3>
                <p className="text-sm text-green-700">
                  {COVER_LETTER_TEMPLATES.find(t => t.id === selectedTemplateId)?.name} - Ready to customize
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const template = COVER_LETTER_TEMPLATES.find(t => t.id === selectedTemplateId);
                  if (template) handlePreviewTemplate(template);
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview Again
              </Button>
            </div>
          </div>
        )}
      </div>

      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </>
  );
}