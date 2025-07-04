import React from 'react';
import { Edit, Trash2, EyeOff } from 'lucide-react';
import { Category } from '../../../types';

interface CategoryGridProps {
  categories: Category[];
  getCategoryStats: (categoryName: string) => {
    total: number;
    easy: number;
    medium: number;
    hard: number;
  };
  onEditCategory: (id: string) => void;
  onDeleteCategory: (id: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  getCategoryStats,
  onEditCategory,
  onDeleteCategory
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => {
        const stats = getCategoryStats(category.name);
        const isActive = stats.total > 0; // Categories with questions are considered "active"
        
        return (
          <div 
            key={category.id} 
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden card-hover flex flex-col ${
              !isActive ? 'opacity-60' : ''
            }`}
          >
            {/* Category Header */}
            <div className="p-6 pb-4 flex-1">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{category.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{category.description}</p>
                  </div>
                </div>
                
                {/* Action Buttons - Grouped */}
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1 ml-3">
                  <button
                    onClick={() => onEditCategory(category.id)}
                    className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                    title="Edit Category"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(category.id)}
                    className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Category Stats */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Questions</p>
                </div>
                <div>
                  <div className="flex justify-center space-x-1 mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" title={`${stats.easy} Easy`}></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" title={`${stats.medium} Medium`}></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full" title={`${stats.hard} Hard`}></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Difficulty Mix</p>
                </div>
              </div>

              {/* Difficulty Breakdown */}
              {stats.total > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-600 dark:text-green-400">Easy ({stats.easy})</span>
                    <span className="text-gray-500 dark:text-gray-400">{Math.round((stats.easy / stats.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <div 
                      className="bg-green-500 h-1 rounded-full transition-all"
                      style={{ width: `${(stats.easy / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-yellow-600 dark:text-yellow-400">Medium ({stats.medium})</span>
                    <span className="text-gray-500 dark:text-gray-400">{Math.round((stats.medium / stats.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <div 
                      className="bg-yellow-500 h-1 rounded-full transition-all"
                      style={{ width: `${(stats.medium / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-red-600 dark:text-red-400">Hard ({stats.hard})</span>
                    <span className="text-gray-500 dark:text-gray-400">{Math.round((stats.hard / stats.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <div 
                      className="bg-red-500 h-1 rounded-full transition-all"
                      style={{ width: `${(stats.hard / stats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Empty State - Stick to bottom */}
            {stats.total === 0 && (
              <div className="px-6 pb-4 mt-auto">
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  <EyeOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No questions yet</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CategoryGrid;