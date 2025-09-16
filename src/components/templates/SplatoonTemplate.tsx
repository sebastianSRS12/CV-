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

interface SplatoonTemplateProps {
  cv: CVData;
}

export default function SplatoonTemplate({ cv }: SplatoonTemplateProps) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const inkColors = [
    'from-pink-400 to-purple-500',
    'from-cyan-400 to-blue-500',
    'from-yellow-400 to-orange-500',
    'from-green-400 to-teal-500',
    'from-red-400 to-pink-500',
    'from-indigo-400 to-purple-500'
  ];

  const getRandomInkColor = () => inkColors[Math.floor(Math.random() * inkColors.length)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated ink splashes background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-32 h-32 bg-gradient-to-br ${getRandomInkColor()} rounded-full opacity-20 blur-xl`}
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -100, 50, 0],
              scale: [1, 1.5, 0.8, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 relative"
        >
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full opacity-30 blur-lg animate-pulse" />
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full opacity-30 blur-lg animate-pulse" />
          
          <motion.h1
            className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {cv.content.personalInfo?.fullName || 'Your Name'}
          </motion.h1>
          
          <div className="flex flex-wrap justify-center gap-4 text-white/80">
            {cv.content.personalInfo?.email && (
              <motion.div
                className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                📧 {cv.content.personalInfo.email}
              </motion.div>
            )}
            {cv.content.personalInfo?.phone && (
              <motion.div
                className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                📱 {cv.content.personalInfo.phone}
              </motion.div>
            )}
            {cv.content.personalInfo?.location && (
              <motion.div
                className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                📍 {cv.content.personalInfo.location}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Summary Section */}
        {cv.content.summary && (
          <motion.section
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 relative"
          >
            <div className="absolute -top-2 -left-2 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg opacity-40 blur-sm" />
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-4 flex items-center">
                <span className="text-4xl mr-3">🎨</span>
                About Me
              </h2>
              <p className="text-white/90 text-lg leading-relaxed">{cv.content.summary}</p>
            </div>
          </motion.section>
        )}

        {/* Skills Section */}
        {cv.content.skills.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <span className="text-4xl mr-3">⚡</span>
              Skills & Abilities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cv.content.skills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  className={`relative p-4 bg-gradient-to-br ${getRandomInkColor()} rounded-xl cursor-pointer overflow-hidden`}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: Math.random() * 10 - 5,
                    zIndex: 10
                  }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setHoveredSkill(skill.id)}
                  onHoverEnd={() => setHoveredSkill(null)}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
                  <div className="relative z-10">
                    <div className="text-white font-bold text-center mb-2">{skill.name}</div>
                    <div className="w-full bg-white/30 rounded-full h-2">
                      <motion.div
                        className="bg-white h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(skill.level / 5) * 100}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      />
                    </div>
                  </div>
                  
                  {hoveredSkill === skill.id && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <span className="text-xl">✨</span>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Experience Section */}
        {cv.content.experience.length > 0 && (
          <motion.section
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <span className="text-4xl mr-3">🚀</span>
              Battle Experience
            </h2>
            <div className="space-y-6">
              {cv.content.experience.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 overflow-hidden"
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${getRandomInkColor()}`} />
                  
                  <div className="ml-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                      <h3 className="text-xl font-bold text-white">{exp.position}</h3>
                      <div className="text-sm text-white/70 bg-white/10 px-3 py-1 rounded-full">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </div>
                    </div>
                    <h4 className="text-lg text-purple-300 mb-3">{exp.company}</h4>
                    <p className="text-white/80 leading-relaxed">{exp.description}</p>
                  </div>
                  
                  <motion.div
                    className={`absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br ${getRandomInkColor()} rounded-full opacity-30 blur-lg`}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Education Section */}
        {cv.content.education.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <span className="text-4xl mr-3">🎓</span>
              Training Grounds
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {cv.content.education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5,
                    backgroundColor: "rgba(255,255,255,0.15)"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`absolute top-2 right-2 w-12 h-12 bg-gradient-to-br ${getRandomInkColor()} rounded-full opacity-50`} />
                  
                  <h3 className="text-lg font-bold text-white mb-2">{edu.degree}</h3>
                  <h4 className="text-purple-300 mb-2">{edu.institution}</h4>
                  <div className="text-sm text-white/70">
                    {edu.field} • {edu.startDate} - {edu.endDate}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Floating ink drops */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`drop-${i}`}
            className={`absolute w-4 h-4 bg-gradient-to-br ${getRandomInkColor()} rounded-full opacity-60`}
            animate={{
              y: [-20, window.innerHeight + 20],
              x: [0, Math.random() * 100 - 50],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
