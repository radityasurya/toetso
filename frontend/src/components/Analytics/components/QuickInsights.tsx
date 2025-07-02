import React from 'react';
import { Award, CheckCircle, Target } from 'lucide-react';

const QuickInsights: React.FC = () => {
  return (
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
  );
};

export default QuickInsights;