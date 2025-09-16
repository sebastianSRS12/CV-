'use client';

import { PersonalInfo } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PersonalInfoSectionProps {
  personalInfo: PersonalInfo;
  summary?: string;
  onUpdate: (data: { personalInfo?: PersonalInfo; summary?: string }) => void;
}

export function PersonalInfoSection({ personalInfo, summary, onUpdate }: PersonalInfoSectionProps) {
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    onUpdate({
      personalInfo: {
        ...personalInfo,
        [field]: value,
      },
    });
  };

  const updateSummary = (value: string) => {
    onUpdate({ summary: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={personalInfo.fullName || ''}
              onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
              placeholder="John Doe"
            />
            <Input
              label="Email"
              type="email"
              value={personalInfo.email || ''}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone"
              type="tel"
              value={personalInfo.phone || ''}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
            <Input
              label="Location"
              value={personalInfo.location || ''}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              placeholder="New York, NY"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Website"
              type="url"
              value={personalInfo.website || ''}
              onChange={(e) => updatePersonalInfo('website', e.target.value)}
              placeholder="https://johndoe.com"
            />
            <Input
              label="LinkedIn"
              type="url"
              value={personalInfo.linkedin || ''}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>
          
          <Input
            label="GitHub"
            type="url"
            value={personalInfo.github || ''}
            onChange={(e) => updatePersonalInfo('github', e.target.value)}
            placeholder="https://github.com/johndoe"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            label="Summary"
            value={summary || ''}
            onChange={(e) => updateSummary(e.target.value)}
            placeholder="Write a brief summary of your professional background and key achievements..."
            rows={4}
            helperText="A compelling summary that highlights your key skills and experience"
          />
        </CardContent>
      </Card>
    </div>
  );
}
