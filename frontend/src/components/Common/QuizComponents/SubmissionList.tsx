import React from 'react';
import SubmissionCard from './SubmissionCard';
import Pagination from '../Pagination';

interface Submission {
  id: string;
  studentName: string;
  studentEmail: string;
  submittedAt: Date;
  score: number | null;
  status: 'needs_grading' | 'partially_graded' | 'graded' | 'passed' | 'failed';
}

interface SubmissionListProps {
  submissions: Submission[];
  selectedSubmissionId: string | null;
  onSelectSubmission: (submissionId: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

const SubmissionList: React.FC<SubmissionListProps> = ({
  submissions,
  selectedSubmissionId,
  onSelectSubmission,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Submissions</h3>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
        {submissions.length > 0 ? (
          submissions.map((submission) => (
            <SubmissionCard 
              key={submission.id}
              id={submission.id}
              studentName={submission.studentName}
              studentEmail={submission.studentEmail}
              submittedAt={submission.submittedAt}
              score={submission.score}
              status={submission.status}
              isSelected={selectedSubmissionId === submission.id}
              onClick={() => onSelectSubmission(submission.id)}
            />
          ))
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No submissions found</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
          />
        </div>
      )}
    </div>
  );
};

export default SubmissionList;