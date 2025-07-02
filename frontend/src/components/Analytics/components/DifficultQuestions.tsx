import React from 'react';

interface Question {
  question: string;
  category: string;
  successRate: number;
  attempts: number;
}

interface DifficultQuestionsProps {
  questions: Question[];
}

const DifficultQuestions: React.FC<DifficultQuestionsProps> = ({ questions }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Most Challenging Questions</h3>
      <div className="space-y-4">
        {questions.map((question, index) => (
          <div key={index} className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg transition-colors">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">{question.question}</h4>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{question.category}</span>
              <div className="flex items-center space-x-4">
                <span className="text-red-600 dark:text-red-400 font-medium">{question.successRate}% success</span>
                <span className="text-gray-500 dark:text-gray-400">{question.attempts} attempts</span>
              </div>
            </div>
            <div className="w-full bg-red-200 dark:bg-red-800 rounded-full h-2 mt-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${question.successRate}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DifficultQuestions;