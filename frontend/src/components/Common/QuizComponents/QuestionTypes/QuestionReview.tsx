import React, { useState } from 'react';
import { 
  List, 
  CheckSquare, 
  Type, 
  AlignLeft, 
  MoveHorizontal, 
  ArrowUpDown,
  CheckCircle,
  XCircle,
  Clock,
  Save
} from 'lucide-react';
import { Question } from '../../../../types';

interface QuestionReviewProps {
  question: Question;
  userAnswer?: any;
  showCorrectAnswers?: boolean;
  isPendingGrading?: boolean;
  feedback?: string;
  manualScore?: number;
  gradingStatus?: 'pending' | 'completed';
  onSaveGrade?: (score: number, feedback: string) => void;
  isTeacher?: boolean;
}

const QuestionReview: React.FC<QuestionReviewProps> = ({
  question,
  userAnswer,
  showCorrectAnswers = true,
  isPendingGrading = false,
  feedback,
  manualScore,
  gradingStatus = 'completed',
  onSaveGrade,
  isTeacher = false
}) => {
  const [isGrading, setIsGrading] = useState(false);
  const [editScore, setEditScore] = useState(manualScore || 0);
  const [editFeedback, setEditFeedback] = useState(feedback || '');
  const [isSaving, setIsSaving] = useState(false);

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

  const isAnswerCorrect = () => {
    if (!userAnswer || !showCorrectAnswers) return null;
    
    if (question.type === 'multiple-choice') {
      return userAnswer === question.correctAnswer;
    } else if (question.type === 'multiple-answer') {
      const userAnswerArray = userAnswer as number[] || [];
      const correctAnswerArray = question.correctAnswers || [];
      
      return userAnswerArray.length === correctAnswerArray.length && 
             userAnswerArray.every(val => correctAnswerArray.includes(val));
    } else if (question.type === 'fill-in-blank') {
      const userText = (userAnswer as string || '').trim().toLowerCase();
      const correctText = (question.correctText || '').trim().toLowerCase();
      
      return userText === correctText;
    } else if (question.type === 'matching') {
      const userMatches = userAnswer as { [key: string]: string } || {};
      const correctMatches = question.matchingPairs || [];
      
      return correctMatches.every(pair => userMatches[pair.left] === pair.right) &&
             Object.keys(userMatches).length === correctMatches.length;
    } else if (question.type === 'ordering') {
      const userOrder = userAnswer as string[] || [];
      const correctOrder = question.correctOrder || [];
      
      return userOrder.length === correctOrder.length && 
             userOrder.every((val, i) => val === correctOrder[i]);
    } else if (question.type === 'long-answer') {
      // Long answer questions require manual grading
      return null; // Return null to indicate it can't be automatically determined
    }
    return false;
  };

  const handleSaveGrade = () => {
    if (!onSaveGrade) return;
    
    setIsSaving(true);
    
    // Call the parent component's save function
    onSaveGrade(editScore, editFeedback);
    
    // Reset state after saving
    setTimeout(() => {
      setIsSaving(false);
      setIsGrading(false);
    }, 500);
  };

  const TypeIcon = getQuestionTypeIcon(question.type);
  const isCorrect = isAnswerCorrect();

  return (
    <div className={`p-6 rounded-lg border ${
      isPendingGrading 
        ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
        : isCorrect !== null
          ? isCorrect 
            ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex items-start space-x-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isPendingGrading
            ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
            : isCorrect 
            ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
            : isCorrect === false
            ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
        }`}>
          {isPendingGrading ? <Clock className="w-5 h-5" /> : isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <TypeIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {question.type === 'multiple-choice' ? 'Multiple Choice' :
               question.type === 'multiple-answer' ? 'Multiple Answer' :
               question.type === 'fill-in-blank' ? 'Fill in Blank' :
               question.type === 'long-answer' ? 'Long Answer' :
               question.type === 'matching' ? 'Matching' :
               'Ordering'}
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
          
          <div 
            className="text-lg font-medium text-gray-900 dark:text-white mb-4"
            dangerouslySetInnerHTML={{ __html: question.question }}
          />
          
          {/* Render different answer types */}
          {question.type === 'multiple-choice' && <MultipleChoiceReview 
            options={question.options || []} 
            userAnswer={userAnswer as number} 
            correctAnswer={question.correctAnswer} 
            showCorrectAnswers={showCorrectAnswers} 
          />}
          
          {question.type === 'multiple-answer' && <MultipleAnswerReview 
            options={question.options || []} 
            userAnswer={userAnswer as number[]} 
            correctAnswers={question.correctAnswers} 
            showCorrectAnswers={showCorrectAnswers} 
          />}
          
          {question.type === 'fill-in-blank' && <FillInBlankReview 
            userAnswer={userAnswer as string} 
            correctText={question.correctText} 
            showCorrectAnswers={showCorrectAnswers} 
          />}
          
          {question.type === 'long-answer' && (
            <div className="space-y-4">
              <LongAnswerReview 
                userAnswer={userAnswer as string}
                gradingCriteria={question.gradingCriteria}
                maxScore={question.maxScore}
                feedback={feedback}
                manualScore={manualScore}
                gradingStatus={gradingStatus}
                isPendingGrading={isPendingGrading}
              />
              
              {/* Inline Grading Interface for Long Answer */}
              {isTeacher && question.type === 'long-answer' && (
                <div>
                  {!isGrading ? (
                    <div className="flex justify-end">
                      <button
                        onClick={() => setIsGrading(true)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          isPendingGrading
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {isPendingGrading ? (
                          <>
                            <Clock className="w-4 h-4" />
                            <span>Grade Answer</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4" />
                            <span>Edit Grading</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Grade Response</h4>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Score:</h5>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Maximum: {question.maxScore || 5} points</span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          max={question.maxScore || 5}
                          value={editScore}
                          onChange={(e) => setEditScore(parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Feedback for Student:</h5>
                        <textarea
                          value={editFeedback}
                          onChange={(e) => setEditFeedback(e.target.value)}
                          rows={4}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-gray-600"
                          placeholder="Provide constructive feedback to the student..."
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setIsGrading(false)}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveGrade}
                          disabled={isSaving}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isSaving ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span>Save Grade</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {question.type === 'matching' && <MatchingReview 
            pairs={question.matchingPairs || []}
            userAnswer={userAnswer as { [key: string]: string }}
            showCorrectAnswers={showCorrectAnswers}
          />}
          
          {question.type === 'ordering' && <OrderingReview 
            userAnswer={userAnswer as string[]}
            correctOrder={question.correctOrder || []}
            showCorrectAnswers={showCorrectAnswers}
          />}
          
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
      </div>
    </div>
  );
};

// Sub-components for different question types
const MultipleChoiceReview: React.FC<{ 
  options: string[]; 
  userAnswer?: number; 
  correctAnswer?: number; 
  showCorrectAnswers: boolean; 
}> = ({ 
  options, 
  userAnswer, 
  correctAnswer, 
  showCorrectAnswers 
}) => {
  return (
    <div className="space-y-2 mb-4">
      {options.map((option, optionIndex) => {
        const isUserSelected = userAnswer === optionIndex;
        const isCorrectOption = optionIndex === correctAnswer;
        
        return (
          <div key={optionIndex} className={`p-3 rounded-lg border ${
            showCorrectAnswers
              ? isUserSelected && isCorrectOption
                ? 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                : isUserSelected && !isCorrectOption
                ? 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                : !isUserSelected && isCorrectOption
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
              : isUserSelected
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
              : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {String.fromCharCode(65 + optionIndex)}.
                </span>
                <span 
                  className="text-gray-900 dark:text-white"
                  dangerouslySetInnerHTML={{ __html: option }}
                />
              </div>
              <div className="flex items-center space-x-2">
                {showCorrectAnswers && (
                  <>
                    {isUserSelected && isCorrectOption && (
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">Your answer ✓</span>
                    )}
                    {isUserSelected && !isCorrectOption && (
                      <span className="text-xs text-red-600 dark:text-red-400 font-medium">Your answer ✗</span>
                    )}
                    {!isUserSelected && isCorrectOption && (
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Correct answer</span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MultipleAnswerReview: React.FC<{
  options: string[];
  userAnswer?: number[];
  correctAnswers?: number[];
  showCorrectAnswers: boolean;
}> = ({ 
  options, 
  userAnswer = [], 
  correctAnswers = [], 
  showCorrectAnswers 
}) => {
  return (
    <div className="space-y-2 mb-4">
      {options.map((option, optionIndex) => {
        const isUserSelected = userAnswer.includes(optionIndex);
        const isCorrectOption = correctAnswers.includes(optionIndex);
        
        return (
          <div key={optionIndex} className={`p-3 rounded-lg border ${
            showCorrectAnswers
              ? isUserSelected && isCorrectOption
                ? 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                : isUserSelected && !isCorrectOption
                ? 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                : !isUserSelected && isCorrectOption
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
              : isUserSelected
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
              : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {String.fromCharCode(65 + optionIndex)}.
                </span>
                <span 
                  className="text-gray-900 dark:text-white"
                  dangerouslySetInnerHTML={{ __html: option }}
                />
              </div>
              <div className="flex items-center space-x-2">
                {showCorrectAnswers && (
                  <>
                    {isUserSelected && isCorrectOption && (
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">Your answer ✓</span>
                    )}
                    {isUserSelected && !isCorrectOption && (
                      <span className="text-xs text-red-600 dark:text-red-400 font-medium">Your answer ✗</span>
                    )}
                    {!isUserSelected && isCorrectOption && (
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Correct answer</span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const FillInBlankReview: React.FC<{
  userAnswer?: string;
  correctText?: string;
  showCorrectAnswers: boolean;
}> = ({ 
  userAnswer, 
  correctText, 
  showCorrectAnswers 
}) => {
  const isCorrect = userAnswer?.trim().toLowerCase() === correctText?.trim().toLowerCase();
  
  return (
    <div className="space-y-3 mb-4">
      <div className={`p-3 rounded-lg border ${
        showCorrectAnswers
          ? isCorrect
            ? 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700'
            : 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700'
          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
      }`}>
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700 dark:text-gray-300">Your answer:</span>
          <span className={`font-medium ${
            showCorrectAnswers
              ? isCorrect 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
              : 'text-gray-900 dark:text-white'
          }`}>
            {userAnswer || '(No answer)'}
          </span>
        </div>
      </div>
      
      {showCorrectAnswers && !isCorrect && (
        <div className="p-3 rounded-lg border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700 dark:text-gray-300">Correct answer:</span>
            <span className="font-medium text-blue-600 dark:text-blue-400">{correctText}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const LongAnswerReview: React.FC<{
  userAnswer?: string;
  gradingCriteria?: string;
  maxScore?: number;
  feedback?: string;
  manualScore?: number;
  gradingStatus?: 'pending' | 'completed';
  isPendingGrading?: boolean;
}> = ({ 
  userAnswer, 
  gradingCriteria, 
  maxScore = 5, 
  feedback, 
  manualScore, 
  gradingStatus = 'pending',
  isPendingGrading = false
}) => {
  return (
    <div className="space-y-3 mb-4">
      <div className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Student's answer:</h5>
        <div 
          className="text-gray-600 dark:text-gray-400"
          dangerouslySetInnerHTML={{ __html: userAnswer || '(No answer provided)' }}
        />
      </div>
      
      {/* Grading Status */}
      {(gradingStatus === 'completed' || feedback) && (
        <div className={`p-3 rounded-lg border ${
          gradingStatus === 'completed' && feedback
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {gradingStatus === 'completed' && feedback ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            )}
            <h5 className={`text-sm font-medium ${
              gradingStatus === 'completed' && feedback
                ? 'text-green-700 dark:text-green-300'
                : 'text-blue-700 dark:text-blue-300'
            }`}>
              {gradingStatus === 'completed' && feedback
                ? 'Graded'
                : 'Awaiting Grading'}
            </h5>
          </div>
          
          {gradingStatus === 'completed' && feedback && (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Score:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {manualScore}/{maxScore}
                </span>
              </div>
              <div>
                <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Feedback:</h6>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feedback}
                </p>
              </div>
            </>
          )}
        </div>
      )}
      
      {/* Grading Criteria */}
      <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grading Criteria:</h5>
        <div 
          className="text-sm text-gray-600 dark:text-gray-400"
          dangerouslySetInnerHTML={{ __html: gradingCriteria || 'No specific grading criteria provided.' }}
        />
      </div>
    </div>
  );
};

const MatchingReview: React.FC<{
  pairs: { left: string; right: string }[];
  userAnswer?: { [key: string]: string };
  showCorrectAnswers: boolean;
}> = ({ 
  pairs, 
  userAnswer = {}, 
  showCorrectAnswers 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {pairs.map((pair, pairIndex) => {
        const userMatchedRight = userAnswer[pair.left];
        const isCorrectMatch = userMatchedRight === pair.right;
        
        return (
          <div key={pairIndex} className={`p-3 rounded-lg border ${
            showCorrectAnswers
              ? userMatchedRight
                ? isCorrectMatch
                  ? 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                  : 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
              : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {pair.left}
              </span>
              <MoveHorizontal className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Your match:
              </span>
              <span className={`text-sm font-medium ${
                showCorrectAnswers
                  ? userMatchedRight
                    ? isCorrectMatch
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                    : 'text-gray-500 dark:text-gray-400'
                  : 'text-gray-900 dark:text-white'
              }`}>
                {userMatchedRight || '(None)'}
              </span>
            </div>
            {showCorrectAnswers && !isCorrectMatch && (
              <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-200 dark:border-gray-600">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Correct match:
                </span>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {pair.right}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const OrderingReview: React.FC<{
  userAnswer?: string[];
  correctOrder?: string[];
  showCorrectAnswers: boolean;
}> = ({ 
  userAnswer = [], 
  correctOrder = [], 
  showCorrectAnswers 
}) => {
  const isCorrect = userAnswer.length === correctOrder.length && 
                   userAnswer.every((val, i) => val === correctOrder[i]);
  
  return (
    <div className="space-y-3 mb-4">
      <div className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your order:</h5>
        <div className="space-y-2">
          {userAnswer.map((item, itemIndex) => (
            <div key={itemIndex} className={`p-2 rounded-lg ${
              showCorrectAnswers
                ? item === correctOrder?.[itemIndex]
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                : 'bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
            }`}>
              <div className="flex items-center space-x-3">
                <span className="font-medium">{itemIndex + 1}.</span>
                <span>{item}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {showCorrectAnswers && !isCorrect && (
        <div className="p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <h5 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">Correct order:</h5>
          <div className="space-y-2">
            {correctOrder.map((item, itemIndex) => (
              <div key={itemIndex} className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-900">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-blue-700 dark:text-blue-300">{itemIndex + 1}.</span>
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionReview;