'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, MoveUp, MoveDown, GraduationCap, Building2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormInput from '@/components/forms/FormInput';
import FormTextarea from '@/components/forms/FormTextarea';
import { CVData, Education } from '@/hooks/useCVData';

interface EducationSectionProps {
  cv: CVData;
  updateField: (field: string, value: any) => void;
}

export default function EducationSection({ cv, updateField }: EducationSectionProps) {
  const educations = cv.content.educations || [];

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
    };

    updateField('content', {
      ...cv.content,
      educations: [...educations, newEducation],
    });
  };

  const updateEducation = (id: string, field: string, value: any) => {
    updateField('content', {
      ...cv.content,
      educations: educations.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const removeEducation = (id: string) => {
    updateField('content', {
      ...cv.content,
      educations: educations.filter((edu) => edu.id !== id),
    });
  };

  const moveEducation = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === educations.length - 1)
    ) {
      return;
    }

    const newEducations = [...educations];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newEducations[index], newEducations[newIndex]] = [
      newEducations[newIndex],
      newEducations[index],
    ];

    updateField('content', {
      ...cv.content,
      educations: newEducations,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
          🎓 Education
        </h3>
        <Button
          onClick={addEducation}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      <AnimatePresence>
        {educations.map((edu, index) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, padding: 0, margin: 0 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-indigo-500/10" />
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-20 blur-xl animate-pulse" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <FormInput
                    label="Degree"
                    value={edu.degree}
                    onChange={(value) => updateEducation(edu.id, 'degree', value)}
                    placeholder="Bachelor of Science in Computer Science"
                    className="text-xl font-semibold"
                  />
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => moveEducation(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveEducation(index, 'down')}
                    disabled={index === educations.length - 1}
                    className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeEducation(edu.id)}
                    className="p-1.5 rounded-full hover:bg-red-500/20 text-red-400"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Institution"
                  value={edu.institution}
                  onChange={(value) => updateEducation(edu.id, 'institution', value)}
                  placeholder="Stanford University"
                  
                />
                
                <FormInput
                  label="Field of Study"
                  value={edu.fieldOfStudy}
                  onChange={(value) => updateEducation(edu.id, 'fieldOfStudy', value)}
                  placeholder="Computer Science"
                  
                />
                
                <div className="flex space-x-4">
                  <FormInput
                    label="Start Date"
                    type="month"
                    value={edu.startDate}
                    onChange={(value) => updateEducation(edu.id, 'startDate', value)}
                    className="flex-1"
                  />
                  
                  <FormInput
                    label="End Date"
                    type={edu.isCurrent ? 'text' : 'month'}
                    value={edu.isCurrent ? 'Present' : edu.endDate}
                    onChange={(value) => updateEducation(edu.id, 'endDate', value)}
                    disabled={edu.isCurrent}
                    className="flex-1"
                  />
                </div>
                
                <div className="flex items-end">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={edu.isCurrent}
                      onChange={(e) => updateEducation(edu.id, 'isCurrent', e.target.checked)}
                      className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-300">Currently attending</span>
                  </label>
                </div>
              </div>

              <div>
                <FormTextarea
                  label="Achievements & Activities"
                  value={edu.description}
                  onChange={(value) => updateEducation(edu.id, 'description', value)}
                  placeholder="Include honors, awards, extracurricular activities, or relevant coursework..."
                  className="min-h-[80px]"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Use bullet points (•) for better readability
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {educations.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.7, y: 0 }}
          className="text-center py-12 border-2 border-dashed border-blue-500/30 rounded-2xl hover:border-blue-500/50 transition-colors"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
            <GraduationCap className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-gray-400">No education entries added yet</p>
          <Button
            onClick={addEducation}
            variant="ghost"
            className="mt-4 text-blue-400 hover:bg-blue-500/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add your first education entry
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
