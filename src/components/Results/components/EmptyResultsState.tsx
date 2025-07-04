import React from 'react';
import { FileText } from 'lucide-react';

interface EmptyResultsStateProps {
  hasFilters: boolean;
}

const EmptyResultsState: React.FC<EmptyResultsStateProps> = ({ hasFilters }) => {
  return (
    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
      <p className="text-gray-500 dark:text-gray-400">
        {hasFilters
          ? 'Try adjusting your search or filter criteria.'
          : 'No quiz results available yet.'}
      </p>
    </div>
  );
};

export default EmptyResultsState;