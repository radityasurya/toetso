import React from 'react';
import { FileText, Clock } from 'lucide-react';

interface EmptySubmissionStateProps {
  hasNeedsGrading: boolean;
  statusFilter: string;
  onFilterChange: () => void;
}

const EmptySubmissionState: React.FC<EmptySubmissionStateProps> = ({
  hasNeedsGrading,
  statusFilter,
  onFilterChange
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center transition-colors">
      <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a Submission</h3>
      <p className="text-gray-500 dark:text-gray-400">
        Click on a submission from the list to view details and grade responses.
      </p>
      
      {hasNeedsGrading && statusFilter !== 'needs_grading' && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg inline-block">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <button 
              onClick={onFilterChange}
              className="text-sm text-yellow-800 dark:text-yellow-300 hover:underline"
            >
              Some submissions need grading. Click here to view them.
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmptySubmissionState;