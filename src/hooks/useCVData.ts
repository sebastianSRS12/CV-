import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

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

// Auto-save delay in milliseconds
const AUTO_SAVE_DELAY = 2000;

// Default CV template
const DEFAULT_CV: CVData = {
  id: '',
  title: 'My CV',
  content: {
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      website: '',
    },
    summary: 'Experienced professional with a passion for creating impactful resumes.',
    experiences: [{
      id: uuidv4(),
      jobTitle: 'Your Job Title',
      company: 'Company Name',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isCurrent: true,
      description: 'Describe your responsibilities and achievements here.'
    }],
    educations: [{
      id: uuidv4(),
      institution: 'University Name',
      degree: 'Degree',
      fieldOfStudy: 'Field of Study',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isCurrent: true,
      description: 'Relevant coursework and achievements.'
    }],
    skills: [
      { id: uuidv4(), name: 'Skill 1', category: 'programming', level: 3 },
      { id: uuidv4(), name: 'Skill 2', category: 'frameworks', level: 2 },
    ]
  }
};

export const useCVData = (id: string) => {
  const [cv, setCV] = useState<CVData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Save CV to localStorage
  const saveCV = useCallback(async (cvData: CVData) => {
    if (!cvData) return;
    
    setIsSaving(true);
    try {
      // In a real app, you would save to a database here
      localStorage.setItem(`cv_${id}`, JSON.stringify(cvData));
      setLastSaved(new Date());
      return true;
    } catch (err) {
      console.error('Failed to save CV:', err);
      toast.error('Failed to save CV');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [id]);

  // Debounced auto-save
  const queueSave = useCallback((cvData: CVData) => {
    if (saveTimeoutRef.current !== null) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(async () => {
      await saveCV(cvData);
      saveTimeoutRef.current = null;
    }, AUTO_SAVE_DELAY);
  }, [saveCV]);

  // Update CV and trigger auto-save
  const updateCV = useCallback((updates: Partial<CVData>) => {
    setCV(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      queueSave(updated);
      return updated;
    });
  }, [queueSave]);

  // Update a specific field in the CV with proper type safety
  const updateField = useCallback(<T extends keyof CVData['content']>(
    section: T,
    value: CVData['content'][T]
  ): void => {
    setCV(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        content: {
          ...prev.content,
          [section]: value
        }
      };
      queueSave(updated);
      return updated;
    });
  }, [queueSave]);

  // Load CV from localStorage on mount
  useEffect(() => {
    const loadCV = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, you would fetch from a database here
        const savedCV = localStorage.getItem(`cv_${id}`);
        
        if (savedCV) {
          const parsedCV = JSON.parse(savedCV);
          setCV(parsedCV);
          setLastSaved(new Date());
        } else {
          // Create new CV with provided ID
          const newCV = { ...DEFAULT_CV, id };
          setCV(newCV);
          await saveCV(newCV);
        }
      } catch (err) {
        console.error('Failed to load CV:', err);
        const error = err instanceof Error ? err : new Error('Failed to load CV');
        setError(error);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadCV();

    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current !== null) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    };
  }, [id, saveCV]);

  // Manual save function
  const manualSave = useCallback(async () => {
    if (!cv) return false;
    
    const success = await saveCV(cv);
    if (success) {
      toast.success('CV saved successfully!');
    }
    return success;
  }, [cv, saveCV]);

  // Create a type-safe updateField function that can be used by components
  const safeUpdateField = useCallback((field: string, value: any) => {
    if (!cv) return;
    
    // Type guard to ensure the field exists in CV content
    if (field in cv.content) {
      updateField(field as keyof CVData['content'], value);
    } else {
      console.warn(`Attempted to update non-existent field: ${field}`);
    }
  }, [cv, updateField]);

  return {
    cv,
    isLoading,
    error,
    lastSaved,
    isSaving,
    updateCV,
    updateField: safeUpdateField, // Expose the type-safe version
    saveCV: (cvData: CVData) => saveCV(cvData),
    manualSave
  };
}
