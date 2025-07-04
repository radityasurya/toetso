import React from 'react';
import { Facebook, Twitter, ToggleLeft as Google } from 'lucide-react';

interface SocialButtonsProps {
  onSocialLogin: (provider: string) => void;
}

const SocialButtons: React.FC<SocialButtonsProps> = ({ onSocialLogin }) => {
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => onSocialLogin('Google')}
          className="flex justify-center items-center py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Google className="w-5 h-5 text-red-500" />
        </button>
        <button
          type="button"
          onClick={() => onSocialLogin('Facebook')}
          className="flex justify-center items-center py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Facebook className="w-5 h-5 text-blue-600" />
        </button>
        <button
          type="button"
          onClick={() => onSocialLogin('Twitter')}
          className="flex justify-center items-center py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Twitter className="w-5 h-5 text-blue-400" />
        </button>
      </div>
    </>
  );
};

export default SocialButtons;