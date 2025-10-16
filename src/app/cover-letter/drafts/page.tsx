'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { CoverLetterTemplate, CoverLetterContent } from '@/types/cover-letter';
import { getCoverLetterTemplateById } from '@/lib/templates/cover-letter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Download,
  Copy,
  Loader2
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/dialog';

interface CoverLetterDraft {
  id: string;
  title: string;
  templateId: string;
  isDraft: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CoverLetterDraftsPage() {
  const { data: session } = useSession();
  const [drafts, setDrafts] = useState<CoverLetterDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (session === null) {
      window.location.href = '/auth/signin';
    }
  }, [session]);

  // Fetch drafts
  useEffect(() => {
    if (session?.user?.id) {
      fetchDrafts();
    }
  }, [session]);

  const fetchDrafts = async () => {
    try {
      const response = await fetch('/api/cover-letter/drafts');
      if (response.ok) {
        const data = await response.json();
        setDrafts(data.drafts);
      }
    } catch (error) {
      console.error('Error fetching drafts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDraft = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/cover-letter/drafts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDrafts(drafts.filter(draft => draft.id !== id));
      }
    } catch (error) {
      console.error('Error deleting draft:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDuplicateDraft = async (draft: CoverLetterDraft) => {
    try {
      const response = await fetch('/api/cover-letter/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `${draft.title} (Copy)`,
          templateId: draft.templateId,
          content: {}, // Will be filled when editing
        }),
      });

      if (response.ok) {
        fetchDrafts(); // Refresh the list
      }
    } catch (error) {
      console.error('Error duplicating draft:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTemplateInfo = (templateId: string) => {
    const template = getCoverLetterTemplateById(templateId);
    return template ? {
      name: template.name,
      category: template.category,
      isPremium: template.isPremium,
    } : {
      name: 'Unknown Template',
      category: 'unknown' as const,
      isPremium: false,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your drafts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cover Letter Drafts</h1>
              <p className="text-gray-600 mt-1">
                Manage your saved cover letter drafts and create new ones
              </p>
            </div>
            <Link href="/cover-letter/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Cover Letter
              </Button>
            </Link>
          </div>
        </div>

        {/* Drafts Grid */}
        {drafts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drafts.map((draft) => {
              const templateInfo = getTemplateInfo(draft.templateId);

              return (
                <Card key={draft.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">
                          {draft.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {templateInfo.name}
                        </CardDescription>
                      </div>
                      <Badge
                        className={`ml-2 ${
                          templateInfo.category === 'professional' ? 'bg-blue-100 text-blue-800' :
                          templateInfo.category === 'creative' ? 'bg-purple-100 text-purple-800' :
                          templateInfo.category === 'modern' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {templateInfo.category}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Dates */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Created {formatDate(draft.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Updated {formatDate(draft.updatedAt)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link href={`/cover-letter/${draft.id}/edit`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDuplicateDraft(draft)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Draft</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{draft.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteDraft(draft.id)}
                                disabled={deletingId === draft.id}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {deletingId === draft.id ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                  </>
                                ) : (
                                  'Delete'
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="pt-12 pb-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <CardTitle className="text-xl mb-2">No Cover Letter Drafts Yet</CardTitle>
              <CardDescription className="mb-6">
                Create your first cover letter draft to get started. You can save multiple drafts and work on them over time.
              </CardDescription>
              <Link href="/cover-letter/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Cover Letter
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}