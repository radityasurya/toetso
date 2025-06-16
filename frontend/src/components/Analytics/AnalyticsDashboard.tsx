import React from 'react';
import { TrendingUp, TrendingDown, Users, Clock, CheckCircle, XCircle, Target, Award } from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
  const performanceMetrics = [
    { label: 'Total Quiz Attempts', value: '1,247', change: '+18%', trend: 'up', icon: Users },
    { label: 'Average Score', value: '78.5%', change: '+5.2%', trend: 'up', icon: Target },
    { label: 'Completion Rate', value: '92.3%', change: '+2.1%', trend: 'up', icon: CheckCircle },
    { label: 'Avg. Time per Quiz', value: '8.5 min', change: '-1.2%', trend: 'down', icon: Clock },
  ];

  const categoryPerformance = [
    { name: 'Traffic Signs', attempts: 456, avgScore: 82.1, difficulty: 'Easy', trend: 'up' },
    { name: 'Road Rules', attempts: 398, avgScore: 75.3, difficulty: 'Medium', trend: 'up' },
    { name: 'Vehicle Safety', attempts: 287, avgScore: 79.8, difficulty: 'Easy', trend: 'down' },
    { name: 'Parking', attempts: 234, avgScore: 71.2, difficulty: 'Hard', trend: 'up' },
    { name: 'Emergency Situations', attempts: 187, avgScore: 68.9, difficulty: 'Hard', trend: 'down' },
  ];

  const difficultQuestions = [
    { question: 'What is the proper following distance in heavy rain?', category: 'Vehicle Safety', successRate: 45.2, attempts: 128 },
    { question: 'When can you legally park in a handicap space?', category: 'Parking', successRate: 52.1, attempts: 98 },
    { question: 'What should you do if your brakes fail?', category: 'Emergency Situations', successRate: 48.7, attempts: 87 },
    { question: 'How do you handle a tire blowout?', category: 'Emergency Situations', successRate: 41.3, attempts: 76 },
  ];

  const recentTrends = [
    { period: 'This Week', quizzes: 89, avgScore: 79.2, improvement: '+3.1%' },
    { period: 'Last Week', quizzes: 76, avgScore: 76.8, improvement: '+1.9%' },
    { period: 'Two Weeks Ago', quizzes: 82, avgScore: 75.4, improvement: '-2.3%' },
    { period: 'Three Weeks Ago', quizzes: 94, avgScore: 77.2, improvement: '+4.7%' },
  ];

  React.useEffect(() => { document.title = 'Analytics | Kuizzz'; }, []);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Monitor quiz performance and track student progress
        </p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.trend === 'up';
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;
          
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isPositive ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                }`}>
                  <Icon className={`w-5 h-5 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                </div>
                <div className={`flex items-center space-x-1 ${
                  isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  <TrendIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{metric.change}</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{metric.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Performance</h3>
          <div className="space-y-4">
            {categoryPerformance.map((category, index) => (
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

        {/* Difficult Questions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Most Challenging Questions</h3>
          <div className="space-y-4">
            {difficultQuestions.map((question, index) => (
              <div key={index} className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg transition-colors">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">{question.question}</h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{question.category}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-red-600 dark:text-red-400 font-medium">{question.successRate}% success</span>
                    <span className="text-gray-500 dark:text-gray-400">{question.attempts} attempts</span>
                  </div>
                </div>
                <div className="w-full bg-red-200 dark:bg-red-800 rounded-full h-2 mt-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${question.successRate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Trends */}
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
              {recentTrends.map((trend, index) => (
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

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8" />
            <span className="text-blue-100 text-sm">Top Performer</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">Traffic Signs</h3>
          <p className="text-blue-100">82.1% average score</p>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8" />
            <span className="text-green-100 text-sm">Success Rate</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">92.3%</h3>
          <p className="text-green-100">Quiz completion rate</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8" />
            <span className="text-purple-100 text-sm">Improvement</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">+18%</h3>
          <p className="text-purple-100">More attempts this month</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;