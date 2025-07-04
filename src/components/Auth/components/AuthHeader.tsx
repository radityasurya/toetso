import React, { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { settingsApi } from '../../../api';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await settingsApi.getSettings();
        if (settings.primaryColor) {
          setPrimaryColor(settings.primaryColor);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="text-center mb-8">
      <div 
        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
        style={{ backgroundColor: primaryColor }}
      >
        <BookOpen className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
      <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
    </div>
  );
};

export default AuthHeader;