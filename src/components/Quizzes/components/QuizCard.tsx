import React from 'react';
import { Edit, Trash2, Play, Eye, Copy, Share2, BarChart3 } from 'lucide-react';
import { Quiz } from '../../../types';
import GradingStatusBadge from '../../Common/QuizComponents/GradingStatusBadge';

interface QuizCardProps {
  quiz: Quiz;
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
  onShare: (id: string) => void;
  onViewResults: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (quiz: Quiz) => void;
  getCategoryColor: (categoryName: string) => string;
  getDifficultyColor: (difficulty: string) => string;
}

const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  onEdit,
  onPreview,
  onShare,
  onViewResults,
  onDelete,
  onDuplicate,
  getCategoryColor,
  getDifficultyColor
}) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden card-hover flex flex-col ${
        !quiz.isActive ? 'opacity-60' : ''
      }`}
    >
      {/* Quiz Header */}
      <div className="p-6 pb-4 flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getCategoryColor(quiz.category) }}
              ></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{quiz.category}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(quiz.difficulty)}`}>
                {quiz.difficulty}
              </span>
              {quiz.requiresGrading && (
                <GradingStatusBadge status="needs_grading" compact />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{quiz.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{quiz.description}</p>
          </div>
          
          {/* Action Buttons - Grouped */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1 ml-3">
            <button
              onClick={() => onEdit(quiz.id)}
              className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
              title="Edit quiz"
            >
              <Edit className="w-4 h-4" />
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
              title="Delete quiz"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quiz Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{quiz.questions.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Questions</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{quiz.timeLimit}m</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Time Limit</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{quiz.passingScore}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Pass Score</p>
          </div>
        </div>
      </div>

      {/* Quiz Actions - Stick to bottom */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 transition-colors mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => onShare(quiz.id)}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              title="Share Quiz"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewResults(quiz.id)}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              title="View Results"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => onPreview(quiz.id)}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Preview Quiz"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button 
              onClick={() => onPreview(quiz.id)}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
              title="Start Quiz"
            >
              <Play className="w-4 h-4" />
              <span>Start</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quiz Footer with dates - Stick to bottom */}
      <div className="px-6 py-3 rounded-b-lg transition-colors">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Created {quiz.createdAt.toLocaleDateString()}</span>
          <span>Updated {quiz.updatedAt.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;