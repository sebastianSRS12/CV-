'use client';

import { useEffect, useState } from 'react';
import EnvVariableDisplay from '@/components/settings/EnvVariableDisplay';
import { isValidGoogleApiKey } from '@/lib/validation';
import { toast } from 'sonner';

export default function SettingsPage() {
  // Load placeholders from env.example (hardcoded for demo)
  const placeholders = {
    GOOGLE_CLIENT_ID: 'your_google_client_id',
    GOOGLE_CLIENT_SECRET: 'your_google_client_secret',
  };

  const [googleClientId, setGoogleClientId] = useState<string>('');
  const [googleClientSecret, setGoogleClientSecret] = useState<string>('');
  const [errors, setErrors] = useState<{ clientId?: string; clientSecret?: string }>({});

  // Simulate fetching existing env values (never expose real values)
  useEffect(() => {
    // In a real app, you would fetch masked values from an API
    setGoogleClientId('');
    setGoogleClientSecret('');
  }, []);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (googleClientId && !isValidGoogleApiKey(googleClientId)) {
      newErrors.clientId = 'Invalid Google Client ID format';
    }
    if (googleClientSecret && googleClientSecret.length < 10) {
      newErrors.clientSecret = 'Google Client Secret is too short';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      toast.error('Please fix validation errors before saving');
      return;
    }
    // Send masked values to backend (implementation omitted)
    toast.success('Settings saved successfully');
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Application Settings</h1>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Google Client ID
          </label>
          <EnvVariableDisplay
            name="GOOGLE_CLIENT_ID"
            placeholder={placeholders.GOOGLE_CLIENT_ID}
            isSensitive={false}
            value={googleClientId}
            onChange={setGoogleClientId}
          />
          {errors.clientId && (
            <p className="mt-1 text-sm text-red-600">{errors.clientId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Google Client Secret
          </label>
          <EnvVariableDisplay
            name="GOOGLE_CLIENT_SECRET"
            placeholder={placeholders.GOOGLE_CLIENT_SECRET}
            isSensitive={true}
            value={googleClientSecret}
            onChange={setGoogleClientSecret}
          />
          {errors.clientSecret && (
            <p className="mt-1 text-sm text-red-600">{errors.clientSecret}</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}