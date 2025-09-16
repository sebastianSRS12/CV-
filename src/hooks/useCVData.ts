import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'programming' | 'frameworks' | 'tools' | 'languages' | 'soft';
  level: number;
}

export interface CVData {
  id: string;
  title: string;
  content: {
    personalInfo: {
      fullName?: string;
      email?: string;
      phone?: string;
      location?: string;
      website?: string;
    };
    summary?: string;
    experiences: Experience[];
    educations: Education[];
    skills: Skill[];
  };
}

export function useCVData(id: string) {
  const [cv, setCv] = useState<CVData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save functionality
  const autoSave = useCallback(async (cvData: CVData) => {
    try {
      localStorage.setItem(`cv_${id}`, JSON.stringify(cvData));
      setLastSaved(new Date());
    } catch (err) {
      console.error('Auto-save failed:', err);
    }
  }, [id]);

  // Debounced auto-save (saves 2 seconds after last change)
  useEffect(() => {
    if (!cv) return;

    const timeoutId = setTimeout(() => {
      autoSave(cv);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [cv, autoSave]);

  // Load CV data on mount
  useEffect(() => {
    const loadCV = async () => {
      try {
        const defaultCV: CVData = {
          id: id as string,
          title: 'My CV',
          content: {
            personalInfo: {},
            summary: '',
            experiences: [],
            educations: [],
            skills: [],
          },
        };

        const savedCV = localStorage.getItem(`cv_${id}`);
        if (savedCV) {
          setCv(JSON.parse(savedCV));
          setLastSaved(new Date());
        } else {
          setCv(defaultCV);
          localStorage.setItem(`cv_${id}`, JSON.stringify(defaultCV));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load CV');
        console.error('Error loading CV:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCV();
  }, [id]);

  // Update CV data
  const updateCV = useCallback((updates: Partial<CVData>) => {
    setCv(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  // Update specific field
  const updateField = useCallback((field: string, value: any) => {
    setCv(prev => prev ? { ...prev, [field]: value } : null);
  }, []);

  // Manual save with feedback
  const manualSave = useCallback(async () => {
    if (!cv) return;
    
    try {
      localStorage.setItem(`cv_${id}`, JSON.stringify(cv));
      setLastSaved(new Date());
      toast.success('CV saved successfully! 💾', {
        duration: 2000,
        style: {
          background: '#10B981',
          color: '#fff',
        },
      });
    } catch (err) {
      toast.error('Failed to save CV');
      console.error('Save error:', err);
    }
  }, [cv, id]);

  return {
    cv,
    setCv,
    updateCV,
    updateField,
    isLoading,
    error,
    lastSaved,
    manualSave,
  };
}
