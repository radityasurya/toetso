import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Category } from '../../../types';

interface CategoryListProps {
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

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  getCategoryStats,
  onEditCategory,
  onDeleteCategory
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="text-left py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Category</th>
              <th className="text-left py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Description</th>
              <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Questions</th>
              <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Easy</th>
              <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Medium</th>
              <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Hard</th>
              <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const stats = getCategoryStats(category.name);
              const isActive = stats.total > 0;
              
              return (
                <tr 
                  key={category.id} 
                  className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    !isActive ? 'opacity-60' : ''
                  }`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{category.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="font-semibold text-gray-900 dark:text-white">{stats.total}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-green-600 dark:text-green-400 font-medium">{stats.easy}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">{stats.medium}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-red-600 dark:text-red-400 font-medium">{stats.hard}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryList;