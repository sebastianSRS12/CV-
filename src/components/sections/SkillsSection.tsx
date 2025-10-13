'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, MoveUp, MoveDown, Star, Code, Layers, Wrench, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CVData, Skill } from '@/hooks/useCVData';

type SkillCategory = 'programming' | 'frameworks' | 'tools' | 'languages' | 'soft';

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

interface SkillCategoryType {
  id: SkillCategory;
  name: string;
  icon: React.ReactNode;
  placeholder: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const skillCategories: SkillCategoryType[] = [
  { 
    id: 'programming', 
    name: 'Programming Languages', 
    icon: <Code className="w-5 h-5" />,
    placeholder: 'e.g., JavaScript, Python, Java',
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30'
  },
  { 
    id: 'frameworks', 
    name: 'Frameworks & Libraries', 
    icon: <Layers className="w-5 h-5" />,
    placeholder: 'e.g., React, Node.js, Django',
    color: 'from-purple-400 to-pink-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30'
  },
  { 
    id: 'tools', 
    name: 'Tools & Technologies', 
    icon: <Wrench className="w-5 h-5" />,
    placeholder: 'e.g., Git, Docker, AWS',
    color: 'from-amber-400 to-orange-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30'
  },
  { 
    id: 'languages', 
    name: 'Languages', 
    icon: <Globe className="w-5 h-5" />,
    placeholder: 'e.g., English, Spanish, French',
    color: 'from-emerald-400 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30'
  },
  { 
    id: 'soft', 
    name: 'Soft Skills', 
    icon: <Users className="w-5 h-5" />,
    placeholder: 'e.g., Leadership, Communication',
    color: 'from-rose-400 to-pink-500',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30'
  },
];

export default function SkillsSection({ cv, updateField }: SkillsSectionProps) {
  const skills = cv.content.skills || [];

  const addSkill = (category: SkillCategory = 'programming') => {
    const newSkill: Skill = {
      id: `skill_${Date.now()}`,
      name: '',
      category,
      level: 3, // Default to intermediate
    };

    updateField('content', {
      ...cv.content,
      skills: [...skills, newSkill],
    });
    
    // Auto-focus the new skill input after a small delay
    setTimeout(() => {
      const input = document.getElementById(`skill-${newSkill.id}`);
      if (input) input.focus();
    }, 50);
  };

  const updateSkill = (id: string, field: 'name' | 'level', value: string | number) => {
    // If the field is 'name', trim the value and prevent empty strings
    if (field === 'name') {
      value = String(value).trimStart();
      if (value === '') return; // Don't update if empty
    }
    
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

  const renderStars = (skill: Skill) => {
    const level = skill.level || 3;
    return (
      <div className="flex items-center">
        <div className="flex space-x-1 mr-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                updateSkill(skill.id, 'level', star);
              }}
              className="focus:outline-none transition-transform hover:scale-125"
              aria-label={`Set ${skill.name || 'this skill'} to ${star} ${star === 1 ? 'star' : 'stars'}`}
              title={`${skillLevels[star - 1]?.label || ''}`}
            >
              {star <= level ? (
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
              ) : (
                <Star className="w-5 h-5 text-gray-500/50" />
              )}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400">
          {skillLevels[level - 1]?.label || 'Intermediate'}
        </span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            Skills & Expertise
          </h2>
          <p className="text-gray-400 mt-1">Showcase your technical and professional skills</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {skillCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => addSkill(category.id)}
              className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all hover:scale-105 bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-800"
            >
              {category.icon}
              Add {category.name.split(' ')[0]}
              <Plus className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {skillCategories.map((category) => {
          const categorySkills = getSkillsByCategory(category.id);
          
          return (
            <div key={category.id} className={`rounded-2xl overflow-hidden border ${category.borderColor} bg-gradient-to-br from-white/5 to-black/20 backdrop-blur-sm`}>
              <div className={`p-5 border-b ${category.borderColor} bg-gradient-to-r ${category.color}/10`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <span className="mr-3 text-xl">{category.icon}</span>
                    {category.name}
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white/10 text-white/80">
                      {categorySkills.length} {categorySkills.length === 1 ? 'skill' : 'skills'}
                    </span>
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addSkill(category.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                    title={`Add ${category.name}`}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <AnimatePresence>
                {categorySkills.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {categorySkills.map((skill, index) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, padding: 0, margin: 0, border: 0 }}
                        transition={{ duration: 0.2 }}
                        className="group relative hover:bg-white/2.5 transition-colors"
                      >
                        <div className="px-5 py-4">
                          <div className="flex items-start">
                            <button 
                              className="p-1 -ml-1 rounded-md mr-2 opacity-0 group-hover:opacity-100 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSkill(skill.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center">
                                <input
                                  id={`skill-${skill.id}`}
                                  type="text"
                                  value={skill.name}
                                  onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                                  placeholder={category.placeholder}
                                  className="w-full bg-transparent border-0 border-b border-transparent focus:border-white/30 focus:ring-0 text-white placeholder-gray-500 pb-1 text-base font-medium pr-2"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      addSkill(category.id);
                                    } else if (e.key === 'Backspace' && !skill.name && skills.length > 1) {
                                      e.preventDefault();
                                      removeSkill(skill.id);
                                    }
                                  }}
                                />
                                
                                <div className="flex space-x-2 ml-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      moveSkill(skills.findIndex(s => s.id === skill.id), 'up');
                                    }}
                                    disabled={index === 0}
                                    className="p-1 rounded-md hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 hover:text-white"
                                    title="Move up"
                                  >
                                    <MoveUp className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      moveSkill(skills.findIndex(s => s.id === skill.id), 'down');
                                    }}
                                    disabled={index === categorySkills.length - 1}
                                    className="p-1 rounded-md hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 hover:text-white"
                                    title="Move down"
                                  >
                                    <MoveDown className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              
                              {category.id !== 'soft' && (
                                <div className="mt-3 pl-0.5">
                                  {renderStars(skill)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 text-center"
                  >
                    <div className="text-gray-500 mb-3">No {category.name.toLowerCase()} added yet</div>
                    <button
                      onClick={() => addSkill(category.id)}
                      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${category.bgColor} hover:bg-opacity-30 border ${category.borderColor} text-white`}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add your first {category.name.split(' ')[0].toLowerCase()}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
