import React from 'react';
import { 
  List, 
  CheckSquare, 
  Type, 
  AlignLeft, 
  MoveHorizontal, 
  ArrowUpDown
} from 'lucide-react';
import { Question } from '../../../types';

// Import question type components
import MultipleChoiceInput from './QuestionTypes/MultipleChoiceInput';
import MultipleAnswerInput from './QuestionTypes/MultipleAnswerInput';
import FillInBlankInput from './QuestionTypes/FillInBlankInput';
import LongAnswerInput from './QuestionTypes/LongAnswerInput';
import MatchingInput from './QuestionTypes/MatchingInput';
import OrderingInput from './QuestionTypes/OrderingInput';

interface QuestionInputProps {
  question: Question;
  userAnswer?: any;
  onAnswerChange: (answer: any) => void;
  disabled?: boolean;
  showHints?: boolean;
}

const QuestionInput: React.FC<QuestionInputProps> = ({
  question,
  userAnswer,
  onAnswerChange,
  disabled = false,
  showHints = true
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

      {/* Render the appropriate input component based on question type */}
      {question.type === 'multiple-choice' && (
        <MultipleChoiceInput
          question={question}
          userAnswer={userAnswer}
          onAnswerChange={onAnswerChange}
          disabled={disabled}
        />
      )}

      {question.type === 'multiple-answer' && (
        <MultipleAnswerInput
          question={question}
          userAnswer={userAnswer}
          onAnswerChange={onAnswerChange}
          disabled={disabled}
          showHints={showHints}
        />
      )}

      {question.type === 'fill-in-blank' && (
        <FillInBlankInput
          question={question}
          userAnswer={userAnswer}
          onAnswerChange={onAnswerChange}
          disabled={disabled}
          showHints={showHints}
        />
      )}

      {question.type === 'long-answer' && (
        <LongAnswerInput
          question={question}
          userAnswer={userAnswer}
          onAnswerChange={onAnswerChange}
          disabled={disabled}
          showHints={showHints}
        />
      )}

      {question.type === 'matching' && (
        <MatchingInput
          question={question}
          userAnswer={userAnswer}
          onAnswerChange={onAnswerChange}
          disabled={disabled}
          showHints={showHints}
        />
      )}

      {question.type === 'ordering' && (
        <OrderingInput
          question={question}
          userAnswer={userAnswer}
          onAnswerChange={onAnswerChange}
          disabled={disabled}
          showHints={showHints}
        />
      )}
    </div>
  );
};

export default QuestionInput;