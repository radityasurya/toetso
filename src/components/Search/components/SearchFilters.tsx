import React from 'react';
import { Category } from '../../../types';

interface SearchFiltersProps {
  filterType: 'all' | 'question' | 'quiz' | 'category';
  onFilterTypeChange: (value: 'all' | 'question' | 'quiz' | 'category') => void;
  filterCategory: string;
  onFilterCategoryChange: (value: string) => void;
  sortBy: 'relevance' | 'date' | 'title';
  onSortByChange: (value: 'relevance' | 'date' | 'title') => void;
  onClearFilters: () => void;
  categories: Category[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filterType,
  onFilterTypeChange,
  filterCategory,
  onFilterCategoryChange,
  sortBy,
  onSortByChange,
  onClearFilters,
  categories
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
          <select
            value={filterType}
            onChange={(e) => onFilterTypeChange(e.target.value as 'all' | 'question' | 'quiz' | 'category')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
          >
            <option value="all">All Types</option>
            <option value="question">Questions</option>
            <option value="quiz">Quizzes</option>
            <option value="category">Categories</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
          <select
            value={filterCategory}
            onChange={(e) => onFilterCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as 'relevance' | 'date' | 'title')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
          >
            <option value="relevance">Relevance</option>
            <option value="date">Date Created</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={onClearFilters}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;