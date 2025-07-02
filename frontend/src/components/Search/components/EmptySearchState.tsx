import React from 'react';
import { Search } from 'lucide-react';

interface EmptySearchStateProps {
  searchTerm: string;
  onClearSearch: () => void;
}

const EmptySearchState: React.FC<EmptySearchStateProps> = ({ searchTerm, onClearSearch }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center transition-colors">
      <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        {searchTerm 
          ? `No results found for "${searchTerm}". Try adjusting your search terms or filters.`
          : 'Try searching for questions, quizzes, or categories.'
        }
      </p>
      <button
        onClick={onClearSearch}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        Clear Search
      </button>
    </div>
  );
};

export default EmptySearchState;