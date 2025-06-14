import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, ImageIcon, AlertCircle, ChevronDown, ChevronUp, Home, ChevronRight } from 'lucide-react';
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
    options: ['', '', '', ''],
    optionImages: ['', '', '', ''], // Store image URLs for options
    correctAnswer: 0,
    explanation: '',
    category: '',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    image: '',
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
            options: [...existingQuestion.options],
            optionImages: new Array(existingQuestion.options.length).fill(''), // Initialize option images
            correctAnswer: existingQuestion.correctAnswer,
            explanation: existingQuestion.explanation,
            category: existingQuestion.category,
            difficulty: existingQuestion.difficulty,
            image: existingQuestion.image || '',
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

    // Options validation
    const filledOptions = formData.options.filter(option => option.trim());
    if (filledOptions.length < 2) {
      newErrors.options = 'At least 2 answer options are required';
    }

    // Check if correct answer is valid
    if (formData.correctAnswer >= filledOptions.length) {
      newErrors.correctAnswer = 'Please select a valid correct answer';
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
      // Filter out empty options and their corresponding images
      const filteredOptions = formData.options.filter(option => option.trim());
      const filteredOptionImages = formData.optionImages.slice(0, filteredOptions.length);
      
      const questionData = {
        ...formData,
        options: filteredOptions,
        optionImages: filteredOptionImages,
      };

      console.log('Saving question:', questionData);
      navigate('/questions');
    }
  };

  const handleCancel = () => {
    navigate('/questions');
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
      
      return { 
        ...prevFormData, 
        options: newOptions,
        optionImages: newOptionImages,
        correctAnswer: prevFormData.correctAnswer >= newOptions.length ? 0 : prevFormData.correctAnswer
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

  const toggleOptionImage = (index: number) => {
    setShowOptionImages(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
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
          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Question *
            </label>
            <textarea
              value={formData.question}
              onChange={(e) => handleInputChange('question', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${
                errors.question ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter your question here..."
              required
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

          {/* Answer Options */}
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
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={formData.correctAnswer === index}
                      onChange={() => handleInputChange('correctAnswer', index)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-1"
                      title="Mark as correct answer"
                    />
                    <span className="w-8 text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <div className="flex-1">
                      <textarea
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        rows={2}
                        required
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
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Select the correct answer by clicking the radio button next to it.
            </p>
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Explanation (Optional)
            </label>
            <textarea
              value={formData.explanation}
              onChange={(e) => handleInputChange('explanation', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
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