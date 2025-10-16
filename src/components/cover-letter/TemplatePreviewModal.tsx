'use client';

import React from 'react';
import { CoverLetterTemplate } from '@/types/cover-letter';
import { TemplatePreview } from './TemplatePreview';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TemplatePreviewModalProps {
  template: CoverLetterTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: CoverLetterTemplate) => void;
}

export function TemplatePreviewModal({
  template,
  isOpen,
  onClose,
  onSelectTemplate,
}: TemplatePreviewModalProps) {
  if (!template) return null;

  const handleSelectTemplate = () => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>{template.name}</span>
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
          </DialogTitle>
          <DialogDescription>
            {template.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <TemplatePreview template={template} />
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            {template.isPremium ? (
              <span className="text-yellow-600 font-medium">
                Premium template - Upgrade required for full access
              </span>
            ) : (
              'Free template - Ready to use'
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSelectTemplate}
              disabled={template.isPremium}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                template.isPremium
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {template.isPremium ? 'Upgrade Required' : 'Use This Template'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}