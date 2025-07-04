import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, HelpCircle } from 'lucide-react';
import { Quiz, Question } from '../../types';
import { categories, mockQuestions, mockQuizzes } from '../../data/mockData';
import LoadingSpinner from '../Common/LoadingSpinner';
import Editor from 'react-simple-wysiwyg';

// Import components
import SelectedQuestionList from './components/SelectedQuestionList';
import AvailableQuestionList from './components/AvailableQuestionList';
import NewQuestionForm from './components/NewQuestionForm';

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
  const [selectedQuestionType, setSelectedQuestionType] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

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
          
          // Load selected questions
          const quizQuestions = mockQuestions.filter(q => existingQuiz.questions.includes(q.id));
          setSelectedQuestions(quizQuestions);
        } else {
          navigate('/quizzes');
        }
        setIsLoading(false);
      }, 500);
    }
  }, [id, isEditing, navigate]);

  // Filter available questions (not already selected)
  const availableQuestions = mockQuestions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(questionSearch.toLowerCase()) ||
                         question.category.toLowerCase().includes(questionSearch.toLowerCase());
    const matchesCategory = !selectedQuestionCategory || question.category === selectedQuestionCategory;
    const matchesType = !selectedQuestionType || question.type === selectedQuestionType;
    const notAlreadySelected = !formData.questions.includes(question.id);
    
    return matchesSearch && matchesCategory && matchesType && notAlreadySelected;
  });

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
    const question = mockQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    setFormData({
      ...formData,
      questions: [...formData.questions, questionId]
    });
    
    setSelectedQuestions([...selectedQuestions, question]);
  };

  const removeQuestion = (questionId: string) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter(id => id !== questionId)
    });
    
    setSelectedQuestions(selectedQuestions.filter(q => q.id !== questionId));
  };

  const reorderQuestions = (newOrder: Question[]) => {
    setSelectedQuestions(newOrder);
    setFormData({
      ...formData,
      questions: newOrder.map(q => q.id)
    });
  };

  const moveQuestion = (questionId: string, direction: 'up' | 'down') => {
    const currentIndex = selectedQuestions.findIndex(q => q.id === questionId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === selectedQuestions.length - 1) ||
      currentIndex === -1
    ) {
      return;
    }

    const newQuestions = [...selectedQuestions];
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Swap the questions
    [newQuestions[currentIndex], newQuestions[newIndex]] = 
    [newQuestions[newIndex], newQuestions[currentIndex]];
    
    reorderQuestions(newQuestions);
  };

  const handleCreateQuestion = (newQuestionData: Partial<Question>) => {
    // Create new question (in real app, this would be saved to backend)
    const questionId = Date.now().toString();
    const createdQuestion: Question = {
      id: questionId,
      question: newQuestionData.question || '',
      type: newQuestionData.type || 'multiple-choice',
      options: newQuestionData.type !== 'fill-in-blank' ? newQuestionData.options?.filter(opt => opt.trim()) : undefined,
      correctAnswer: newQuestionData.type === 'multiple-choice' ? newQuestionData.correctAnswer : undefined,
      correctAnswers: newQuestionData.type === 'multiple-answer' ? newQuestionData.correctAnswers : undefined,
      correctText: newQuestionData.type === 'fill-in-blank' ? newQuestionData.correctText : undefined,
      matchingPairs: newQuestionData.type === 'matching' ? newQuestionData.matchingPairs : undefined,
      correctOrder: newQuestionData.type === 'ordering' ? newQuestionData.correctOrder : undefined,
      explanation: newQuestionData.explanation || '',
      category: newQuestionData.category || '',
      difficulty: newQuestionData.difficulty || 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      requiresManualGrading: newQuestionData.type === 'long-answer',
      gradingCriteria: newQuestionData.type === 'long-answer' ? newQuestionData.gradingCriteria : undefined,
      maxScore: newQuestionData.type === 'long-answer' ? newQuestionData.maxScore : undefined,
    };

    // Add to mock data (in real app, this would be handled by backend)
    mockQuestions.push(createdQuestion);

    // Add to current quiz
    setFormData({
      ...formData,
      questions: [...formData.questions, questionId]
    });
    
    setSelectedQuestions([...selectedQuestions, createdQuestion]);

    // Reset form
    setShowNewQuestionForm(false);
  };

  const handleDescriptionChange = (e: any) => {
    setFormData({ ...formData, description: e.target.value });
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
                <Editor
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  containerProps={{
                    className: "w-full min-h-[100px] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                  }}
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
                  <div className="mb-6">
                    <NewQuestionForm 
                      onCreateQuestion={handleCreateQuestion}
                      onCancel={() => setShowNewQuestionForm(false)}
                      defaultCategory={formData.category}
                    />
                  </div>
                )}

                {/* Question Selector */}
                {showQuestionSelector && (
                  <AvailableQuestionList
                    availableQuestions={availableQuestions}
                    onAddQuestion={addQuestion}
                    searchTerm={questionSearch}
                    onSearchChange={setQuestionSearch}
                    selectedCategory={selectedQuestionCategory}
                    onCategoryChange={setSelectedQuestionCategory}
                    selectedType={selectedQuestionType}
                    onTypeChange={setSelectedQuestionType}
                  />
                )}

                {/* Selected Questions */}
                <SelectedQuestionList
                  selectedQuestions={selectedQuestions}
                  onRemoveQuestion={removeQuestion}
                  onReorderQuestions={reorderQuestions}
                  onMoveQuestion={moveQuestion}
                />
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