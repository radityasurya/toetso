import React from 'react';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface GradingStatusBadgeProps {
  status: 'needs_grading' | 'partially_graded' | 'graded' | 'passed' | 'failed';
  compact?: boolean;
  className?: string;
}

const GradingStatusBadge: React.FC<GradingStatusBadgeProps> = ({ 
  status, 
  compact = false,
  className = ''
}) => {
  let bgColor, textColor, borderColor, icon, label;
  
  switch (status) {
    case 'needs_grading':
      bgColor = 'bg-yellow-100 dark:bg-yellow-900/30';
      textColor = 'text-yellow-800 dark:text-yellow-300';
      borderColor = 'border-yellow-200 dark:border-yellow-800';
      icon = <Clock className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} flex-shrink-0`} />;
      label = 'Needs Grading';
      break;
    case 'partially_graded':
      bgColor = 'bg-orange-100 dark:bg-orange-900/30';
      textColor = 'text-orange-800 dark:text-orange-300';
      borderColor = 'border-orange-200 dark:border-orange-800';
      icon = <AlertTriangle className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} flex-shrink-0`} />;
      label = 'Partially Graded';
      break;
    case 'graded':
      bgColor = 'bg-blue-100 dark:bg-blue-900/30';
      textColor = 'text-blue-800 dark:text-blue-300';
      borderColor = 'border-blue-200 dark:border-blue-800';
      icon = <CheckCircle className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} flex-shrink-0`} />;
      label = 'Graded';
      break;
    case 'passed':
      bgColor = 'bg-green-100 dark:bg-green-900/30';
      textColor = 'text-green-800 dark:text-green-300';
      borderColor = 'border-green-200 dark:border-green-800';
      icon = <CheckCircle className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} flex-shrink-0`} />;
      label = 'Passed';
      break;
    case 'failed':
      bgColor = 'bg-red-100 dark:bg-red-900/30';
      textColor = 'text-red-800 dark:text-red-300';
      borderColor = 'border-red-200 dark:border-red-800';
      icon = <AlertTriangle className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} flex-shrink-0`} />;
      label = 'Failed';
      break;
  }

  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full border ${bgColor} ${textColor} ${borderColor} ${className}`}>
      {icon}
      <span className={`${compact ? 'text-xs' : 'text-sm'} font-medium`}>{label}</span>
    </div>
  );
};

export default GradingStatusBadge;