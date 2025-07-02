import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, FileText, Users, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { dashboardApi } from '../../api';
import DashboardStats from './components/DashboardStats';
import RecentActivity from './components/RecentActivity';
import TopCategories from './components/TopCategories';
import QuickActions from './components/QuickActions';
import LoadingSpinner from '../Common/LoadingSpinner';

const DashboardOverview: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await dashboardApi.getStats();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading dashboard data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Error Loading Dashboard</h3>
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No dashboard data available</p>
      </div>
    );
  }

  const stats = [
    { label: 'Total Questions', value: dashboardData.totalQuestions.toString(), icon: HelpCircle, color: 'bg-blue-500', change: '+12%' },
    { label: 'Active Quizzes', value: dashboardData.activeQuizzes.toString(), icon: FileText, color: 'bg-green-500', change: '+3%' },
    { label: 'Quiz Attempts', value: dashboardData.totalAttempts.toString(), icon: Users, color: 'bg-purple-500', change: '+18%' },
    { label: 'Avg. Success Rate', value: `${dashboardData.avgSuccessRate}%`, icon: TrendingUp, color: 'bg-orange-500', change: '+5%' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <RecentActivity activities={dashboardData.recentActivity} />

        {/* Top Categories */}
        <TopCategories categories={dashboardData.topCategories} />
      </div>

      {/* Quick Actions */}
      <QuickActions onNavigate={navigate} />
    </div>
  );
};

export default DashboardOverview;