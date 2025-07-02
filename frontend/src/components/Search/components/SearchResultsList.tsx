import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, FileText, Tag } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  type: 'question' | 'quiz' | 'category';
  category?: string;
  description?: string;
  path: string;
  difficulty?: string;
  createdAt?: Date;
}

interface SearchResultsListProps {
  results: SearchResult[];
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({ results }) => {
  const navigate = useNavigate();

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'question': return HelpCircle;
      case 'quiz': return FileText;
      case 'category': return Tag;
      default: return HelpCircle;
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case 'question': return 'text-green-500';
      case 'quiz': return 'text-purple-500';
      case 'category': return 'text-indigo-500';
      default: return 'text-gray-500';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="p-6">
        <div className="space-y-4">
          {results.map((result) => {
            const Icon = getResultIcon(result.type);
            return (
              <div
                key={`${result.type}-${result.id}`}
                onClick={() => navigate(result.path)}
                className="flex items-start space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
              >
                <Icon className={`w-6 h-6 mt-1 ${getResultColor(result.type)}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {result.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      result.type === 'question' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                      result.type === 'quiz' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' :
                      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
                    }`}>
                      {result.type}
                    </span>
                    {result.difficulty && (
                      <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(result.difficulty)}`}>
                        {result.difficulty}
                      </span>
                    )}
                  </div>
                  
                  {result.category && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                      {result.category}
                    </p>
                  )}
                  
                  {result.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {result.description}
                    </p>
                  )}
                  
                  {result.createdAt && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      Created {result.createdAt.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsList;