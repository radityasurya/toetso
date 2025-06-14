import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Search, Check, X, ChevronUp, ChevronDown, HelpCircle, Home, ChevronRight } from 'lucide-react';
import { Quiz, Question } from '../../types';
import { categories, mockQuestions, mockQuizzes } from '../../data/mockData';
import LoadingSpinner from '../Common/LoadingSpinner';

const QuizForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [isLoading, setIsLoading] = useState(isEditing);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    questions: [] as string[],
    timeLimit: 15,
    passingScore: 70,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    isActive: true,
  });

  const [showQuestionSelector, setShowQuestionSelector] = useState(true);
  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
  const [questionSearch, setQuestionSearch] = useState('');
  const [selectedQuestionCategory, setSelectedQuestionCategory] = useState('');

  // New question form state
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    category: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
  });

  useEffect(() => {
    if (isEditing && id) {
      setIsLoading(true);
      
      // Simulate loading delay for better UX
      setTimeout(() => {
        const existingQuiz = mockQuizzes.find(q => q.id === id);
        if (existingQuiz) {
          setFormData({
            title: existingQuiz.title,
            description: existingQuiz.description,
            category: existingQuiz.category,
            questions: [...existingQuiz.questions],
            timeLimit: existingQuiz.timeLimit,
            passingScore: existingQuiz.passingScore,
            difficulty: existingQuiz.difficulty,
            isActive: existingQuiz.isActive,
          });
        } else {
          navigate('/quizzes');
        }
        setIsLoading(false);
      }, 500);
    }
  }, [id, isEditing, navigate]);

  const availableQuestions = mockQuestions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(questionSearch.toLowerCase()) ||
                         question.category.toLowerCase().includes(questionSearch.toLowerCase());
    const matchesCategory = !selectedQuestionCategory || question.category === selectedQuestionCategory;
    const notAlreadySelected = !formData.questions.includes(question.id);
    
    return matchesSearch && matchesCategory && notAlreadySelected;
  });

  const selectedQuestions = mockQuestions.filter(question => 
    formData.questions.includes(question.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a quiz title');
      return;
    }
    
    if (!formData.category) {
      alert('Please select a category');
      return;
    }

    if (formData.questions.length === 0) {
      alert('Please add at least one question to the quiz');
      return;
    }

    if (formData.timeLimit < 1) {
      alert('Time limit must be at least 1 minute');
      return;
    }

    if (formData.passingScore < 1 || formData.passingScore > 100) {
      alert('Passing score must be between 1 and 100');
      return;
    }

    console.log('Saving quiz:', formData);
    navigate('/quizzes');
  };

  const handleCancel = () => {
    navigate('/quizzes');
  };

  const addQuestion = (questionId: string) => {
    setFormData({
      ...formData,
      questions: [...formData.questions, questionId]
    });
  };

  const removeQuestion = (questionId: string) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter(id => id !== questionId)
    });
  };

  const moveQuestion = (questionId: string, direction: 'up' | 'down') => {
    const currentIndex = formData.questions.indexOf(questionId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === formData.questions.length - 1)
    ) {
      return;
    }

    const newQuestions = [...formData.questions];
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Swap the questions
    [newQuestions[currentIndex], newQuestions[newIndex]] = 
    [newQuestions[newIndex], newQuestions[currentIndex]];
    
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleNewQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newQuestion.question.trim()) {
      alert('Please enter a question');
      return;
    }
    
    if (newQuestion.options.some(option => !option.trim())) {
      alert('Please fill in all answer options');
      return;
    }
    
    if (!newQuestion.category) {
      alert('Please select a category');
      return;
    }

    // Create new question (in real app, this would be saved to backend)
    const questionId = Date.now().toString();
    const createdQuestion: Question = {
      id: questionId,
      question: newQuestion.question,
      options: newQuestion.options.filter(opt => opt.trim()),
      correctAnswer: newQuestion.correctAnswer,
      explanation: newQuestion.explanation,
      category: newQuestion.category,
      difficulty: newQuestion.difficulty,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add to mock data (in real app, this would be handled by backend)
    mockQuestions.push(createdQuestion);

    // Add to current quiz
    setFormData({
      ...formData,
      questions: [...formData.questions, questionId]
    });

    // Reset form
    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      category: formData.category, // Pre-fill with quiz category
      difficulty: 'medium',
    });

    setShowNewQuestionForm(false);
    alert('Question created and added to quiz!');
  };

  const handleNewQuestionOptionChange = (index: number, value: string) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  const addNewQuestionOption = () => {
    if (newQuestion.options.length < 6) {
      setNewQuestion({ 
        ...newQuestion, 
        options: [...newQuestion.options, ''] 
      });
    }
  };

  const removeNewQuestionOption = (index: number) => {
    if (newQuestion.options.length > 2) {
      const newOptions = newQuestion.options.filter((_, i) => i !== index);
      setNewQuestion({ 
        ...newQuestion, 
        options: newOptions,
        correctAnswer: newQuestion.correctAnswer >= newOptions.length ? 0 : newQuestion.correctAnswer
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isEditing ? 'Edit Quiz' : 'Create New Quiz'}
              </h2>
            </div>
          </div>
          <div className="p-6">
            <LoadingSpinner size="lg" text="Loading quiz data..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Back to quizzes"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {isEditing ? 'Edit Quiz' : 'Create New Quiz'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Configure quiz settings and select questions
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                  placeholder="Enter quiz title..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                  placeholder="Describe what this quiz covers..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Limit (minutes) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) || 15 })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Passing Score (%) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.passingScore}
                    onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) || 70 })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Make this quiz active immediately
                </label>
              </div>
            </div>

            {/* Right Column - Questions */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Questions ({formData.questions.length})
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowNewQuestionForm(!showNewQuestionForm)}
                      className="flex items-center space-x-2 px-3 py-1 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-green-400 dark:hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 rounded-lg transition-colors text-sm"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Create New</span>
                    </button>
                  </div>
                </div>

                {/* New Question Form */}
                {showNewQuestionForm && (
                  <div className="mb-6 p-4 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-900/20 transition-colors">
                    <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-4">Create New Question</h4>
                    <form onSubmit={handleNewQuestionSubmit} className="space-y-4">
                      <div>
                        <input
                          type="text"
                          value={newQuestion.question}
                          onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                          placeholder="Enter question text..."
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                          required
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

                      <div className="space-y-2">
                        {newQuestion.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="newQuestionCorrect"
                              checked={newQuestion.correctAnswer === index}
                              onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: index })}
                              className="w-3 h-3 text-green-600 focus:ring-green-500"
                            />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-4">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleNewQuestionOptionChange(index, e.target.value)}
                              placeholder={`Option ${String.fromCharCode(65 + index)}`}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                              required
                            />
                            {newQuestion.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeNewQuestionOption(index)}
                                className="p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                        {newQuestion.options.length < 6 && (
                          <button
                            type="button"
                            onClick={addNewQuestionOption}
                            className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                          >
                            + Add Option
                          </button>
                        )}
                      </div>

                      <div>
                        <textarea
                          value={newQuestion.explanation}
                          onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                          placeholder="Explanation (optional)..."
                          rows={2}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        />
                      </div>

                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                        >
                          <Check className="w-3 h-3" />
                          <span>Create & Add</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewQuestionForm(false)}
                          className="px-3 py-1 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Question Selector */}
                {showQuestionSelector && (
                  <div className="mb-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 transition-colors">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search questions..."
                          value={questionSearch}
                          onChange={(e) => setQuestionSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        />
                      </div>
                      <select
                        value={selectedQuestionCategory}
                        onChange={(e) => setSelectedQuestionCategory(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                      >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {availableQuestions.map(question => (
                        <div 
                          key={question.id} 
                          onClick={() => addQuestion(question.id)}
                          className="flex items-start justify-between p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{question.question}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{question.category} • {question.difficulty}</p>
                          </div>
                          <div className="ml-2 p-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                            <Plus className="w-4 h-4" />
                          </div>
                        </div>
                      ))}
                      {availableQuestions.length === 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No questions available</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Selected Questions */}
                <div className="space-y-3">
                  {selectedQuestions.map((question, index) => (
                    <div key={question.id} className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors">
                      <div className="flex flex-col space-y-1">
                        <button
                          type="button"
                          onClick={() => moveQuestion(question.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveQuestion(question.id, 'down')}
                          disabled={index === selectedQuestions.length - 1}
                          className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Q{index + 1}</span>
                          <span className="text-xs text-blue-600 dark:text-blue-400">{question.category}</span>
                          <span className="text-xs text-blue-600 dark:text-blue-400">•</span>
                          <span className="text-xs text-blue-600 dark:text-blue-400">{question.difficulty}</span>
                        </div>
                        <p className="text-sm text-gray-900 dark:text-white">{question.question}</p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => removeQuestion(question.id)}
                        className="p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {formData.questions.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p className="text-sm">No questions added yet</p>
                      <p className="text-xs">Click on questions above or create new ones to get started</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {isEditing ? 'Update Quiz' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizForm;