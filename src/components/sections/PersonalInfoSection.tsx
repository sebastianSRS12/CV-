'use client';

import { motion } from 'framer-motion';
import FormInput from '@/components/forms/FormInput';
import FormTextarea from '@/components/forms/FormTextarea';
import { CVData } from '@/hooks/useCVData';

interface PersonalInfoSectionProps {
  cv: CVData;
  updateField: (field: string, value: any) => void;
}

export default function PersonalInfoSection({ cv, updateField }: PersonalInfoSectionProps) {
  const updatePersonalInfo = (field: string, value: string) => {
    updateField('personalInfo', {
      ...cv.content.personalInfo,
      [field]: value
    });
  };

  const updateSummary = (value: string) => {
    updateField('summary', value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Personal Information */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-cyan-500/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10" />
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-20 blur-xl animate-pulse" />
        
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6">
            👤 Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Full Name"
              value={cv.content.personalInfo?.fullName || ''}
              onChange={(value) => updatePersonalInfo('fullName', value)}
              placeholder="Enter your full name"
              icon="👤"
              required
            />
            
            <FormInput
              label="Email Address"
              value={cv.content.personalInfo?.email || ''}
              onChange={(value) => updatePersonalInfo('email', value)}
              placeholder="your.email@example.com"
              type="email"
              icon="📧"
              required
            />
            
            <FormInput
              label="Phone Number"
              value={cv.content.personalInfo?.phone || ''}
              onChange={(value) => updatePersonalInfo('phone', value)}
              placeholder="+1 (555) 123-4567"
              type="tel"
              icon="📱"
            />
            
            <FormInput
              label="Location"
              value={cv.content.personalInfo?.location || ''}
              onChange={(value) => updatePersonalInfo('location', value)}
              placeholder="City, State/Country"
              icon="📍"
            />
            
            <FormInput
              label="Website/Portfolio"
              value={cv.content.personalInfo?.website || ''}
              onChange={(value) => updatePersonalInfo('website', value)}
              placeholder="https://yourportfolio.com"
              type="url"
              icon="🌐"
              className="md:col-span-2"
            />
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-purple-500/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 blur-xl animate-pulse" />
        
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
            ✨ Professional Summary
          </h3>
          
          <FormTextarea
            label="Summary"
            value={cv.content.summary || ''}
            onChange={updateSummary}
            placeholder="Write a compelling professional summary that highlights your key achievements, skills, and career goals. Focus on quantifiable results and what makes you unique..."
            rows={6}
            icon="📝"
          />
          
          <div className="mt-4 text-sm text-white/60">
            <p>💡 <strong>Tip:</strong> Include specific numbers, achievements, and keywords relevant to your target role.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
