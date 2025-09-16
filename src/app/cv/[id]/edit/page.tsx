'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
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
  BarChart3
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useCVData } from '@/hooks/useCVData';
import SaveIndicator from '@/components/ui/SaveIndicator';
import PersonalInfoSection from '@/components/sections/PersonalInfoSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import EducationSection from '@/components/sections/EducationSection';
import SkillsSection from '@/components/sections/SkillsSection';
import CVAnalysisDashboard from '@/components/ui/CVAnalysisDashboard';

export default function EditCVPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  // Use the new custom hook for better state management
  const { cv, updateField, isLoading, error, lastSaved, manualSave } = useCVData(id as string);
  
  const [activeTab, setActiveTab] = useState('personal');
  const [isImproving, setIsImproving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisContext, setAnalysisContext] = useState<any>(null);

  const handleAIImprovement = async (section: string) => {
    if (!cv) return;
    
    setIsImproving(true);
    try {
      const response = await fetch('/api/ai/improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvData: cv,
          section: section
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to improve CV');
      }

      const { improvement, section: improvedSection } = await response.json();
      
      if (improvedSection === 'summary') {
        updateField('content', {
          ...cv.content,
          summary: improvement
        });
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
        experience: cv.content.experience.map((exp: any) => ({
          title: exp.position || '',
          company: exp.company || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          description: exp.description || ''
        })),
        education: cv.content.education.map((edu: any) => ({
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
      a.download = `${cv.content.personalInfo?.fullName || 'CV'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('PDF exported successfully! 📄');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Error Loading CV</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!cv) return null;

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User, gradient: 'from-cyan-500 to-blue-600' },
    { id: 'experience', label: 'Experience', icon: Briefcase, gradient: 'from-purple-500 to-pink-600' },
    { id: 'education', label: 'Education', icon: GraduationCap, gradient: 'from-green-500 to-teal-600' },
    { id: 'skills', label: 'Skills', icon: Code, gradient: 'from-yellow-500 to-orange-600' },
    { id: 'analysis', label: 'AI Analysis', icon: BarChart3, gradient: 'from-indigo-500 to-purple-600' }
  ];

  return (
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
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all backdrop-blur-sm border border-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </motion.button>
            
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                {cv.title}
              </h1>
              <p className="text-white/60">Edit your professional CV</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <SaveIndicator lastSaved={lastSaved} onManualSave={manualSave} />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-green-500/25 disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex space-x-2 bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10 mb-8 overflow-x-auto"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-sm transition-all relative overflow-hidden whitespace-nowrap ${activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg border border-white/20`
                    : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent'}`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-xl"
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            );
          })}
        </motion.nav>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          {activeTab === 'personal' && (
            <PersonalInfoSection
              key="personal"
              cv={cv}
              updateField={updateField}
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
                updateField={updateField}
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
                updateField={updateField}
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
                updateField={updateField}
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
      </div>

      <Toaster position="bottom-right" />
    </div>
  );
}
