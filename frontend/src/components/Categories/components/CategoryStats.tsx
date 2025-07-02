import React from 'react';
import { Tag, BarChart3, EyeOff } from 'lucide-react';
import { Category } from '../../../types';

interface CategoryStatsProps {
  categories: Category[];
  getCategoryStats: (categoryName: string) => {
    total: number;
    easy: number;
    medium: number;
    hard: number;
  };
}

const CategoryStats: React.FC<CategoryStatsProps> = ({ categories, getCategoryStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Categories</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <Tag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Questions</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {categories.reduce((acc, cat) => acc + getCategoryStats(cat.name).total, 0)}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Questions</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {categories.length > 0 
                ? Math.round(categories.reduce((acc, cat) => acc + getCategoryStats(cat.name).total, 0) / categories.length)
                : 0
              }
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Empty Categories</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {categories.filter(cat => getCategoryStats(cat.name).total === 0).length}
            </p>
          </div>
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
            <EyeOff className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryStats;