import { CVData } from '@/types/cv';

export const professionalTemplate: CVData = {
  id: 'professional',
  name: 'Professional',
  content: {
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      summary: 'Results-driven professional with [X] years of experience in [Industry]. Skilled in [Key Skills]. Proven track record of [Key Achievement].',
    },
    experiences: [
      {
        id: '1',
        title: 'Job Title',
        company: 'Company Name',
        location: 'City, Country',
        startDate: '',
        endDate: 'Present',
        description: '• Achievement or responsibility\n• Another achievement or responsibility\n• Key contribution or project',
      },
    ],
    educations: [
      {
        id: '1',
        degree: 'Degree Name',
        institution: 'Institution Name',
        location: 'City, Country',
        startDate: '',
        endDate: '',
        description: 'Relevant coursework, achievements, or activities',
      },
    ],
    skills: [
      { id: '1', name: 'Skill 1', level: 4 },
      { id: '2', name: 'Skill 2', level: 3 },
      { id: '3', name: 'Skill 3', level: 5 },
    ],
  },
  style: {
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    fontFamily: 'Inter',
    showProfilePicture: true,
  },
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};
