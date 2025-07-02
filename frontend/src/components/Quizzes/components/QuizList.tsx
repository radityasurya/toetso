import React from 'react';
import { Edit, Trash2, Share2, BarChart3, Eye, Copy } from 'lucide-react';
import { Quiz } from '../../../types';
import GradingStatusBadge from '../../Common/QuizComponents/GradingStatusBadge';

interface QuizListProps {
  quizzes: Quiz[];
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
  onShare: (id: string) => void;
  onViewResults: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (quiz: Quiz) => void;
  getCategoryColor: (categoryName: string) => string;
  getDifficultyColor: (difficulty: string) => string;
  toggleStatus: (id: string) => void;
}

const QuizList: React.FC<QuizListProps> = ({
  quizzes,
  onEdit,
  onPreview,
  onShare,
  onViewResults,
  onDelete,
  onDuplicate,
  getCategoryColor,
  getDifficultyColor,
  toggleStatus
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="text-left py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Quiz</th>
              <th className="text-left py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Category</th>
              <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Difficulty</th>
              <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Questions</th>
              <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Time</th>
              <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Pass %</th>
              <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Status</th>
              <th className="text-center py-3 px-6 font-medium text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr 
                key={quiz.id} 
                className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  !quiz.isActive ? 'opacity-60' : ''
                }`}
              >
                <td className="py-4 px-6">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{quiz.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{quiz.description}</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getCategoryColor(quiz.category) }}
                    ></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{quiz.category}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="font-semibold text-gray-900 dark:text-white">{quiz.questions.length}</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="text-gray-600 dark:text-gray-400">{quiz.timeLimit}m</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="text-gray-600 dark:text-gray-400">{quiz.passingScore}%</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex flex-col items-center space-y-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      quiz.isActive 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    }`}>
                      {quiz.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {quiz.requiresGrading && (
                      <GradingStatusBadge status="needs_grading" compact />
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
                      <button
                        onClick={() => onEdit(quiz.id)}
                        className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                        title="Edit Quiz"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onShare(quiz.id)}
                        className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                        title="Share Quiz"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onViewResults(quiz.id)}
                        className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                        title="View Results"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onPreview(quiz.id)}
                        className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                        title="Preview Quiz"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDuplicate(quiz)}
                        className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                        title="Duplicate Quiz"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(quiz.id)}
                        className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                        title="Delete Quiz"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

export default QuizList;