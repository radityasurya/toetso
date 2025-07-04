import React from 'react';
import { Search, ArrowLeft, Filter, ChevronDown } from 'lucide-react';

interface SearchHeaderProps {
  query: string;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onGoBack: () => void;
  resultCount: number;
  onToggleFilters: () => void;
  showFilters: boolean;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  query,
  searchTerm,
  onSearchTermChange,
  onSearch,
  onGoBack,
  resultCount,
  onToggleFilters,
  showFilters
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={onGoBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Search Results</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {query ? `Results for "${query}"` : 'Browse all content'}
          </p>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={onSearch} className="mb-4">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            placeholder="Search questions, quizzes, categories..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
          />
        </div>
      </form>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Found <span className="font-medium">{resultCount}</span> results
          {searchTerm && <span> for "{searchTerm}"</span>}
        </p>
        
        <button
          onClick={onToggleFilters}
          className="flex items-center space-x-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default SearchHeader;