import React from 'react';
import { AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';

interface ConfirmSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  answeredCount: number;
  totalQuestions: number;
  timeRemaining: number;
  isSubmitting: boolean;
}

const ConfirmSubmitModal: React.FC<ConfirmSubmitModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  answeredCount,
  totalQuestions,
  timeRemaining,
  isSubmitting
}) => {
  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 transition-colors">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Submit Quiz?</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Are you sure you want to submit your quiz? You won't be able to change your answers after submission.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Answered:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {answeredCount}/{totalQuestions}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Time left:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>

          {answeredCount < totalQuestions && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                You have {totalQuestions - answeredCount} unanswered questions.
              </p>
            </div>
          )}
          
          {/* Review Answers Section */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Question Summary:</h4>
            <div className="max-h-40 overflow-y-auto pr-2 space-y-2">
              {Array.from({ length: totalQuestions }).map((_, index) => {
                const isAnswered = index < answeredCount; // Simplified for demo
                return (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Question {index + 1}</span>
                    <span className="flex items-center">
                      {isAnswered ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-xs ${isAnswered ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {isAnswered ? 'Answered' : 'Not answered'}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Continue Quiz
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSubmitModal;