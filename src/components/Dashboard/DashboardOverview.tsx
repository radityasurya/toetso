import React from 'react';
import { HelpCircle, FileText, Users, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const DashboardOverview: React.FC = () => {
  const stats = [
    { label: 'Total Questions', value: '152', icon: HelpCircle, color: 'bg-blue-500', change: '+12%' },
    { label: 'Active Quizzes', value: '8', icon: FileText, color: 'bg-green-500', change: '+3%' },
    { label: 'Quiz Attempts', value: '1,247', icon: Users, color: 'bg-purple-500', change: '+18%' },
    { label: 'Avg. Success Rate', value: '78%', icon: TrendingUp, color: 'bg-orange-500', change: '+5%' },
  ];

  const recentActivity = [
    { action: 'New question added', category: 'Traffic Signs', time: '2 hours ago', type: 'success' },
    { action: 'Quiz "Basic Rules" completed', user: 'Student #1247', time: '4 hours ago', type: 'info' },
    { action: 'Question updated', category: 'Parking Rules', time: '6 hours ago', type: 'warning' },
    { action: 'New quiz created', category: 'Emergency Situations', time: '1 day ago', type: 'success' },
  ];

  const topCategories = [
    { name: 'Traffic Signs', questions: 45, successRate: 82, color: 'bg-blue-500' },
    { name: 'Road Rules', questions: 38, successRate: 75, color: 'bg-green-500' },
    { name: 'Vehicle Safety', questions: 29, successRate: 79, color: 'bg-yellow-500' },
    { name: 'Parking', questions: 22, successRate: 71, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.category && `${activity.category} • `}
                    {activity.user && `${activity.user} • `}
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories Overview</h3>
          <div className="space-y-4">
            {topCategories.map((category, index) => (
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
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <HelpCircle className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">Add New Question</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Create a new exam question</p>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
            <FileText className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">Create Quiz</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Build a new quiz set</p>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
            <TrendingUp className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">View Analytics</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Check performance stats</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;