'use client';

import { useState } from 'react';
import { useCV } from '@/lib/hooks/use-cv';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonalInfoSection } from './sections/personal-info-section';
import { ExperienceSection } from './sections/experience-section';
import { EducationSection } from './sections/education-section';
import { SkillsSection } from './sections/skills-section';

interface CVEditorProps {
  cvId: string;
}

export function CVEditor({ cvId }: CVEditorProps) {
  const { cv, loading, error, updateCV, updateContent } = useCV(cvId);
  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading CV</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900">CV Not Found</h3>
            <p className="text-gray-500 mt-2">The CV you're looking for doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateCV(cv);
    } catch (error) {
      console.error('Failed to save CV:', error);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Input
                value={cv.title}
                onChange={(e) => updateCV({ ...cv, title: e.target.value })}
                className="text-xl font-semibold border-none shadow-none p-0 focus:ring-0"
                placeholder="CV Title"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => window.history.back()}>
                Cancel
              </Button>
              <Button onClick={handleSave} loading={saving}>
                Save Changes
              </Button>
            </div>
          </div>
          
          {/* Tabs */}
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="space-y-6">
            {activeTab === 'personal' && (
              <PersonalInfoSection
                personalInfo={cv.content.personalInfo}
                summary={cv.content.summary}
                onUpdate={(data) => updateContent(data)}
              />
            )}
            {activeTab === 'experience' && (
              <ExperienceSection
                experience={cv.content.experience}
                onUpdate={(experience) => updateContent({ experience })}
              />
            )}
            {activeTab === 'education' && (
              <EducationSection
                education={cv.content.education}
                onUpdate={(education) => updateContent({ education })}
              />
            )}
            {activeTab === 'skills' && (
              <SkillsSection
                skills={cv.content.skills}
                onUpdate={(skills) => updateContent({ skills })}
              />
            )}
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-8">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {cv.content.personalInfo?.fullName || 'Your Name'}
                    </h1>
                    <p className="text-gray-600">
                      {cv.content.personalInfo?.email || 'your.email@example.com'}
                    </p>
                  </div>
                  
                  {cv.content.summary && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-2">Summary</h2>
                      <p className="text-gray-700">{cv.content.summary}</p>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500 text-center">
                    Full preview coming soon...
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
