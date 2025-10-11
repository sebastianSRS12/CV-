'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Download, 
  ArrowLeft, 
  Brain,
  User,
  Briefcase,
  GraduationCap,
  Code,
  BarChart3,
  Save,
  Loader2,
  FileText,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
  ExternalLink,
  Copy,
  Share2,
  MoreVertical,
  RefreshCw,
  Home
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useCVData, type CVData } from '@/hooks/useCVData';
import { debounce } from 'lodash';
import { trackCVSave, trackPageView, trackPDFExport, trackAIAnalysis } from '@/lib/analytics';
import { EditorLayout } from '@/components/editor/EditorLayout';
import { AutoSaveIndicator } from '@/components/editor/AutoSaveIndicator';
import { 
  Button, 
  Input, 
  Textarea, 
  Label, 
  Switch, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardDescription,
  CardFooter,
  Tabs, 
  TabList, 
  Tab, 
  TabPanels, 
  TabPanel,
  Separator,
  Skeleton,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from '@/components/ui';
import PersonalInfoSection from '@/components/sections/PersonalInfoSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import EducationSection from '@/components/sections/EducationSection';
import SkillsSection from '@/components/sections/SkillsSection';
import CVAnalysisDashboard from '@/components/ui/CVAnalysisDashboard';

// Define types for AI analysis
interface AIAnalysis {
  overallScore: number;
  sectionAnalyses: Record<string, any>;
  recommendations: string[];
  strengths?: string[];
  weaknesses?: string[];
}

// Define tab types
type TabType = 'personal' | 'experience' | 'education' | 'skills' | 'analysis';

// Define analysis context type
interface AnalysisContextType {
  industry: string;
  level: string;
  targetRole: string;
  [key: string]: any;
}

// Type guard for error handling
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unknown error occurred';
};

const EditCVPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  const cvId = Array.isArray(id) ? id[0] : id || 'default-id';
  
  const { 
    cv, 
    updateField, 
    isLoading, 
    error: cvError,
    lastSaved, 
    manualSave,
    isSaving 
  } = useCVData(cvId);
  
  // State with proper typing
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [isImproving, setIsImproving] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | undefined>(undefined);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisContext, setAnalysisContext] = useState<AnalysisContextType | undefined>(undefined);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(true);
  const [arr, setArr] = useState<any[]>([]); // Generic array state as per request
  
  // Track page view on component mount
  useEffect(() => {
    trackPageView(`/cv/${cvId}/edit`);
  }, [cvId]);
  
  // Auto-save functionality with debouncing
  const debouncedSave = useCallback(
    debounce(async () => {
      if (autoSaveEnabled && !isSaving && cv) {
        try {
          await manualSave();
          trackCVSave(cvId, activeTab);
        } catch (err) {
          console.error('Error saving CV:', err);
          toast.error('Failed to save changes. Please try again.');
        }
      }
    }, 2000), // 2 second debounce
    [autoSaveEnabled, isSaving, cvId, activeTab, manualSave, cv]
  );
  
  // Trigger auto-save when CV data changes
  useEffect(() => {
    if (cv) {
      debouncedSave();
    }
    return () => {
      debouncedSave.cancel();
    };
  }, [cv, debouncedSave]);
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading your CV...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (cvError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error Loading CV</h2>
          <p className="text-gray-600 mb-6">
            {getErrorMessage(cvError)}
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button 
              onClick={() => router.push('/')}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Handle no CV found state
  if (!cv) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">CV Not Found</h2>
          <p className="text-gray-600 mb-6">
            The requested CV could not be found or you don't have permission to view it.
          </p>
          <Button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 mx-auto"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  // Type-safe field updater with proper type casting
  const updateCVField = (
    field: string,
    value: any
  ) => {
    // Type guard to ensure the field is a valid key of CVData['content']
    const validFields: (keyof CVData['content'])[] = [
      'personalInfo',
      'summary',
      'experiences',
      'educations',
      'skills'
    ];
    
    if (validFields.includes(field as keyof CVData['content'])) {
      updateField(field as keyof CVData['content'], value);
      
      // Track field updates for analytics
      if (field !== 'personalInfo') { // Don't track every keystroke in personal info
        trackCVSave(cvId, field);
      }
    } else {
      console.warn(`Attempted to update invalid field: ${field}`);
    }
  };
  
  // Wrapper function for section components to ensure type safety
  const getSectionProps = () => {
    if (!cv) {
      throw new Error('CV data is not available');
    }
    return {
      cv,
      updateField: updateCVField
    };
  };
  
  // Tab configuration with proper typing
  type TabConfig = {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    section: string;
    gradient: string;
  };

  const tabConfigs: TabConfig[] = [
    { 
      id: 'personal', 
      label: 'Personal Info', 
      icon: User, 
      section: 'personalInfo',
      gradient: 'from-blue-500 to-purple-600'
    },
    { 
      id: 'experience', 
      label: 'Experience', 
      icon: Briefcase, 
      section: 'experiences',
      gradient: 'from-purple-500 to-pink-600'
    },
    { 
      id: 'education', 
      label: 'Education', 
      icon: GraduationCap, 
      section: 'educations',
      gradient: 'from-pink-500 to-red-600'
    },
    { 
      id: 'skills', 
      label: 'Skills', 
      icon: Code, 
      section: 'skills',
      gradient: 'from-red-500 to-orange-600'
    },
    { 
      id: 'analysis', 
      label: 'Analysis', 
      icon: BarChart3, 
      section: 'analysis',
      gradient: 'from-orange-500 to-yellow-600'
    }
  ];

  const handleAIImprovement = async (section: string) => {
    if (!cv) return;
    
    setIsImproving(true);
    try {
      const response = await fetch('/api/ai/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData: cv, section }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to improve CV');
      }

      const { improvement, section: improvedSection } = await response.json();
      
      if (improvedSection === 'summary') {
        updateCVField('summary', improvement);
        toast.success('Summary improved with AI! ✨');
      }
    } catch (error) {
      console.error('AI improvement error:', error);
      toast.error('Failed to improve content. Please try again.');
    } finally {
      setIsImproving(false);
    }
  };

  const handleFullAIAnalysis = async () => {
    if (!cv) return;
    
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvData: cv,
          section: 'full'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze CV');
      }

      const result = await response.json();
      setAiAnalysis(result.analysis);
      setAnalysisContext(result.context);
      
      toast.success(result.message || 'CV analysis complete!');
    } catch (error) {
      console.error('AI analysis error:', error);
      toast.error('Failed to analyze CV. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportPDF = async () => {
    if (!cv) return;
    
    setIsExporting(true);
    try {
      const pdfData = {
        personalInfo: {
          name: cv.content.personalInfo?.fullName || 'Your Name',
          email: cv.content.personalInfo?.email || '',
          phone: cv.content.personalInfo?.phone || '',
          location: cv.content.personalInfo?.location || '',
          website: cv.content.personalInfo?.website || ''
        },
        summary: cv.content.summary || '',
        experience: cv.content.experiences.map((exp: any) => ({
          title: exp.position || '',
          company: exp.company || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          description: exp.description || ''
        })),
        education: cv.content.educations.map((edu: any) => ({
          degree: edu.degree || '',
          institution: edu.institution || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || '',
          field: edu.field || ''
        })),
        skills: cv.content.skills.map((skill: any) => ({
          name: skill.name || '',
          level: skill.level || 0
        }))
      };

      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pdfData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${cv?.content?.personalInfo?.fullName || 'CV'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      trackPDFExport(cvId);
      toast.success('CV exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export CV');
    } finally {
      setIsExporting(false);
    }
  };

  if (!cv) {
    return (
      <EditorLayout>
        <div className="p-8 text-center">
          <div className="text-2xl font-semibold mb-4">CV Not Found</div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">The requested CV could not be found or you don't have permission to view it.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </EditorLayout>
    );
  }

  return (
    <EditorLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-64 h-64 rounded-full opacity-20 blur-3xl ${
                i % 3 === 0 ? 'bg-pink-500' : i % 3 === 1 ? 'bg-cyan-500' : 'bg-yellow-500'
              }`}
              animate={{
                x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="flex items-center space-x-2">
              <AutoSaveIndicator isSaving={isSaving} lastSaved={lastSaved} />
              <button
                onClick={manualSave}
                disabled={isSaving}
                className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
            
            <motion.button
              onClick={handleExportPDF}
              disabled={isExporting}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="-ml-1 mr-2 h-4 w-4" />
                  Export PDF
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.nav className="relative mb-8">
          <div className="flex space-x-1 p-1 bg-black/20 backdrop-blur-md rounded-xl border border-white/10">
            {tabConfigs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id 
                      ? 'text-white' 
                      : 'text-white/70 hover:text-white/90 hover:bg-white/5'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.span
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-lg"
                      transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center">
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.nav>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          {activeTab === 'personal' && cv && (
            <PersonalInfoSection
              key="personal"
              cv={cv}
              updateField={updateCVField}
            />
          )}

          {activeTab === 'experience' && (
            <motion.div
              key="experience"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <ExperienceSection
                cv={cv}
                updateField={updateCVField}
              />
            </motion.div>
          )}

          {activeTab === 'education' && (
            <motion.div
              key="education"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <EducationSection
                cv={cv}
                updateField={updateCVField}
              />
            </motion.div>
          )}

          {activeTab === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <SkillsSection
                cv={cv}
                updateField={updateCVField}
              />
            </motion.div>
          )}

          {activeTab === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CVAnalysisDashboard
                analysis={aiAnalysis}
                context={analysisContext}
                onRunAnalysis={handleFullAIAnalysis}
                isAnalyzing={isAnalyzing}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10">
          <Toaster position="bottom-right" />
          <Toaster position="top-right" />
        </div>
        </div>
      </div>
    </EditorLayout>
  );
};

export default EditCVPage;
