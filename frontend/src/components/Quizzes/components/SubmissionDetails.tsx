import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import SubmissionHeader from '../../Common/QuizComponents/SubmissionHeader';
import QuestionDisplay from '../../Common/QuizComponents/QuestionDisplay';
import FeedbackInput from '../../Common/QuizComponents/FeedbackInput';
import GradingInterface from '../../Common/QuizComponents/GradingInterface';

interface SubmissionDetailsProps {
  submission: any;
  questions: any[];
  onSaveGrade: (questionIndex: number, score: number, feedback: string) => void;
  onSaveGeneralFeedback: (feedback: string) => void;
  isSavingGrade: boolean;
  isSavingFeedback: boolean;
  saveSuccess: boolean;
}

const SubmissionDetails: React.FC<SubmissionDetailsProps> = ({
  submission,
  questions,
  onSaveGrade,
  onSaveGeneralFeedback,
  isSavingGrade,
  isSavingFeedback,
  saveSuccess
}) => {
  const [gradingQuestionIndex, setGradingQuestionIndex] = useState<number | null>(null);

  const handleGradeQuestion = (index: number) => {
    setGradingQuestionIndex(index);
  };

  // Check if submission or submission.answers is undefined
  if (!submission || !submission.answers) {
    return (
      <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-center">
        <p className="text-yellow-800 dark:text-yellow-300 font-medium">No submission data available</p>
        <p className="text-yellow-700 dark:text-yellow-400 text-sm mt-2">Please select a valid submission to view details</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Submission Header */}
      <SubmissionHeader 
        studentName={submission.studentName}
        studentEmail={submission.studentEmail}
        submittedAt={submission.submittedAt}
        timeSpent={submission.timeSpent}
        score={submission.status === 'needs_grading' || submission.status === 'partially_graded' ? null : submission.score}
        status={submission.status}
        saveSuccess={saveSuccess}
      />

      {/* Grading Interface or Question Review */}
      {gradingQuestionIndex !== null ? (
        <GradingInterface 
          questionId={questions[gradingQuestionIndex].id}
          questionText={questions[gradingQuestionIndex].question}
          studentAnswer={submission.answers[gradingQuestionIndex]}
          gradingCriteria={questions[gradingQuestionIndex].gradingCriteria}
          maxScore={questions[gradingQuestionIndex].maxScore || 5}
          currentScore={submission.manualScores?.[gradingQuestionIndex]}
          currentFeedback={submission.feedback?.[gradingQuestionIndex]}
          onSaveGrade={(score, feedback) => {
            onSaveGrade(gradingQuestionIndex, score, feedback);
            setGradingQuestionIndex(null);
          }}
          isSaving={isSavingGrade}
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Question Responses</h3>
          </div>
          
          <div className="p-6 space-y-8">
            {questions.map((question, index) => {
              // Make sure we have a valid question and answer
              if (!question) return null;
              
              const userAnswer = submission.answers[index];
              const isPendingGrading = question.type === 'long-answer' && 
                                      (!submission.manualScores || 
                                       submission.manualScores[index] === undefined);
              
              return (
                <div key={question.id} className="space-y-4">
                  <QuestionDisplay 
                    question={question}
                    userAnswer={userAnswer}
                    showCorrectAnswers={true}
                    isReview={true}
                    isPendingGrading={isPendingGrading}
                    feedback={submission.feedback?.[index]}
                    manualScore={submission.manualScores?.[index]}
                    gradingStatus={isPendingGrading ? 'pending' : 'completed'}
                    onSaveGrade={(score, feedback) => onSaveGrade(index, score, feedback)}
                    isTeacher={true}
                  />
                  
                  {/* Grade button for long answer questions */}
                  {question.type === 'long-answer' && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleGradeQuestion(index)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          isPendingGrading
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {isPendingGrading ? (
                          <>
                            <Clock className="w-4 h-4" />
                            <span>Grade Question</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4" />
                            <span>Review Grading</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* General Feedback Section */}
      {!gradingQuestionIndex && (
        <FeedbackInput 
          initialFeedback={submission.generalFeedback || ''}
          onSaveFeedback={onSaveGeneralFeedback}
          isSaving={isSavingFeedback}
          placeholder="Add general feedback for the student..."
        />
      )}
      
      {/* Back to Submissions Button (when grading) */}
      {gradingQuestionIndex !== null && (
        <div className="flex justify-between">
          <button
            onClick={() => setGradingQuestionIndex(null)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Back to Submission
          </button>
        </div>
      )}
    </div>
  );
};

export default SubmissionDetails;