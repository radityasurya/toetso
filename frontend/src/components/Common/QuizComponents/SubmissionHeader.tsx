import React from 'react';
import { User, Mail, Calendar, Clock, FileText } from 'lucide-react';
import GradingStatusBadge from './GradingStatusBadge';

interface SubmissionHeaderProps {
  studentName: string;
  studentEmail: string;
  submittedAt: Date;
  timeSpent: number;
  score: number | null;
  status: 'needs_grading' | 'partially_graded' | 'graded' | 'passed' | 'failed';
  saveSuccess?: boolean;
}

const SubmissionHeader: React.FC<SubmissionHeaderProps> = ({
  studentName,
  studentEmail,
  submittedAt,
  timeSpent,
  score,
  status,
  saveSuccess = false
}) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{studentName}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Mail className="w-4 h-4" />
            <span>{studentEmail}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 transition-colors">
          <div className="flex items-center space-x-2 mb-1">
            <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Submitted</span>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {submittedAt.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 transition-colors">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Time Spent</span>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {formatTime(timeSpent)}
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 transition-colors">
          <div className="flex items-center space-x-2 mb-1">
            <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Score</span>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {status === 'needs_grading' || status === 'partially_graded' 
              ? 'Pending Grading' 
              : `${score}%`}
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 transition-colors">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm text-gray-700 dark:text-gray-300">Status</span>
          </div>
          <GradingStatusBadge status={status} />
        </div>
      </div>
      
      {/* Success message */}
      {saveSuccess && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm text-green-800 dark:text-green-300">Grade saved successfully</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHeader;