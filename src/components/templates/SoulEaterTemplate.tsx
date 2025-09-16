'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface CVData {
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
    experience: Array<{
      id: string;
      company: string;
      position: string;
      startDate: string;
      endDate: string;
      description: string;
    }>;
    education: Array<{
      id: string;
      institution: string;
      degree: string;
      field: string;
      startDate: string;
      endDate: string;
    }>;
    skills: Array<{
      id: string;
      name: string;
      level: number;
    }>;
  };
}

interface SoulEaterTemplateProps {
  cv: CVData;
}

export default function SoulEaterTemplate({ cv }: SoulEaterTemplateProps) {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const gothicColors = [
    'from-red-600 to-black',
    'from-purple-800 to-black',
    'from-yellow-500 to-orange-700',
    'from-green-600 to-black',
    'from-blue-600 to-purple-900',
    'from-pink-600 to-red-800'
  ];

  const getRandomGothicColor = () => gothicColors[Math.floor(Math.random() * gothicColors.length)];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated gothic background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-purple-900/20" />
        
        {/* Floating souls/spirits */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30"
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Gothic patterns */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-red-900/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-purple-900/30 to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-16 relative"
        >
          {/* Gothic frame effect */}
          <div className="absolute inset-0 border-4 border-red-600/50 rounded-lg transform rotate-1" />
          <div className="absolute inset-0 border-4 border-yellow-500/30 rounded-lg transform -rotate-1" />
          
          <div className="relative bg-black/80 backdrop-blur-sm p-8 rounded-lg border border-red-600/30">
            <motion.div
              className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-red-600 to-yellow-500 rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <span className="text-2xl">☠️</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-red-600 mb-6 font-serif"
              whileHover={{ 
                scale: 1.05,
                textShadow: "0 0 20px rgba(255,0,0,0.8)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {cv.content.personalInfo?.fullName || 'Soul Reaper'}
            </motion.h1>
            
            <div className="flex flex-wrap justify-center gap-4">
              {cv.content.personalInfo?.email && (
                <motion.div
                  className="px-4 py-2 bg-red-900/50 backdrop-blur-sm rounded border border-red-600/50 text-white"
                  whileHover={{ 
                    scale: 1.1, 
                    backgroundColor: "rgba(153, 27, 27, 0.8)",
                    boxShadow: "0 0 15px rgba(255,0,0,0.5)"
                  }}
                >
                  ✉️ {cv.content.personalInfo.email}
                </motion.div>
              )}
              {cv.content.personalInfo?.phone && (
                <motion.div
                  className="px-4 py-2 bg-purple-900/50 backdrop-blur-sm rounded border border-purple-600/50 text-white"
                  whileHover={{ 
                    scale: 1.1, 
                    backgroundColor: "rgba(88, 28, 135, 0.8)",
                    boxShadow: "0 0 15px rgba(147, 51, 234, 0.5)"
                  }}
                >
                  📱 {cv.content.personalInfo.phone}
                </motion.div>
              )}
              {cv.content.personalInfo?.location && (
                <motion.div
                  className="px-4 py-2 bg-yellow-900/50 backdrop-blur-sm rounded border border-yellow-600/50 text-white"
                  whileHover={{ 
                    scale: 1.1, 
                    backgroundColor: "rgba(146, 64, 14, 0.8)",
                    boxShadow: "0 0 15px rgba(245, 158, 11, 0.5)"
                  }}
                >
                  🗡️ {cv.content.personalInfo.location}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Summary Section */}
        {cv.content.summary && (
          <motion.section
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16 relative"
            onHoverStart={() => setHoveredSection('summary')}
            onHoverEnd={() => setHoveredSection(null)}
          >
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-red-600 to-black rounded-full opacity-50 blur-lg" />
            
            <div className="relative bg-gradient-to-br from-red-900/30 to-black/50 backdrop-blur-md rounded-2xl p-8 border-2 border-red-600/30 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600" />
              
              <h2 className="text-4xl font-bold text-red-400 mb-6 flex items-center font-serif">
                <motion.span 
                  className="text-5xl mr-4"
                  animate={{ rotate: hoveredSection === 'summary' ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  🔥
                </motion.span>
                Soul Resonance
              </h2>
              <p className="text-gray-200 text-lg leading-relaxed font-serif italic">
                "{cv.content.summary}"
              </p>
              
              {hoveredSection === 'summary' && (
                <motion.div
                  className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-yellow-500 to-red-600 rounded-full opacity-60 blur-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </div>
          </motion.section>
        )}

        {/* Skills Section */}
        {cv.content.skills.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold text-yellow-400 mb-8 flex items-center font-serif">
              <span className="text-5xl mr-4">⚔️</span>
              Weapon Mastery
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cv.content.skills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  className="relative group cursor-pointer"
                  whileHover={{ 
                    scale: 1.1,
                    rotateY: 10,
                    z: 50
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${getRandomGothicColor()} rounded-xl opacity-80 blur-sm group-hover:blur-none transition-all duration-300`} />
                  
                  <div className="relative bg-black/60 backdrop-blur-sm p-6 rounded-xl border-2 border-red-600/30 group-hover:border-yellow-500/50 transition-all duration-300">
                    <div className="text-center">
                      <h3 className="text-white font-bold text-lg mb-3 font-serif">{skill.name}</h3>
                      
                      {/* Skill level as weapon power */}
                      <div className="flex justify-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <motion.span
                            key={i}
                            className={`text-2xl mx-1 ${i < skill.level ? 'text-red-500' : 'text-gray-600'}`}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 + index * 0.1 + i * 0.1 }}
                          >
                            ⚡
                          </motion.span>
                        ))}
                      </div>
                      
                      <div className="text-sm text-gray-300 font-serif italic">
                        Level {skill.level}/5
                      </div>
                    </div>
                    
                    <motion.div
                      className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-red-600 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300"
                      whileHover={{ rotate: 180 }}
                    >
                      <span className="text-black text-sm font-bold">★</span>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Experience Section */}
        {cv.content.experience.length > 0 && (
          <motion.section
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold text-purple-400 mb-8 flex items-center font-serif">
              <span className="text-5xl mr-4">💀</span>
              Battle History
            </h2>
            
            <div className="space-y-8">
              {cv.content.experience.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Gothic border effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-purple-600/20 to-red-600/20 rounded-2xl blur-sm" />
                  
                  <div className="relative bg-black/70 backdrop-blur-md rounded-2xl p-8 border-2 border-purple-600/30 group-hover:border-red-500/50 transition-all duration-300 overflow-hidden">
                    {/* Decorative corner elements */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-red-600/50 rounded-tl-2xl" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-yellow-500/50 rounded-br-2xl" />
                    
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <motion.h3 
                          className="text-2xl font-bold text-red-400 font-serif"
                          whileHover={{ color: "#fbbf24" }}
                        >
                          {exp.position}
                        </motion.h3>
                        <div className="text-sm text-gray-300 bg-red-900/30 px-4 py-2 rounded-full border border-red-600/30">
                          {exp.startDate} - {exp.endDate || 'Present'}
                        </div>
                      </div>
                      
                      <h4 className="text-xl text-yellow-400 mb-4 font-serif italic">{exp.company}</h4>
                      <p className="text-gray-200 leading-relaxed font-serif">{exp.description}</p>
                    </div>
                    
                    {/* Animated background element */}
                    <motion.div
                      className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-red-600/30 to-purple-600/30 rounded-full blur-xl"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        rotate: [0, 180, 360],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ 
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Education Section */}
        {cv.content.education.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold text-green-400 mb-8 flex items-center font-serif">
              <span className="text-5xl mr-4">📚</span>
              Academy Training
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {cv.content.education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  className="relative group cursor-pointer"
                  whileHover={{ 
                    scale: 1.05,
                    rotateX: 5,
                    rotateY: 5
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600/30 to-black/50 rounded-2xl blur-sm group-hover:blur-none transition-all duration-300" />
                  
                  <div className="relative bg-black/70 backdrop-blur-md rounded-2xl p-6 border-2 border-green-600/30 group-hover:border-yellow-500/50 transition-all duration-300">
                    {/* Decorative top border */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-yellow-500 to-green-600 rounded-t-2xl" />
                    
                    <div className="pt-2">
                      <h3 className="text-xl font-bold text-green-400 mb-2 font-serif">{edu.degree}</h3>
                      <h4 className="text-yellow-300 mb-3 font-serif italic">{edu.institution}</h4>
                      <div className="text-sm text-gray-300 flex items-center">
                        <span className="mr-2">🎓</span>
                        {edu.field} • {edu.startDate} - {edu.endDate}
                      </div>
                    </div>
                    
                    <motion.div
                      className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300"
                      whileHover={{ rotate: 360 }}
                    >
                      <span className="text-black text-xs font-bold">✓</span>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Floating gothic elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`gothic-${i}`}
            className="absolute text-red-600/20 text-6xl font-serif"
            animate={{
              y: [-50, window.innerHeight + 50],
              x: [0, Math.random() * 200 - 100],
              rotate: [0, 360],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 8,
            }}
            style={{
              left: `${Math.random() * 100}%`,
            }}
          >
            {['☠️', '⚔️', '🔥', '💀', '⚡', '🗡️', '🌙', '⭐'][i]}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
