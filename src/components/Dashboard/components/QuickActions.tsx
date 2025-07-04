import React from 'react';
import { NavigateFunction } from 'react-router-dom';
import { HelpCircle, FileText, TrendingUp } from 'lucide-react';

interface QuickActionsProps {
  onNavigate: NavigateFunction;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('/questions/new')}
          className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          <HelpCircle className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          <div className="text-left">
            <p className="font-medium text-gray-900 dark:text-white">Add New Question</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Create a new exam question</p>
          </div>
        </button>
        <button
          onClick={() => onNavigate('/quizzes/new')}
          className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
        >
          <FileText className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          <div className="text-left">
            <p className="font-medium text-gray-900 dark:text-white">Create Quiz</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Build a new quiz set</p>
          </div>
        </button>
        <button
          onClick={() => onNavigate('/analytics')}
          className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
        >
          <TrendingUp className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          <div className="text-left">
            <p className="font-medium text-gray-900 dark:text-white">View Analytics</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Check performance stats</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;