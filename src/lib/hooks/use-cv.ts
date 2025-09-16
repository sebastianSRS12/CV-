'use client';

import { useState, useEffect } from 'react';
import { CV, CVContent } from '@/types/cv';
import { cvApi } from '@/lib/api/cv';

/**
 * Custom hook for managing a single CV
 * Provides state management and CRUD operations for CV data
 * @param id - Optional CV ID to fetch on mount
 * @returns Object containing CV data, loading state, error state, and update functions
 */
export function useCV(id?: string) {
  // State management for CV data
  const [cv, setCV] = useState<CV | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCV(id);
    }
  }, [id]);

  const fetchCV = async (cvId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await cvApi.getCV(cvId);
      setCV(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch CV');
    } finally {
      setLoading(false);
    }
  };

  const updateCV = async (data: Partial<CV>) => {
    if (!cv) return;
    
    setLoading(true);
    setError(null);
    try {
      const updated = await cvApi.updateCV(cv.id, data);
      setCV(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update CV');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (content: Partial<CVContent>) => {
    if (!cv) return;
    
    const updatedCV = {
      ...cv,
      content: { ...cv.content, ...content }
    };
    
    return updateCV({ content: updatedCV.content });
  };

  return {
    cv,
    loading,
    error,
    updateCV,
    updateContent,
    refetch: () => id && fetchCV(id),
  };
}

export function useCVList() {
  const [cvs, setCVs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCVs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cvApi.getUserCVs();
      setCVs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch CVs');
    } finally {
      setLoading(false);
    }
  };

  const createCV = async (title: string, content?: Partial<CVContent>) => {
    setLoading(true);
    setError(null);
    try {
      const newCV = await cvApi.createCV({ title, content });
      setCVs(prev => [newCV, ...prev]);
      return newCV;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create CV');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCV = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await cvApi.deleteCV(id);
      setCVs(prev => prev.filter(cv => cv.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete CV');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCVs();
  }, []);

  return {
    cvs,
    loading,
    error,
    createCV,
    deleteCV,
    refetch: fetchCVs,
  };
}
