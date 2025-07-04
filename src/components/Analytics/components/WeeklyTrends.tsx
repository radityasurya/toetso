import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Trend {
  period: string;
  quizzes: number;
  avgScore: number;
  improvement: string;
}

interface WeeklyTrendsProps {
  trends: Trend[];
}

const WeeklyTrends: React.FC<WeeklyTrendsProps> = ({ trends }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Performance Trends</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Period</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Quiz Attempts</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Average Score</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Improvement</th>
            </tr>
          </thead>
          <tbody>
            {trends.map((trend, index) => (
              <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{trend.period}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{trend.quizzes}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{trend.avgScore}%</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center space-x-1 ${
                    trend.improvement.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {trend.improvement.startsWith('+') ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-medium">{trend.improvement}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklyTrends;