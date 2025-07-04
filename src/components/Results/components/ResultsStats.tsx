import React from 'react';
import { FileText, CheckCircle, Clock, BarChart3, Award, AlertCircle } from 'lucide-react';

interface ResultsStatsProps {
  stats: {
    totalAttempts: number;
    passedAttempts: number;
    averageScore: number;
    averageTime: number;
    passRate: number;
    needsGrading: number;
  };
  formatTime: (seconds: number) => string;
}

const ResultsStats: React.FC<ResultsStatsProps> = ({ stats, formatTime }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 transition-colors">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-3">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalAttempts}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Attempts</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 transition-colors">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-3">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.passRate}%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pass Rate</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 transition-colors">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-3">
            <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.averageScore}%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Avg Score</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 transition-colors">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-3">
            <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatTime(stats.averageTime)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Avg Time</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 transition-colors">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-3">
            <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.passedAttempts}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Passed</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 transition-colors">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.needsGrading}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Needs Grading</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsStats;