import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../../api';
import PerformanceMetrics from './components/PerformanceMetrics';
import CategoryPerformance from './components/CategoryPerformance';
import DifficultQuestions from './components/DifficultQuestions';
import WeeklyTrends from './components/WeeklyTrends';
import QuickInsights from './components/QuickInsights';
import LoadingSpinner from '../Common/LoadingSpinner';

const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        const data = await dashboardApi.getAnalytics();
        setAnalyticsData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load analytics data. Please try again later.');
        console.error('Error fetching analytics data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading analytics data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Error Loading Analytics</h3>
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

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No analytics data available</p>
      </div>
    );
  }

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
      <PerformanceMetrics metrics={analyticsData.performanceMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <CategoryPerformance categories={analyticsData.categoryPerformance} />

        {/* Difficult Questions */}
        <DifficultQuestions questions={analyticsData.difficultQuestions} />
      </div>

      {/* Recent Trends */}
      <WeeklyTrends trends={analyticsData.recentTrends} />

      {/* Quick Insights */}
      <QuickInsights />
    </div>
  );
};

export default AnalyticsDashboard;