import React from 'react';
import { List, CheckSquare, Type, AlignLeft, MoveHorizontal, ArrowUpDown } from 'lucide-react';

interface QuestionNavigatorProps {
  questions: any[];
  currentQuestionIndex: number;
  answeredQuestions: { [key: number]: boolean };
  onQuestionSelect: (index: number) => void;
  disabled?: boolean;
}

const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  currentQuestionIndex,
  answeredQuestions,
  onQuestionSelect,
  disabled = false
}) => {
  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice': return List;
      case 'multiple-answer': return CheckSquare;
      case 'fill-in-blank': return Type;
      case 'long-answer': return AlignLeft;
      case 'matching': return MoveHorizontal;
      case 'ordering': return ArrowUpDown;
      default: return List;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Questions</h3>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {questions.map((question, index) => {
          const QuestionTypeIcon = getQuestionTypeIcon(question.type);
          
          return (
            <button
              key={index}
              onClick={() => !disabled && onQuestionSelect(index)}
              disabled={disabled}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors relative ${
                disabled ? 'opacity-50 cursor-not-allowed' :
                index === currentQuestionIndex
                  ? 'bg-blue-500 text-white shadow-md'
                  : answeredQuestions[index]
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
              }`}
              title={`Question ${index + 1}${answeredQuestions[index] ? ' (Answered)' : ''}`}
            >
              {index + 1}
              <QuestionTypeIcon className="w-3 h-3 absolute bottom-1 right-1 opacity-70" />
            </button>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Current</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Answered</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Unanswered</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigator;