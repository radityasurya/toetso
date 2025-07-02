import React from 'react';
import { Play, Target, Users, Clock, MessageSquare } from 'lucide-react';
import { Quiz } from '../../../types';

interface QuizStatsProps {
  quizzes: Quiz[];
}

const QuizStats: React.FC<QuizStatsProps> = ({ quizzes }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Quizzes</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{quizzes.length}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Quizzes</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{quizzes.filter(q => q.isActive).length}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Questions</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {quizzes.length > 0 ? Math.round(quizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0) / quizzes.length) : 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Time Limit</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {quizzes.length > 0 ? Math.round(quizzes.reduce((acc, quiz) => acc + quiz.timeLimit, 0) / quizzes.length) : 0}m
            </p>
          </div>
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Needs Grading</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{quizzes.filter(q => q.requiresGrading).length}</p>
          </div>
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizStats;