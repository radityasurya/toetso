import React from 'react';
import { UsersIcon, User, GraduationCap, Award } from 'lucide-react';
import { User as UserType } from '../../../types';

interface UserStatsProps {
  users: UserType[];
}

const UserStats: React.FC<UserStatsProps> = ({ users }) => {
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const teacherCount = users.filter(u => u.role === 'teacher').length;
  const studentCount = users.filter(u => u.role === 'student').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalUsers}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <UsersIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeUsers}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <User className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Administrators</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{adminCount}</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
            <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Teachers</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{teacherCount}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Students</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{studentCount}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;