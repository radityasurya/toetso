import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Category {
  name: string;
  attempts: number;
  avgScore: number;
  difficulty: string;
  trend: 'up' | 'down';
}

interface CategoryPerformanceProps {
  categories: Category[];
}

const CategoryPerformance: React.FC<CategoryPerformanceProps> = ({ categories }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Performance</h3>
      <div className="space-y-4">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">{category.name}</h4>
                <div className={`flex items-center space-x-1 ${
                  category.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {category.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>{category.attempts} attempts</span>
                <span className="font-medium">{category.avgScore}% avg score</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${category.avgScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPerformance;