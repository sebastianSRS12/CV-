'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CoverLetterTemplate, CoverLetterContent } from '@/types/cover-letter';
import { DEFAULT_COVER_LETTER_CONTENT } from '@/lib/templates/cover-letter';
import { CoverLetterEditor } from '@/components/cover-letter/CoverLetterEditor';
import { TemplatePreviewModal } from '@/components/cover-letter/TemplatePreviewModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Eye, Download, Loader2 } from 'lucide-react';
import { CoverLetterGenerator } from '@/lib/cover-letter/generator';
import { exportCoverLetterToPDF } from '@/lib/pdf/pdf-generator';

interface CoverLetterDraft {
  id: string;
  title: string;
  templateId: string;
  content: CoverLetterContent;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EditCoverLetterPage() {
  const params = useParams();
  const router = useRouter();
  const draftId = params.id as string;

  const [draft, setDraft] = useState<CoverLetterDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<CoverLetterTemplate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Fetch draft data
  useEffect(() => {
    if (draftId) {
      fetchDraft();
    }
  }, [draftId]);

  const fetchDraft = async () => {
    try {
      const response = await fetch(`/api/cover-letter/drafts/${draftId}`);
      if (response.ok) {
        const data = await response.json();
        setDraft(data.draft);
      } else {
        console.error('Failed to fetch draft');
        router.push('/cover-letter/drafts');
      }
    } catch (error) {
      console.error('Error fetching draft:', error);
      router.push('/cover-letter/drafts');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!draft) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/cover-letter/drafts/${draft.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: draft.title,
          templateId: draft.templateId,
          content: draft.content,
        }),
      });

      if (response.ok) {
        // Show success message or update UI
        console.log('Draft saved successfully');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    if (draft) {
      setDraft({ ...draft, title: newTitle });
    }
  };

  const handleContentChange = (newContent: CoverLetterContent) => {
    if (draft) {
      setDraft({ ...draft, content: newContent });
    }
  };

  const handleGeneratePreview = async () => {
    if (!draft) return;

    setGenerating(true);
    try {
      const result = await CoverLetterGenerator.generate(
        draft.templateId,
        draft.content
      );

      // Create a temporary preview
      const previewWindow = window.open();
      if (previewWindow) {
        previewWindow.document.write(result.renderedHTML);
        previewWindow.document.close();
      }
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!draft) return;

    try {
      const result = await CoverLetterGenerator.generate(
        draft.templateId,
        draft.content
      );

      await exportCoverLetterToPDF(
        result.renderedHTML,
        `cover-letter-${draft.title.replace(/\s+/g, '-')}.pdf`
      );
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading draft...</p>
        </div>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Draft not found</p>
          <Button onClick={() => router.push('/cover-letter/drafts')} className="mt-4" aria-label="Go back to cover letter drafts">
            Back to Drafts
          </Button>
        </div>
      </div>
    );
  }

  const template = getCoverLetterTemplateById(draft.templateId);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => router.push('/cover-letter/drafts')} aria-label="Go back to cover letter drafts">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Drafts
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Cover Letter</h1>
                <p className="text-gray-600 mt-1">Customize your cover letter content</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleGeneratePreview} disabled={generating} aria-label="Generate cover letter preview">
                {generating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Eye className="w-4 h-4 mr-2" />
                )}
                Preview
              </Button>
              <Button variant="outline" onClick={handleDownloadPDF} aria-label="Download cover letter as PDF">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={handleSaveDraft} disabled={saving} aria-label="Save cover letter draft">
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Draft
              </Button>
            </div>
          </div>
        </div>

        {/* Title Editor */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cover Letter Title</CardTitle>
            <CardDescription>
              Give your cover letter a descriptive title to easily identify it later
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={draft.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., Software Engineer Application - TechCorp"
              />
            </div>
          </CardContent>
        </Card>

        {/* Template Info */}
        {template && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Template: {template.name}
                <button
                  onClick={() => {
                    setPreviewTemplate(template);
                    setIsPreviewOpen(true);
                  }}
                  className="text-sm text-primary-600 hover:text-primary-800 underline"
                >
                  Preview Template
                </button>
              </CardTitle>
            </CardHeader>
          </Card>
        )}

        {/* Editor */}
        {template && (
          <CoverLetterEditor
            template={template}
            content={draft.content}
            onChange={handleContentChange}
          />
        )}

        {/* Footer Actions */}
        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={() => router.push('/cover-letter/drafts')} aria-label="Cancel and go back to drafts">
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadPDF} aria-label="Download cover letter as PDF">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={handleSaveDraft} disabled={saving} aria-label="Save cover letter changes">
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Template Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onSelectTemplate={() => {}} // Not needed in edit mode
      />
    </div>
  );
}