import React, { useState } from 'react';
import { Check, X, List, CheckSquare, Type, AlignLeft, MoveHorizontal, ArrowUpDown } from 'lucide-react';
import { Question } from '../../../types';
import { categories } from '../../../data/mockData';
import Editor from 'react-simple-wysiwyg';

// Import question type components
import MultipleChoiceCreator from './QuestionCreators/MultipleChoiceCreator';
import MultipleAnswerCreator from './QuestionCreators/MultipleAnswerCreator';
import FillInBlankCreator from './QuestionCreators/FillInBlankCreator';
import LongAnswerCreator from './QuestionCreators/LongAnswerCreator';
import MatchingCreator from './QuestionCreators/MatchingCreator';
import OrderingCreator from './QuestionCreators/OrderingCreator';

interface NewQuestionFormProps {
  onCreateQuestion: (question: Partial<Question>) => void;
  onCancel: () => void;
  defaultCategory?: string;
}

const NewQuestionForm: React.FC<NewQuestionFormProps> = ({
  onCreateQuestion,
  onCancel,
  defaultCategory = ''
}) => {
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    type: 'multiple-choice' as 'multiple-choice' | 'multiple-answer' | 'fill-in-blank' | 'long-answer' | 'matching' | 'ordering',
    options: ['', '', '', ''],
    correctAnswer: 0,
    correctAnswers: [] as number[],
    correctText: '',
    matchingPairs: [{ left: '', right: '' }],
    correctOrder: [''],
    explanation: '',
    category: defaultCategory,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    requiresManualGrading: false,
    gradingCriteria: '',
    maxScore: 5,
  });

  const handleNewQuestionTypeChange = (type: 'multiple-choice' | 'multiple-answer' | 'fill-in-blank' | 'long-answer' | 'matching' | 'ordering') => {
    setNewQuestion({
      ...newQuestion,
      type,
      // Reset type-specific fields
      correctAnswer: 0,
      correctAnswers: [],
      correctText: '',
      // Keep options for multiple choice types, clear for others
      options: (type === 'multiple-choice' || type === 'multiple-answer') ? newQuestion.options : [],
      // Initialize type-specific fields
      matchingPairs: type === 'matching' ? [{ left: '', right: '' }] : [],
      correctOrder: type === 'ordering' ? [''] : [],
      requiresManualGrading: type === 'long-answer',
      gradingCriteria: type === 'long-answer' ? newQuestion.gradingCriteria : '',
      maxScore: type === 'long-answer' ? newQuestion.maxScore : 5,
    });
  };

  const handleRichTextChange = (e: any) => {
    setNewQuestion({ ...newQuestion, question: e.target.value });
  };

  const handleExplanationChange = (e: any) => {
    setNewQuestion({ ...newQuestion, explanation: e.target.value });
  };

  const handleNewQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newQuestion.question.trim()) {
      alert('Please enter a question');
      return;
    }
    
    if (newQuestion.type === 'multiple-choice' || newQuestion.type === 'multiple-answer') {
      if (newQuestion.options.some(option => !option.trim())) {
        alert('Please fill in all answer options');
        return;
      }
      
      if (newQuestion.type === 'multiple-answer' && newQuestion.correctAnswers.length === 0) {
        alert('Please select at least one correct answer');
        return;
      }
    } else if (newQuestion.type === 'fill-in-blank') {
      if (!newQuestion.correctText.trim()) {
        alert('Please enter the correct answer for the fill-in-the-blank question');
        return;
      }
    } else if (newQuestion.type === 'matching') {
      const validPairs = newQuestion.matchingPairs.filter(pair => pair.left.trim() && pair.right.trim());
      if (validPairs.length < 2) {
        alert('Please provide at least 2 matching pairs');
        return;
      }
    } else if (newQuestion.type === 'ordering') {
      const validItems = newQuestion.correctOrder.filter(item => item.trim());
      if (validItems.length < 2) {
        alert('Please provide at least 2 items to order');
        return;
      }
    } else if (newQuestion.type === 'long-answer') {
      if (!newQuestion.gradingCriteria.trim()) {
        alert('Please provide grading criteria for the long answer question');
        return;
      }
    }
    
    if (!newQuestion.category) {
      alert('Please select a category');
      return;
    }

    onCreateQuestion(newQuestion);
  };

  return (
    <div className="mb-6 p-4 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-900/20 transition-colors">
      <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-4">Create New Question</h4>
      <div className="space-y-4">
        {/* Question Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { type: 'multiple-choice', label: 'Single Answer', icon: List },
            { type: 'multiple-answer', label: 'Multiple Answers', icon: CheckSquare },
            { type: 'fill-in-blank', label: 'Fill in Blank', icon: Type },
            { type: 'long-answer', label: 'Long Answer', icon: AlignLeft },
            { type: 'matching', label: 'Matching', icon: MoveHorizontal },
            { type: 'ordering', label: 'Ordering', icon: ArrowUpDown },
          ].map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => handleNewQuestionTypeChange(type as any)}
              className={`p-2 border rounded-lg transition-colors text-center text-xs ${
                newQuestion.type === type
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <Icon className="w-4 h-4 mx-auto mb-1" />
              {label}
            </button>
          ))}
        </div>

        <div>
          <Editor
            value={newQuestion.question}
            onChange={handleRichTextChange}
            containerProps={{
              className: "w-full min-h-[100px] border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            }}
            placeholder="Enter question text..."
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <select
            value={newQuestion.category}
            onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
            required
          >
            <option value="">Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          
          <select
            value={newQuestion.difficulty}
            onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Question Type Specific Components */}
        {newQuestion.type === 'multiple-choice' && (
          <MultipleChoiceCreator
            options={newQuestion.options}
            correctAnswer={newQuestion.correctAnswer}
            onOptionsChange={(options) => setNewQuestion({ ...newQuestion, options })}
            onCorrectAnswerChange={(correctAnswer) => setNewQuestion({ ...newQuestion, correctAnswer })}
          />
        )}

        {newQuestion.type === 'multiple-answer' && (
          <MultipleAnswerCreator
            options={newQuestion.options}
            correctAnswers={newQuestion.correctAnswers}
            onOptionsChange={(options) => setNewQuestion({ ...newQuestion, options })}
            onCorrectAnswersChange={(correctAnswers) => setNewQuestion({ ...newQuestion, correctAnswers })}
          />
        )}

        {newQuestion.type === 'fill-in-blank' && (
          <FillInBlankCreator
            correctText={newQuestion.correctText}
            onCorrectTextChange={(correctText) => setNewQuestion({ ...newQuestion, correctText })}
          />
        )}

        {newQuestion.type === 'long-answer' && (
          <LongAnswerCreator
            gradingCriteria={newQuestion.gradingCriteria}
            maxScore={newQuestion.maxScore}
            onGradingCriteriaChange={(gradingCriteria) => setNewQuestion({ ...newQuestion, gradingCriteria })}
            onMaxScoreChange={(maxScore) => setNewQuestion({ ...newQuestion, maxScore })}
          />
        )}

        {newQuestion.type === 'matching' && (
          <MatchingCreator
            matchingPairs={newQuestion.matchingPairs}
            onMatchingPairsChange={(matchingPairs) => setNewQuestion({ ...newQuestion, matchingPairs })}
          />
        )}

        {newQuestion.type === 'ordering' && (
          <OrderingCreator
            correctOrder={newQuestion.correctOrder}
            onCorrectOrderChange={(correctOrder) => setNewQuestion({ ...newQuestion, correctOrder })}
          />
        )}

        <div>
          <Editor
            value={newQuestion.explanation}
            onChange={handleExplanationChange}
            containerProps={{
              className: "w-full min-h-[80px] border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            }}
            placeholder="Explanation (optional)..."
          />
        </div>

        <div className="flex space-x-2">
          <button
            type="button"
            onClick={handleNewQuestionSubmit}
            className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
          >
            <Check className="w-3 h-3" />
            <span>Create & Add</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewQuestionForm;