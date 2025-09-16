import { CVTemplate, CVContent } from '@/types/cv';

/**
 * Predefined CV templates with different styles and layouts
 * Each template includes metadata and default content structure
 */
export const CV_TEMPLATES: CVTemplate[] = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Clean and modern design perfect for tech and business professionals',
    preview: '/templates/modern-professional.png',
    category: 'modern',
    isPremium: false,
  },
  {
    id: 'classic-traditional',
    name: 'Classic Traditional',
    description: 'Traditional format suitable for conservative industries',
    preview: '/templates/classic-traditional.png',
    category: 'classic',
    isPremium: false,
  },
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    description: 'Bold and creative layout for designers and creative professionals',
    preview: '/templates/creative-designer.png',
    category: 'creative',
    isPremium: true,
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Minimalist design focusing on content over decoration',
    preview: '/templates/minimal-clean.png',
    category: 'minimal',
    isPremium: false,
  },
];

/**
 * Default CV content structure used when creating new CVs
 * Provides empty but properly structured data for all CV sections
 */
export const DEFAULT_CV_CONTENT: CVContent = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
};

/**
 * Sample CV content for demonstration purposes
 * Used in template previews and as example data
 */
export const SAMPLE_CV_CONTENT: CVContent = {
  personalInfo: {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    website: 'https://johndoe.com',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
  },
  summary: 'Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about creating scalable solutions and mentoring junior developers.',
  experience: [
    {
      id: 'exp-1',
      company: 'Tech Solutions Inc.',
      position: 'Senior Software Engineer',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: 'Lead development of customer-facing web applications using React and Node.js. Mentor junior developers and collaborate with cross-functional teams.',
      location: 'New York, NY',
      achievements: [
        'Improved application performance by 40%',
        'Led team of 4 developers',
        'Implemented CI/CD pipeline reducing deployment time by 60%',
      ],
    },
    {
      id: 'exp-2',
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      startDate: '2019-06',
      endDate: '2021-02',
      current: false,
      description: 'Developed and maintained web applications using modern JavaScript frameworks. Worked closely with product team to deliver user-centric features.',
      location: 'San Francisco, CA',
      achievements: [
        'Built 3 major product features from scratch',
        'Reduced bug reports by 50% through improved testing',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2015-09',
      endDate: '2019-05',
      current: false,
      gpa: '3.8/4.0',
      honors: 'Magna Cum Laude',
      description: 'Relevant coursework: Data Structures, Algorithms, Software Engineering, Database Systems',
    },
  ],
  skills: [
    { id: 'skill-1', name: 'JavaScript', level: 'expert', category: 'technical' },
    { id: 'skill-2', name: 'React', level: 'expert', category: 'technical' },
    { id: 'skill-3', name: 'Node.js', level: 'advanced', category: 'technical' },
    { id: 'skill-4', name: 'Python', level: 'intermediate', category: 'technical' },
    { id: 'skill-5', name: 'Leadership', level: 'advanced', category: 'soft' },
    { id: 'skill-6', name: 'Communication', level: 'expert', category: 'soft' },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with React frontend and Node.js backend',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
      url: 'https://ecommerce-demo.com',
      github: 'https://github.com/johndoe/ecommerce-platform',
      startDate: '2022-01',
      endDate: '2022-06',
      current: false,
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2022-08',
      expiryDate: '2025-08',
      credentialId: 'AWS-CSA-123456',
      url: 'https://aws.amazon.com/certification/',
    },
  ],
  languages: [
    { id: 'lang-1', name: 'English', proficiency: 'native' },
    { id: 'lang-2', name: 'Spanish', proficiency: 'conversational' },
  ],
};

/**
 * Gets a CV template by its ID
 * @param templateId - The unique identifier of the template
 * @returns The template object or undefined if not found
 */
export function getTemplateById(templateId: string): CVTemplate | undefined {
  return CV_TEMPLATES.find(template => template.id === templateId);
}

/**
 * Gets templates filtered by category
 * @param category - The template category to filter by
 * @returns Array of templates in the specified category
 */
export function getTemplatesByCategory(category: CVTemplate['category']): CVTemplate[] {
  return CV_TEMPLATES.filter(template => template.category === category);
}

/**
 * Gets all free templates (non-premium)
 * @returns Array of free templates
 */
export function getFreeTemplates(): CVTemplate[] {
  return CV_TEMPLATES.filter(template => !template.isPremium);
}

/**
 * Gets all premium templates
 * @returns Array of premium templates
 */
export function getPremiumTemplates(): CVTemplate[] {
  return CV_TEMPLATES.filter(template => template.isPremium);
}
