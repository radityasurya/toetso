import React from 'react';
import { FileText } from 'lucide-react';
import GradingStatusBadge from '../../Common/QuizComponents/GradingStatusBadge';

interface ResultsTableProps {
  results: any[];
  onViewResult: (result: any) => void;
  getDifficultyColor: (difficulty?: string) => string;
  formatTime: (seconds: number) => string;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  results,
  onViewResult,
  getDifficultyColor,
  formatTime
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="text-left py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Student</th>
              <th className="text-left py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Quiz</th>
              <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Score</th>
              <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Correct</th>
              <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Time</th>
              <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Status</th>
              <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Completed</th>
              <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="py-4 px-6">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{result.studentName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{result.studentEmail}</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{result.quizTitle}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{result.category}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(result.difficulty)}`}>
                        {result.difficulty}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center">
                    {result.status === 'needs_grading' || result.status === 'partially_graded' ? (
                      <div className="flex flex-col items-center">
                        <GradingStatusBadge status={result.status} />
                        {result.status === 'partially_graded' && result.score !== null && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Partial: {result.score}%
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className={`text-lg font-bold ${
                        result.status === 'passed' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {result.score}%
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="text-gray-900 dark:text-white">
                    {result.correctAnswers}/{result.totalQuestions}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatTime(result.timeSpent)}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <GradingStatusBadge status={result.status} />
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div>{result.completedAt.toLocaleDateString()}</div>
                    <div>{result.completedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onViewResult(result)}
                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="View student answers"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;