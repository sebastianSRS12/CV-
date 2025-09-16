'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CV_TEMPLATES, getTemplatesByCategory, getFreeTemplates, getPremiumTemplates } from '@/lib/templates/cv-templates';
import { useCVList } from '@/lib/hooks/use-cv';

/**
 * Templates page component that displays available CV templates
 * Allows users to browse and select templates for creating new CVs
 * Includes filtering by category and premium status
 */
export default function TemplatesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { createCV, loading } = useCVList();
  
  // State for filtering templates
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  /**
   * Handles template selection and CV creation
   * Redirects to CV editor after successful creation
   * @param templateId - The ID of the selected template
   */
  const handleSelectTemplate = async (templateId: string) => {
    if (!session) {
      // Redirect to sign-in if user is not authenticated
      router.push('/auth/signin');
      return;
    }

    try {
      // Create new CV with selected template
      const newCV = await createCV(`New CV - ${templateId}`, {
        // Initialize with default content structure
        personalInfo: {
          fullName: '',
          email: session.user?.email || '',
        },
      });
      
      // Redirect to CV editor
      router.push(`/cv/${newCV.id}/edit`);
    } catch (error) {
      console.error('Failed to create CV:', error);
    }
  };

  /**
   * Filters templates based on selected category and premium status
   * @returns Array of filtered templates
   */
  const getFilteredTemplates = () => {
    let filtered = CV_TEMPLATES;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = getTemplatesByCategory(selectedCategory as any);
    }

    // Filter by premium status
    if (showPremiumOnly) {
      filtered = getPremiumTemplates();
    }

    return filtered;
  };

  const filteredTemplates = getFilteredTemplates();
  const categories = ['all', 'modern', 'classic', 'creative', 'minimal'];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your CV Template
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select from our professionally designed templates to create a standout CV that gets you noticed.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>

          {/* Premium Filter */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="premium-filter"
              checked={showPremiumOnly}
              onChange={(e) => setShowPremiumOnly(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="premium-filter" className="text-sm text-gray-700">
              Premium only
            </label>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                {/* Template Preview Image */}
                <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm">Preview</p>
                  </div>
                </div>

                {/* Template Info */}
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  {template.isPremium && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                      Premium
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  {template.description}
                </p>

                {/* Category Badge */}
                <div className="flex justify-between items-center">
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded capitalize">
                    {template.category}
                  </span>
                  
                  {/* Select Button */}
                  <Button
                    onClick={() => handleSelectTemplate(template.id)}
                    disabled={loading}
                    size="sm"
                  >
                    {loading ? 'Creating...' : 'Use Template'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Templates Message */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more templates.</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need a custom template?
          </h2>
          <p className="text-gray-600 mb-6">
            Contact us to create a personalized template that matches your industry and style.
          </p>
          <Button variant="outline">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
