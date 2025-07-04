import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import GradingStatusBadge from './GradingStatusBadge';

interface SubmissionCardProps {
  id: string;
  studentName: string;
  studentEmail: string;
  submittedAt: Date;
  score: number | null;
  status: 'needs_grading' | 'partially_graded' | 'graded' | 'passed' | 'failed';
  isSelected?: boolean;
  onClick: () => void;
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({
  id,
  studentName,
  studentEmail,
  submittedAt,
  score,
  status,
  isSelected = false,
  onClick
}) => {
  const getStatusDisplay = () => {
    if (status === 'needs_grading' || status === 'partially_graded') {
      return <GradingStatusBadge status={status} />;
    }
    
    return (
      <span className={`font-medium ${
        status === 'passed' 
          ? 'text-green-600 dark:text-green-400'
          : 'text-red-600 dark:text-red-400'
      }`}>
        {score}%
      </span>
    );
  };

  return (
    <div 
      onClick={onClick}
      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900 dark:text-white">{studentName}</h4>
        <GradingStatusBadge status={status} compact />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{studentEmail}</p>
      <div className="flex items-center justify-between mt-2 text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          {submittedAt.toLocaleDateString()}
        </span>
        {getStatusDisplay()}
      </div>
    </div>
  );
};

export default SubmissionCard;