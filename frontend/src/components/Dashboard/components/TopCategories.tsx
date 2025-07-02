import React from 'react';

interface Category {
  name: string;
  questions: number;
  successRate: number;
  color: string;
}

interface TopCategoriesProps {
  categories: Category[];
}

const TopCategories: React.FC<TopCategoriesProps> = ({ categories }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories Overview</h3>
      <div className="space-y-4">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{category.questions} questions</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{category.successRate}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">success rate</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCategories;