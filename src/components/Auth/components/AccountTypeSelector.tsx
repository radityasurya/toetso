import React from 'react';
import { GraduationCap, Award } from 'lucide-react';

interface AccountTypeSelectorProps {
  activeTab: 'teacher' | 'student';
  setActiveTab: (tab: 'teacher' | 'student') => void;
}

const AccountTypeSelector: React.FC<AccountTypeSelectorProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Account Type *
      </label>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('teacher')}
          className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-colors ${
            activeTab === 'teacher'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <GraduationCap className={`w-8 h-8 mb-2 ${
            activeTab === 'teacher' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
          }`} />
          <span className={`font-medium ${
            activeTab === 'teacher' ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
          }`}>Teacher</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Create instructor account</span>
        </button>
        
        <button
          type="button"
          onClick={() => setActiveTab('student')}
          className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-colors ${
            activeTab === 'student'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <Award className={`w-8 h-8 mb-2 ${
            activeTab === 'student' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
          }`} />
          <span className={`font-medium ${
            activeTab === 'student' ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
          }`}>Student</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Create student account</span>
        </button>
      </div>
    </div>
  );
};

export default AccountTypeSelector;