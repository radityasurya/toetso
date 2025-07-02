import React from 'react';
import { 
  List, 
  CheckSquare, 
  Type, 
  AlignLeft, 
  MoveHorizontal, 
  ArrowUpDown,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Question } from '../../../../types';

interface QuestionPreviewProps {
  question: Question;
  showCorrectAnswers?: boolean;
}

const QuestionPreview: React.FC<QuestionPreviewProps> = ({
  question,
  showCorrectAnswers = false
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

  const TypeIcon = getQuestionTypeIcon(question.type);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-2">
        <TypeIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {question.type === 'multiple-choice' ? 'Single Answer' : 
           question.type === 'multiple-answer' ? 'Multiple Answers' : 
           question.type === 'fill-in-blank' ? 'Fill in Blank' :
           question.type === 'long-answer' ? 'Long Answer' :
           question.type === 'matching' ? 'Matching' :
           'Ordering'}
        </span>
      </div>

      {/* Question content */}
      <div 
        className="text-lg font-medium text-gray-900 dark:text-white mb-4"
        dangerouslySetInnerHTML={{ __html: question.question }}
      />

      {/* Render preview based on question type */}
      {question.type === 'multiple-choice' && <MultipleChoicePreview question={question} showCorrectAnswers={showCorrectAnswers} />}
      {question.type === 'multiple-answer' && <MultipleAnswerPreview question={question} showCorrectAnswers={showCorrectAnswers} />}
      {question.type === 'fill-in-blank' && <FillInBlankPreview question={question} showCorrectAnswers={showCorrectAnswers} />}
      {question.type === 'long-answer' && <LongAnswerPreview question={question} showCorrectAnswers={showCorrectAnswers} />}
      {question.type === 'matching' && <MatchingPreview question={question} showCorrectAnswers={showCorrectAnswers} />}
      {question.type === 'ordering' && <OrderingPreview question={question} showCorrectAnswers={showCorrectAnswers} />}

      {/* Explanation */}
      {question.explanation && showCorrectAnswers && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Explanation:</h5>
          <div 
            className="text-sm text-gray-600 dark:text-gray-400"
            dangerouslySetInnerHTML={{ __html: question.explanation }}
          />
        </div>
      )}
    </div>
  );
};

// Sub-components for different question types
const MultipleChoicePreview: React.FC<{ question: Question; showCorrectAnswers: boolean }> = ({ 
  question, 
  showCorrectAnswers 
}) => {
  return (
    <div className="space-y-2">
      {question.options?.map((option, index) => (
        <div 
          key={index} 
          className={`p-3 rounded-lg border ${
            showCorrectAnswers && index === question.correctAnswer
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {String.fromCharCode(65 + index)}.
              </span>
              <span 
                className="text-gray-900 dark:text-white"
                dangerouslySetInnerHTML={{ __html: option }}
              />
            </div>
            {showCorrectAnswers && index === question.correctAnswer && (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const MultipleAnswerPreview: React.FC<{ question: Question; showCorrectAnswers: boolean }> = ({ 
  question, 
  showCorrectAnswers 
}) => {
  return (
    <div className="space-y-2">
      {question.options?.map((option, index) => (
        <div 
          key={index} 
          className={`p-3 rounded-lg border ${
            showCorrectAnswers && question.correctAnswers?.includes(index)
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {String.fromCharCode(65 + index)}.
              </span>
              <span 
                className="text-gray-900 dark:text-white"
                dangerouslySetInnerHTML={{ __html: option }}
              />
            </div>
            {showCorrectAnswers && question.correctAnswers?.includes(index) && (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const FillInBlankPreview: React.FC<{ question: Question; showCorrectAnswers: boolean }> = ({ 
  question, 
  showCorrectAnswers 
}) => {
  return (
    <div className="space-y-3">
      {showCorrectAnswers && (
        <div className="p-3 rounded-lg border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700 dark:text-gray-300">Correct answer:</span>
            <span className="font-medium text-green-600 dark:text-green-400">{question.correctText}</span>
          </div>
        </div>
      )}
      <div className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Answer field:
        </label>
        <input
          type="text"
          disabled
          placeholder="Student will type answer here"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
        />
      </div>
    </div>
  );
};

const LongAnswerPreview: React.FC<{ question: Question; showCorrectAnswers: boolean }> = ({ 
  question, 
  showCorrectAnswers 
}) => {
  return (
    <div className="space-y-3">
      <div className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-2 mb-4">
          <AlignLeft className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-blue-700 dark:text-blue-300 font-medium">Long Answer Question</span>
        </div>
        
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Answer field:
        </label>
        <div className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500">
          Student will provide a detailed response here
        </div>
      </div>
      
      {showCorrectAnswers && question.gradingCriteria && (
        <div className="p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <h5 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Grading Criteria:</h5>
          <div 
            className="text-sm text-blue-600 dark:text-blue-400"
            dangerouslySetInnerHTML={{ __html: question.gradingCriteria }}
          />
          <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
            <span className="font-medium">Maximum Score:</span> {question.maxScore || 5} points
          </div>
        </div>
      )}
    </div>
  );
};

const MatchingPreview: React.FC<{ question: Question; showCorrectAnswers: boolean }> = ({ 
  question, 
  showCorrectAnswers 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {question.matchingPairs?.map((pair, index) => (
        <div key={index} className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-700 dark:text-gray-300">{pair.left}</span>
            <MoveHorizontal className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </div>
          {showCorrectAnswers ? (
            <div className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-green-700 dark:text-green-300">
              {pair.right}
            </div>
          ) : (
            <div className="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-gray-500 dark:text-gray-400">
              (Matching item)
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const OrderingPreview: React.FC<{ question: Question; showCorrectAnswers: boolean }> = ({ 
  question, 
  showCorrectAnswers 
}) => {
  const displayItems = showCorrectAnswers 
    ? question.correctOrder || [] 
    : [...(question.correctOrder || [])].sort(() => Math.random() - 0.5);

  return (
    <div className="space-y-2">
      {displayItems.map((item, index) => (
        <div 
          key={index} 
          className={`p-3 rounded-lg border flex items-center space-x-3 ${
            showCorrectAnswers
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
          }`}
        >
          <div className={`flex items-center justify-center w-8 h-8 rounded-full font-medium ${
            showCorrectAnswers
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}>
            {index + 1}
          </div>
          <span className="text-gray-900 dark:text-white">{item}</span>
        </div>
      ))}
      
      {showCorrectAnswers && (
        <div className="mt-2 text-sm text-green-600 dark:text-green-400">
          <span className="font-medium">Note:</span> Items are shown in the correct order.
        </div>
      )}
      {!showCorrectAnswers && (
        <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
          <span className="font-medium">Note:</span> Students will need to arrange these items in the correct order.
        </div>
      )}
    </div>
  );
};

export default QuestionPreview;