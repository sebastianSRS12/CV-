'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, MoveUp, MoveDown, Star, StarHalf, StarOff, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CVData, Skill } from '@/hooks/useCVData';

interface SkillsSectionProps {
  cv: CVData;
  updateField: (field: string, value: any) => void;
}

const skillLevels = [
  { value: 1, label: 'Beginner' },
  { value: 2, label: 'Basic' },
  { value: 3, label: 'Intermediate' },
  { value: 4, label: 'Advanced' },
  { value: 5, label: 'Expert' },
];

const skillCategories = [
  { id: 'programming', name: 'Programming Languages', icon: '💻' },
  { id: 'frameworks', name: 'Frameworks & Libraries', icon: '📚' },
  { id: 'tools', name: 'Tools & Technologies', icon: '🛠️' },
  { id: 'languages', name: 'Languages', icon: '🌐' },
  { id: 'soft', name: 'Soft Skills', icon: '🤝' },
];

export default function SkillsSection({ cv, updateField }: SkillsSectionProps) {
  const skills = cv.content.skills || [];

  const addSkill = (category: string = 'programming') => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      category,
      level: 3, // Default to intermediate
    };

    updateField('content', {
      ...cv.content,
      skills: [...skills, newSkill],
    });
  };

  const updateSkill = (id: string, field: string, value: any) => {
    updateField('content', {
      ...cv.content,
      skills: skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    });
  };

  const removeSkill = (id: string) => {
    updateField('content', {
      ...cv.content,
      skills: skills.filter((skill) => skill.id !== id),
    });
  };

  const moveSkill = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === skills.length - 1)
    ) {
      return;
    }

    const newSkills = [...skills];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newSkills[index], newSkills[newIndex]] = [
      newSkills[newIndex],
      newSkills[index],
    ];

    updateField('content', {
      ...cv.content,
      skills: newSkills,
    });
  };

  const getSkillsByCategory = (categoryId: string) => {
    return skills.filter((skill) => skill.category === categoryId);
  };

  const renderStars = (level: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => updateSkill}
            className="focus:outline-none"
            aria-label={`Set skill level to ${star}`}
          >
            {star <= level ? (
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
            ) : (
              <StarOff className="w-4 h-4 text-gray-500" />
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
          🛠️ Skills & Expertise
        </h3>
      </div>

      {skillCategories.map((category) => {
        const categorySkills = getSkillsByCategory(category.id);
        
        return (
          <div key={category.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-200 flex items-center">
                <span className="mr-2">{category.icon}</span>
                {category.name}
                <span className="ml-2 text-sm text-gray-400">
                  ({categorySkills.length})
                </span>
              </h4>
              <Button
                onClick={() => addSkill(category.id)}
                size="sm"
                variant="ghost"
                className="text-green-400 hover:bg-green-500/10"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add {category.name.split(' ')[0]}
              </Button>
            </div>

            <AnimatePresence>
              {categorySkills.length > 0 ? (
                <div className="space-y-3">
                  {categorySkills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, padding: 0, margin: 0 }}
                      className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-green-500/20 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-emerald-500/5" />
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <input
                              type="text"
                              value={skill.name}
                              onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                              placeholder={`Add a ${category.name.split(' ')[0].toLowerCase()} skill`}
                              className="w-full bg-transparent border-0 border-b border-transparent focus:border-green-400 focus:ring-0 text-white placeholder-gray-500 pb-1 text-base font-medium"
                            />
                            
                            {category.id !== 'soft' && (
                              <div className="mt-2">
                                <div className="text-xs text-gray-400 mb-1">
                                  Proficiency: {skillLevels[skill.level - 1]?.label || 'Not specified'}
                                </div>
                                <div className="flex items-center">
                                  <div className="flex-1 pr-4">
                                    <div className="flex space-x-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                          key={star}
                                          type="button"
                                          onClick={() => updateSkill(skill.id, 'level', star)}
                                          className="focus:outline-none"
                                          aria-label={`Set skill level to ${star}`}
                                        >
                                          {star <= (skill.level || 0) ? (
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                          ) : (
                                            <Star className="w-4 h-4 text-gray-600" />
                                          )}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex space-x-1 ml-4">
                            <button
                              onClick={() => moveSkill(skills.findIndex(s => s.id === skill.id), 'up')}
                              disabled={skills.findIndex(s => s.id === skill.id) === 0}
                              className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Move up"
                            >
                              <MoveUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => moveSkill(skills.findIndex(s => s.id === skill.id), 'down')}
                              disabled={skills.findIndex(s => s.id === skill.id) === skills.length - 1}
                              className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Move down"
                            >
                              <MoveDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeSkill(skill.id)}
                              className="p-1.5 rounded-full hover:bg-red-500/20 text-red-400"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.7, y: 0 }}
                  className="text-center py-6 border-2 border-dashed border-green-500/30 rounded-xl hover:border-green-500/50 transition-colors cursor-pointer"
                  onClick={() => addSkill(category.id)}
                >
                  <p className="text-gray-400">No {category.name.toLowerCase()} added yet</p>
                  <p className="text-sm text-green-400 mt-1">
                    Click to add your first {category.name.split(' ')[0].toLowerCase()} skill
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </motion.div>
  );
}
