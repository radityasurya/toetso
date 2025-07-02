import React from 'react';
import { 
  List, 
  CheckSquare, 
  Type, 
  AlignLeft, 
  MoveHorizontal, 
  ArrowUpDown,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Question } from '../../../types';
import QuestionReview from './QuestionTypes/QuestionReview';
import QuestionPreview from './QuestionTypes/QuestionPreview';

interface QuestionDisplayProps {
  question: Question;
  userAnswer?: any;
  showCorrectAnswers?: boolean;
  isReview?: boolean;
  isPendingGrading?: boolean;
  feedback?: string;
  manualScore?: number;
  gradingStatus?: 'pending' | 'completed';
  onSaveGrade?: (score: number, feedback: string) => void;
  isTeacher?: boolean;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  userAnswer,
  showCorrectAnswers = false,
  isReview = false,
  isPendingGrading = false,
  feedback,
  manualScore,
  gradingStatus,
  onSaveGrade,
  isTeacher = false
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

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple-choice': return 'Multiple Choice';
      case 'multiple-answer': return 'Multiple Answer';
      case 'fill-in-blank': return 'Fill in Blank';
      case 'long-answer': return 'Long Answer';
      case 'matching': return 'Matching';
      case 'ordering': return 'Ordering';
      default: return 'Multiple Choice';
    }
  };

  const TypeIcon = getQuestionTypeIcon(question.type);

  if (isReview) {
    return (
      <QuestionReview
        question={question}
        userAnswer={userAnswer}
        showCorrectAnswers={showCorrectAnswers}
        isPendingGrading={isPendingGrading}
        feedback={feedback}
        manualScore={manualScore}
        gradingStatus={gradingStatus}
        onSaveGrade={onSaveGrade}
        isTeacher={isTeacher}
      />
    );
  }

  return (
    <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors">
      <div className="flex items-center space-x-2 mb-2">
        <TypeIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {getQuestionTypeLabel(question.type)}
        </span>
        {question.category && (
          <>
            <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{question.category}</span>
          </>
        )}
        {question.difficulty && (
          <>
            <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{question.difficulty}</span>
          </>
        )}
      </div>
      
      <QuestionPreview 
        question={question}
        showCorrectAnswers={showCorrectAnswers}
      />
    </div>
  );
};

export default QuestionDisplay;