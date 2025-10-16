'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CoverLetterTemplate, CoverLetterContent } from '@/types/cover-letter';
import { DEFAULT_COVER_LETTER_CONTENT } from '@/lib/templates/cover-letter';
import { TemplateSelector } from '@/components/cover-letter/TemplateSelector';
import { CoverLetterEditor } from '@/components/cover-letter/CoverLetterEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, FileText, Save, Download, Loader2 } from 'lucide-react';
import { CoverLetterGenerator, GeneratedCoverLetter } from '@/lib/cover-letter/generator';
import { exportCoverLetterToPDF } from '@/lib/pdf/pdf-generator';

export default function NewCoverLetterPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<CoverLetterTemplate | null>(null);
  const [coverLetterContent, setCoverLetterContent] = useState<CoverLetterContent>(DEFAULT_COVER_LETTER_CONTENT);
  const [currentStep, setCurrentStep] = useState<'template' | 'content' | 'preview'>('template');
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState<GeneratedCoverLetter | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleTemplateSelect = (template: CoverLetterTemplate) => {
    setSelectedTemplate(template);
    setCurrentStep('content');
  };

  const handleContentChange = (content: CoverLetterContent) => {
    setCoverLetterContent(content);
  };

  const handleSaveDraft = async () => {
    if (!selectedTemplate) return;

    setSaving(true);
    try {
      const response = await fetch('/api/cover-letter/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Draft - ${new Date().toLocaleDateString()}`,
          templateId: selectedTemplate.id,
          content: coverLetterContent,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to edit the saved draft
        router.push(`/cover-letter/${data.coverLetter.id}/edit`);
      }
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    try {
      const result = await CoverLetterGenerator.generate(
        selectedTemplate.id,
        coverLetterContent
      );
      setGeneratedCoverLetter(result);
      setCurrentStep('preview');
    } catch (error) {
      console.error('Error generating cover letter:', error);
      // TODO: Show error message to user
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!generatedCoverLetter) return;

    setIsDownloading(true);
    try {
      await exportCoverLetterToPDF(
        generatedCoverLetter.renderedHTML,
        `cover-letter-${coverLetterContent.recipient.name?.replace(/\s+/g, '-') || 'download'}.pdf`
      );
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // TODO: Show error message to user
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadDOCX = async () => {
    if (!generatedCoverLetter) return;

    setIsDownloading(true);
    try {
      // TODO: Implement DOCX export
      // For now, we'll copy the HTML to clipboard as a workaround
      await navigator.clipboard.writeText(generatedCoverLetter.renderedHTML);
      alert('Cover letter content copied to clipboard! You can paste it into a word processor.');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      // TODO: Show error message to user
    } finally {
      setIsDownloading(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: 'template', label: 'Choose Template', active: currentStep === 'template' },
      { id: 'content', label: 'Add Content', active: currentStep === 'content', disabled: !selectedTemplate },
      { id: 'preview', label: 'Preview & Download', active: currentStep === 'preview', disabled: currentStep !== 'preview' },
    ];

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              step.active
                ? 'bg-primary-500 border-primary-500 text-white'
                : step.disabled
                  ? 'border-gray-300 text-gray-400'
                  : 'bg-white border-primary-500 text-primary-600'
            }`}>
              {step.active ? (
                <span className="text-sm font-semibold">{index + 1}</span>
              ) : (
                <span className="text-sm font-semibold text-gray-400">{index + 1}</span>
              )}
            </div>
            <div className={`mx-4 text-sm ${
              step.active ? 'text-primary-600 font-semibold' : 'text-gray-500'
            }`}>
              {step.label}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-2 ${
                step.active || steps[index + 1].active ? 'bg-primary-500' : 'bg-gray-300'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderContentStep = () => {
    if (!selectedTemplate) return null;

    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Customize Your Cover Letter
          </CardTitle>
          <CardDescription>
            Fill in the details below to create your personalized cover letter using the {selectedTemplate.name} template.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* TODO: Replace with CoverLetterEditor component */}
            <CoverLetterEditor
              template={selectedTemplate}
              content={coverLetterContent}
              onChange={setCoverLetterContent}
            />

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep('template')}>
                ← Back to Templates
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSaveDraft}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button onClick={handleGenerateCoverLetter}>
                  Generate Cover Letter
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPreviewStep = () => {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Cover Letter Preview
          </CardTitle>
          <CardDescription>
            Review your generated cover letter and download it in your preferred format.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {generatedCoverLetter ? (
              <>
                {/* Cover Letter Preview */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {generatedCoverLetter.metadata.templateName}
                      </span>
                      <div className="text-xs text-gray-500">
                        {generatedCoverLetter.metadata.wordCount} words • {generatedCoverLetter.metadata.estimatedReadingTime} min read
                      </div>
                    </div>
                  </div>
                  <div
                    className="p-8 bg-white"
                    dangerouslySetInnerHTML={{ __html: generatedCoverLetter.renderedHTML }}
                    style={{
                      fontFamily: 'serif',
                      lineHeight: '1.4',
                      color: '#1f2937'
                    }}
                  />
                </div>

                {/* Download Options */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Download Options</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Your cover letter is ready! Download it in your preferred format.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleDownloadPDF}
                      disabled={isDownloading}
                      className="flex-1"
                    >
                      {isDownloading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      Download PDF
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleDownloadDOCX}
                      disabled={isDownloading}
                      className="flex-1"
                    >
                      {isDownloading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      Copy for Word
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Cover Letter...</h3>
                <p className="text-gray-600">
                  Please wait while we generate your cover letter.
                </p>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep('content')}>
                ← Back to Editor
              </Button>
              <Button
                onClick={() => setCurrentStep('content')}
                variant="outline"
              >
                Edit Content
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderStepIndicator()}

        {currentStep === 'template' && (
          <TemplateSelector
            selectedTemplateId={selectedTemplate?.id}
            onSelectTemplate={handleTemplateSelect}
          />
        )}

        {currentStep === 'content' && renderContentStep()}

        {currentStep === 'preview' && renderPreviewStep()}
      </div>
    </div>
  );
}