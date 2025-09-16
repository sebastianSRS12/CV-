'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormInput from '@/components/forms/FormInput';
import FormTextarea from '@/components/forms/FormTextarea';
import { CVData, Experience } from '@/hooks/useCVData';

interface ExperienceSectionProps {
  cv: CVData;
  updateField: (field: string, value: any) => void;
}

export default function ExperienceSection({ cv, updateField }: ExperienceSectionProps) {
  const experiences = cv.content.experiences || [];

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
    };

    updateField('content', {
      ...cv.content,
      experiences: [...experiences, newExperience],
    });
  };

  const updateExperience = (id: string, field: string, value: any) => {
    updateField('content', {
      ...cv.content,
      experiences: experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeExperience = (id: string) => {
    updateField('content', {
      ...cv.content,
      experiences: experiences.filter((exp) => exp.id !== id),
    });
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === experiences.length - 1)
    ) {
      return;
    }

    const newExperiences = [...experiences];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newExperiences[index], newExperiences[newIndex]] = [
      newExperiences[newIndex],
      newExperiences[index],
    ];

    updateField('content', {
      ...cv.content,
      experiences: newExperiences,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
          💼 Work Experience
        </h3>
        <Button
          onClick={addExperience}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      <AnimatePresence>
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, padding: 0, margin: 0 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-orange-500/30 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-red-500/10" />
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-20 blur-xl animate-pulse" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <FormInput
                    label="Job Title"
                    value={exp.jobTitle}
                    onChange={(value) => updateExperience(exp.id, 'jobTitle', value)}
                    placeholder="Senior Software Developer"
                    className="text-xl font-semibold"
                  />
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => moveExperience(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveExperience(index, 'down')}
                    disabled={index === experiences.length - 1}
                    className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="p-1.5 rounded-full hover:bg-red-500/20 text-red-400"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Company"
                  value={exp.company}
                  onChange={(value) => updateExperience(exp.id, 'company', value)}
                  placeholder="Acme Inc."
                />
                
                <FormInput
                  label="Location"
                  value={exp.location}
                  onChange={(value) => updateExperience(exp.id, 'location', value)}
                  placeholder="San Francisco, CA"
                />
                
                <div className="flex space-x-4">
                  <FormInput
                    label="Start Date"
                    type="month"
                    value={exp.startDate}
                    onChange={(value) => updateExperience(exp.id, 'startDate', value)}
                    className="flex-1"
                  />
                  
                  <FormInput
                    label="End Date"
                    type={exp.isCurrent ? 'text' : 'month'}
                    value={exp.isCurrent ? 'Present' : exp.endDate}
                    onChange={(value) => updateExperience(exp.id, 'endDate', value)}
                    disabled={exp.isCurrent}
                    className="flex-1"
                  />
                </div>
                
                <div className="flex items-end">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exp.isCurrent}
                      onChange={(e) => updateExperience(exp.id, 'isCurrent', e.target.checked)}
                      className="rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-300">I currently work here</span>
                  </label>
                </div>
              </div>

              <div>
                <FormTextarea
                  label="Description"
                  value={exp.description}
                  onChange={(value) => updateExperience(exp.id, 'description', value)}
                  placeholder="Describe your responsibilities and achievements in this role..."
                  className="min-h-[100px]"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Use bullet points (•) for achievements and responsibilities
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {experiences.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.7, y: 0 }}
          className="text-center py-12 border-2 border-dashed border-orange-500/30 rounded-2xl hover:border-orange-500/50 transition-colors"
        >
          <p className="text-gray-400">No work experience added yet</p>
          <Button
            onClick={addExperience}
            variant="ghost"
            className="mt-4 text-orange-400 hover:bg-orange-500/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add your first experience
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
