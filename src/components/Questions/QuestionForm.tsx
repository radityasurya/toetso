import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  ImageIcon, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Type, 
  CheckSquare, 
  List, 
  AlignLeft, 
  MoveHorizontal, 
  GripVertical,
  X,
  ArrowUpDown
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Editor from 'react-simple-wysiwyg';
import { Question } from '../../types';
import { categories, mockQuestions } from '../../data/mockData';
import ImageUpload from '../Common/ImageUpload';
import LoadingSpinner from '../Common/LoadingSpinner';
import ConfirmationModal from '../Common/ConfirmationModal';

const QuestionForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const [isLoading, setIsLoading] = useState(isEditing);
  const [formData, setFormData] = useState({
    question: '',
    type: 'multiple-choice' as 'multiple-choice' | 'multiple-answer' | 'fill-in-blank' | 'long-answer' | 'matching' | 'ordering',
    options: ['', '', '', ''],
    optionImages: ['', '', '', ''], // Store image URLs for options
    correctAnswer: 0, // For single choice
    correctAnswers: [] as number[], // For multiple answers
    correctText: '', // For fill in the blank
    matchingPairs: [{ left: '', right: '' }], // For matching questions
    correctOrder: [''], // For ordering questions
    explanation: '',
    category: '',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    image: '',
    requiresManualGrading: false, // For long answer questions
    gradingCriteria: '', // For long answer questions
    maxScore: 5, // Default max score for long answer questions
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showQuestionImage, setShowQuestionImage] = useState(false);
  const [showOptionImages, setShowOptionImages] = useState<{ [key: number]: boolean }>({});
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; optionIndex: number }>({
    isOpen: false,
    optionIndex: -1
  });

  useEffect(() => {
    if (isEditing && id) {
      setIsLoading(true);
      
      // Simulate loading delay for better UX
      setTimeout(() => {
        const existingQuestion = mockQuestions.find(q => q.id === id);
        if (existingQuestion) {
          setFormData({
            question: existingQuestion.question,
            type: existingQuestion.type || 'multiple-choice',
            options: existingQuestion.options ? [...existingQuestion.options] : ['', '', '', ''],
            optionImages: new Array(existingQuestion.options?.length || 4).fill(''), // Initialize option images
            correctAnswer: existingQuestion.correctAnswer || 0,
            correctAnswers: existingQuestion.correctAnswers || [],
            correctText: existingQuestion.correctText || '',
            matchingPairs: existingQuestion.matchingPairs || [{ left: '', right: '' }],
            correctOrder: existingQuestion.correctOrder || [''],
            explanation: existingQuestion.explanation,
            category: existingQuestion.category,
            difficulty: existingQuestion.difficulty,
            image: existingQuestion.image || '',
            requiresManualGrading: existingQuestion.requiresManualGrading || false,
            gradingCriteria: existingQuestion.gradingCriteria || '',
            maxScore: existingQuestion.maxScore || 5,
          });
          
          // Show image sections if there are existing images
          if (existingQuestion.image) {
            setShowQuestionImage(true);
          }
        } else {
          navigate('/questions');
        }
        setIsLoading(false);
      }, 500);
    }
  }, [id, isEditing, navigate]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Question validation
    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    } else if (formData.question.trim().length < 10) {
      newErrors.question = 'Question must be at least 10 characters';
    }

    // Type-specific validation
    if (formData.type === 'multiple-choice' || formData.type === 'multiple-answer') {
      // Options validation
      const filledOptions = formData.options.filter(option => option.trim());
      if (filledOptions.length < 2) {
        newErrors.options = 'At least 2 answer options are required';
      }

      if (formData.type === 'multiple-choice') {
        // Check if correct answer is valid
        if (formData.correctAnswer >= filledOptions.length) {
          newErrors.correctAnswer = 'Please select a valid correct answer';
        }
      } else if (formData.type === 'multiple-answer') {
        // Check if at least one correct answer is selected
        if (formData.correctAnswers.length === 0) {
          newErrors.correctAnswers = 'Please select at least one correct answer';
        }
        // Check if all selected answers are valid
        if (formData.correctAnswers.some(index => index >= filledOptions.length)) {
          newErrors.correctAnswers = 'Please select valid correct answers';
        }
      }
    } else if (formData.type === 'fill-in-blank') {
      // Fill in the blank validation
      if (!formData.correctText.trim()) {
        newErrors.correctText = 'Correct answer is required for fill-in-the-blank questions';
      }
    } else if (formData.type === 'long-answer') {
      // Long answer validation
      if (formData.requiresManualGrading && !formData.gradingCriteria.trim()) {
        newErrors.gradingCriteria = 'Grading criteria is required for manually graded questions';
      }
      if (formData.maxScore <= 0) {
        newErrors.maxScore = 'Maximum score must be greater than 0';
      }
    } else if (formData.type === 'matching') {
      // Matching validation
      const validPairs = formData.matchingPairs.filter(pair => pair.left.trim() && pair.right.trim());
      if (validPairs.length < 2) {
        newErrors.matchingPairs = 'At least 2 matching pairs are required';
      }
    } else if (formData.type === 'ordering') {
      // Ordering validation
      const validItems = formData.correctOrder.filter(item => item.trim());
      if (validItems.length < 2) {
        newErrors.correctOrder = 'At least 2 items are required for ordering questions';
      }
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      let questionData: Partial<Question> = {
        question: formData.question,
        type: formData.type,
        explanation: formData.explanation,
        category: formData.category,
        difficulty: formData.difficulty,
        image: formData.image || undefined,
      };

      // Add type-specific data
      if (formData.type === 'multiple-choice') {
        questionData.options = formData.options.filter(option => option.trim());
        questionData.correctAnswer = formData.correctAnswer;
      } else if (formData.type === 'multiple-answer') {
        questionData.options = formData.options.filter(option => option.trim());
        questionData.correctAnswers = formData.correctAnswers;
      } else if (formData.type === 'fill-in-blank') {
        questionData.correctText = formData.correctText;
      } else if (formData.type === 'long-answer') {
        questionData.requiresManualGrading = formData.requiresManualGrading;
        questionData.gradingCriteria = formData.gradingCriteria;
        questionData.maxScore = formData.maxScore;
      } else if (formData.type === 'matching') {
        questionData.matchingPairs = formData.matchingPairs.filter(pair => pair.left.trim() && pair.right.trim());
      } else if (formData.type === 'ordering') {
        questionData.correctOrder = formData.correctOrder.filter(item => item.trim());
      }

      console.log('Saving question:', questionData);
      navigate('/questions');
    }
  };

  const handleCancel = () => {
    navigate('/questions');
  };

  const handleTypeChange = (newType: 'multiple-choice' | 'multiple-answer' | 'fill-in-blank' | 'long-answer' | 'matching' | 'ordering') => {
    setFormData(prev => ({
      ...prev,
      type: newType,
      // Reset type-specific fields
      correctAnswer: 0,
      correctAnswers: [],
      correctText: '',
      // Keep options for multiple choice types, clear for others
      options: (newType === 'multiple-choice' || newType === 'multiple-answer') ? prev.options : [],
      optionImages: (newType === 'multiple-choice' || newType === 'multiple-answer') ? prev.optionImages : [],
      // Initialize type-specific fields
      matchingPairs: newType === 'matching' ? [{ left: '', right: '' }] : [],
      correctOrder: newType === 'ordering' ? [''] : [],
      requiresManualGrading: newType === 'long-answer' ? true : false,
      gradingCriteria: newType === 'long-answer' ? prev.gradingCriteria : '',
      maxScore: newType === 'long-answer' ? prev.maxScore : 5,
    }));
    
    // Clear type-specific errors
    setErrors({});
  };

  // Memoize the option change handler to prevent infinite loops
  const handleOptionChange = useCallback((index: number, value: string) => {
    setFormData(prevFormData => {
      const newOptions = [...prevFormData.options];
      newOptions[index] = value;
      return { ...prevFormData, options: newOptions };
    });
    
    // Clear errors when user starts typing
    setErrors(prevErrors => {
      if (prevErrors.options) {
        return { ...prevErrors, options: '' };
      }
      return prevErrors;
    });
  }, []);

  const handleOptionImageChange = useCallback((index: number, imageUrl: string) => {
    setFormData(prevFormData => {
      const newOptionImages = [...prevFormData.optionImages];
      newOptionImages[index] = imageUrl;
      return { ...prevFormData, optionImages: newOptionImages };
    });
  }, []);

  const removeOptionImage = useCallback((index: number) => {
    setFormData(prevFormData => {
      const newOptionImages = [...prevFormData.optionImages];
      newOptionImages[index] = '';
      return { ...prevFormData, optionImages: newOptionImages };
    });
  }, []);

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData(prevFormData => ({ 
        ...prevFormData, 
        options: [...prevFormData.options, ''],
        optionImages: [...prevFormData.optionImages, '']
      }));
    }
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      setDeleteModal({ isOpen: true, optionIndex: index });
    }
  };

  const confirmRemoveOption = () => {
    const index = deleteModal.optionIndex;
    setFormData(prevFormData => {
      const newOptions = prevFormData.options.filter((_, i) => i !== index);
      const newOptionImages = prevFormData.optionImages.filter((_, i) => i !== index);
      
      // Update correct answers for multiple answer type
      let newCorrectAnswers = prevFormData.correctAnswers;
      if (prevFormData.type === 'multiple-answer') {
        newCorrectAnswers = prevFormData.correctAnswers
          .filter(answerIndex => answerIndex !== index)
          .map(answerIndex => answerIndex > index ? answerIndex - 1 : answerIndex);
      }
      
      return { 
        ...prevFormData, 
        options: newOptions,
        optionImages: newOptionImages,
        correctAnswer: prevFormData.correctAnswer >= newOptions.length ? 0 : prevFormData.correctAnswer,
        correctAnswers: newCorrectAnswers
      };
    });
    
    // Remove from showOptionImages state
    setShowOptionImages(prev => {
      const newState = { ...prev };
      delete newState[index];
      // Reindex remaining items
      const reindexed: { [key: number]: boolean } = {};
      Object.keys(newState).forEach(key => {
        const keyNum = parseInt(key);
        if (keyNum > index) {
          reindexed[keyNum - 1] = newState[keyNum];
        } else {
          reindexed[keyNum] = newState[keyNum];
        }
      });
      return reindexed;
    });

    setDeleteModal({ isOpen: false, optionIndex: -1 });
  };

  const handleMultipleAnswerChange = (index: number, checked: boolean) => {
    setFormData(prev => {
      const newCorrectAnswers = checked 
        ? [...prev.correctAnswers, index]
        : prev.correctAnswers.filter(i => i !== index);
      
      return { ...prev, correctAnswers: newCorrectAnswers };
    });
    
    // Clear errors when user makes selection
    setErrors(prev => {
      if (prev.correctAnswers) {
        return { ...prev, correctAnswers: '' };
      }
      return prev;
    });
  };

  // Matching pairs handlers
  const addMatchingPair = () => {
    setFormData(prev => ({
      ...prev,
      matchingPairs: [...prev.matchingPairs, { left: '', right: '' }]
    }));
  };

  const removeMatchingPair = (index: number) => {
    if (formData.matchingPairs.length > 1) {
      setFormData(prev => ({
        ...prev,
        matchingPairs: prev.matchingPairs.filter((_, i) => i !== index)
      }));
    }
  };

  const handleMatchingPairChange = (index: number, side: 'left' | 'right', value: string) => {
    setFormData(prev => {
      const newPairs = [...prev.matchingPairs];
      newPairs[index] = { 
        ...newPairs[index], 
        [side]: value 
      };
      return { ...prev, matchingPairs: newPairs };
    });
    
    // Clear errors
    setErrors(prev => {
      if (prev.matchingPairs) {
        return { ...prev, matchingPairs: '' };
      }
      return prev;
    });
  };

  // Ordering items handlers
  const addOrderingItem = () => {
    setFormData(prev => ({
      ...prev,
      correctOrder: [...prev.correctOrder, '']
    }));
  };

  const removeOrderingItem = (index: number) => {
    if (formData.correctOrder.length > 1) {
      setFormData(prev => ({
        ...prev,
        correctOrder: prev.correctOrder.filter((_, i) => i !== index)
      }));
    }
  };

  const handleOrderingItemChange = (index: number, value: string) => {
    setFormData(prev => {
      const newOrder = [...prev.correctOrder];
      newOrder[index] = value;
      return { ...prev, correctOrder: newOrder };
    });
    
    // Clear errors
    setErrors(prev => {
      if (prev.correctOrder) {
        return { ...prev, correctOrder: '' };
      }
      return prev;
    });
  };

  // Drag and drop for ordering items
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(formData.correctOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setFormData(prev => ({
      ...prev,
      correctOrder: items
    }));
  };

  // Memoize the input change handler to prevent infinite loops
  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prevFormData => ({ ...prevFormData, [field]: value }));
    setErrors(prevErrors => {
      if (prevErrors[field]) {
        return { ...prevErrors, [field]: '' };
      }
      return prevErrors;
    });
  }, []);

  const handleRichTextChange = (e: any) => {
    handleInputChange('question', e.target.value);
  };

  const handleExplanationChange = (e: any) => {
    handleInputChange('explanation', e.target.value);
  };

  const handleGradingCriteriaChange = (e: any) => {
    handleInputChange('gradingCriteria', e.target.value);
  };

  const toggleOptionImage = (index: number) => {
    setShowOptionImages(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

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
      case 'multiple-choice': return 'Multiple Choice (Single Answer)';
      case 'multiple-answer': return 'Multiple Choice (Multiple Answers)';
      case 'fill-in-blank': return 'Fill in the Blank';
      case 'long-answer': return 'Long Answer';
      case 'matching': return 'Matching';
      case 'ordering': return 'Ordering';
      default: return 'Multiple Choice';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Question' : 'Create New Question'}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Loading question data...
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="p-6">
            <LoadingSpinner size="lg" text="Loading question data..." />
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
                title="Back to questions"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {isEditing ? 'Edit Question' : 'Create New Question'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Configure question content and answer options
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Question Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Question Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { type: 'multiple-choice', label: 'Multiple Choice', description: 'Single correct answer', icon: List },
                { type: 'multiple-answer', label: 'Multiple Answer', description: 'Multiple correct answers', icon: CheckSquare },
                { type: 'fill-in-blank', label: 'Fill in the Blank', description: 'Text input answer', icon: Type },
                { type: 'long-answer', label: 'Long Answer', description: 'Essay or paragraph response', icon: AlignLeft },
                { type: 'matching', label: 'Matching', description: 'Match items from two columns', icon: MoveHorizontal },
                { type: 'ordering', label: 'Ordering', description: 'Arrange items in correct order', icon: ArrowUpDown },
              ].map(({ type, label, description, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeChange(type as any)}
                  className={`p-4 border-2 rounded-lg transition-colors text-left ${
                    formData.type === type
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon className={`w-5 h-5 ${
                      formData.type === type ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                    }`} />
                    <span className={`font-medium ${
                      formData.type === type ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Question *
            </label>
            <Editor
              value={formData.question}
              onChange={handleRichTextChange}
              containerProps={{
                className: `w-full min-h-[100px] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                  errors.question ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`
              }}
              placeholder="Enter your question here..."
            />
            {errors.question && (
              <div className="flex items-center space-x-1 mt-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600 dark:text-red-400">{errors.question}</p>
              </div>
            )}
          </div>

          {/* Category and Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                  errors.category ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              {errors.category && (
                <div className="flex items-center space-x-1 mt-1">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.category}</p>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty *
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value as 'easy' | 'medium' | 'hard')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Question Image Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowQuestionImage(!showQuestionImage)}
              className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-3"
              title="Add optional image to question"
            >
              {showQuestionImage ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <ImageIcon className="w-4 h-4" />
              <span>Question Image (Optional)</span>
            </button>
            
            {showQuestionImage && (
              <ImageUpload
                value={formData.image}
                onChange={(url) => handleInputChange('image', url)}
                onRemove={() => handleInputChange('image', '')}
                placeholder="Add an image to your question"
              />
            )}
          </div>

          {/* Answer Options - Multiple Choice Types */}
          {(formData.type === 'multiple-choice' || formData.type === 'multiple-answer') && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Answer Options *
                </label>
                {formData.options.length < 6 && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    title="Add another option"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Option</span>
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {formData.options.map((option, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors">
                    <div className="flex items-start space-x-3 mb-3">
                      {formData.type === 'multiple-choice' ? (
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={formData.correctAnswer === index}
                          onChange={() => handleInputChange('correctAnswer', index)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-1"
                          title="Mark as correct answer"
                        />
                      ) : (
                        <input
                          type="checkbox"
                          checked={formData.correctAnswers.includes(index)}
                          onChange={(e) => handleMultipleAnswerChange(index, e.target.checked)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-1"
                          title="Mark as correct answer"
                        />
                      )}
                      <span className="w-8 text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <div className="flex-1">
                        <Editor
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          containerProps={{
                            className: "w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                          }}
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        />
                        
                        {/* Option Image Toggle and Delete Button */}
                        <div className="flex items-center justify-between mt-3">
                          <button
                            type="button"
                            onClick={() => toggleOptionImage(index)}
                            className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                            title="Add optional image to this option"
                          >
                            {showOptionImages[index] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            <ImageIcon className="w-3 h-3" />
                            <span>Option Image (Optional)</span>
                          </button>
                          
                          {formData.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(index)}
                              className="p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                              title="Remove this option"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        {showOptionImages[index] && (
                          <div className="mt-2">
                            <ImageUpload
                              value={formData.optionImages[index]}
                              onChange={(url) => handleOptionImageChange(index, url)}
                              onRemove={() => removeOptionImage(index)}
                              placeholder="Add image for this option"
                              className="max-w-xs"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {errors.options && (
                <div className="flex items-center space-x-1 mt-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.options}</p>
                </div>
              )}
              
              {errors.correctAnswer && (
                <div className="flex items-center space-x-1 mt-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.correctAnswer}</p>
                </div>
              )}
              
              {errors.correctAnswers && (
                <div className="flex items-center space-x-1 mt-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.correctAnswers}</p>
                </div>
              )}
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {formData.type === 'multiple-choice' 
                  ? 'Select the correct answer by clicking the radio button next to it.'
                  : 'Select all correct answers by checking the boxes next to them.'
                }
              </p>
            </div>
          )}

          {/* Fill in the Blank Answer */}
          {formData.type === 'fill-in-blank' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Correct Answer *
              </label>
              <input
                type="text"
                value={formData.correctText}
                onChange={(e) => handleInputChange('correctText', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${
                  errors.correctText ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter the correct answer..."
                required
              />
              {errors.correctText && (
                <div className="flex items-center space-x-1 mt-1">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.correctText}</p>
                </div>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Students will need to type this exact answer (case-insensitive).
              </p>
            </div>
          )}

          {/* Long Answer Settings */}
          {formData.type === 'long-answer' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlignLeft className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Long Answer Question</span>
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  Requires manual grading
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Grading Criteria *
                </label>
                <Editor
                  value={formData.gradingCriteria}
                  onChange={handleGradingCriteriaChange}
                  containerProps={{
                    className: `w-full min-h-[150px] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                      errors.gradingCriteria ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                    }`
                  }}
                  placeholder="Enter criteria for grading this question..."
                />
                {errors.gradingCriteria && (
                  <div className="flex items-center space-x-1 mt-1">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.gradingCriteria}</p>
                  </div>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Describe what you're looking for in a good answer to help with consistent grading.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Score *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.maxScore}
                  onChange={(e) => handleInputChange('maxScore', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                    errors.maxScore ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.maxScore && (
                  <div className="flex items-center space-x-1 mt-1">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.maxScore}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Matching Pairs */}
          {formData.type === 'matching' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Matching Pairs *
                </label>
                <button
                  type="button"
                  onClick={addMatchingPair}
                  className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  title="Add another pair"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Pair</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.matchingPairs.map((pair, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Left Item
                      </label>
                      <input
                        type="text"
                        value={pair.left}
                        onChange={(e) => handleMatchingPairChange(index, 'left', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                        placeholder="Enter left item..."
                        required
                      />
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Right Item
                        </label>
                        <input
                          type="text"
                          value={pair.right}
                          onChange={(e) => handleMatchingPairChange(index, 'right', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                          placeholder="Enter right item..."
                          required
                        />
                      </div>
                      {formData.matchingPairs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMatchingPair(index)}
                          className="p-2 ml-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                          title="Remove this pair"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {errors.matchingPairs && (
                <div className="flex items-center space-x-1 mt-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.matchingPairs}</p>
                </div>
              )}
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Create pairs of items that students will need to match correctly.
              </p>
            </div>
          )}

          {/* Ordering Items */}
          {formData.type === 'ordering' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Items to Order *
                </label>
                <button
                  type="button"
                  onClick={addOrderingItem}
                  className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  title="Add another item"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Add items in the correct order. Students will see these items shuffled.
                </p>
                
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="ordering-items">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {formData.correctOrder.map((item, index) => (
                          <Draggable 
                            key={`item-${index}`} 
                            draggableId={`item-${index}`} 
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`flex items-center space-x-3 p-3 border rounded-lg bg-white dark:bg-gray-700 ${
                                  snapshot.isDragging ? 'shadow-lg border-blue-500' : 'border-gray-200 dark:border-gray-600'
                                }`}
                              >
                                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full text-gray-700 dark:text-gray-300 font-medium">
                                  {index + 1}
                                </div>
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="w-5 h-5 text-gray-400 dark:text-gray-500 cursor-move" />
                                </div>
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) => handleOrderingItemChange(index, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                                  placeholder={`Item ${index + 1}`}
                                  required
                                />
                                {formData.correctOrder.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeOrderingItem(index)}
                                    className="p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                    title="Remove this item"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
              
              {errors.correctOrder && (
                <div className="flex items-center space-x-1 mt-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.correctOrder}</p>
                </div>
              )}
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Drag and drop items to reorder them. The order shown here will be the correct answer.
              </p>
            </div>
          )}

          {/* Explanation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Explanation (Optional)
            </label>
            <Editor
              value={formData.explanation}
              onChange={handleExplanationChange}
              containerProps={{
                className: "w-full min-h-[100px] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
              }}
              placeholder="Explain why this is the correct answer..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
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
              {isEditing ? 'Update Question' : 'Add Question'}
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal for Option Removal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, optionIndex: -1 })}
        onConfirm={confirmRemoveOption}
        title="Remove Option"
        message={`Are you sure you want to remove Option ${String.fromCharCode(65 + deleteModal.optionIndex)}? This action cannot be undone.`}
        confirmText="Remove Option"
        type="warning"
      />
    </div>
  );
};

export default QuestionForm;