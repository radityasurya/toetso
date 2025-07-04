import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Palette, Tag, AlertCircle } from 'lucide-react';
import { Category } from '../../types';
import { categories as mockCategories } from '../../data/mockData';
import LoadingSpinner from '../Common/LoadingSpinner';
import Editor from 'react-simple-wysiwyg';

const CategoryForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const [isLoading, setIsLoading] = useState(isEditing);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [category, setCategory] = useState<Category | null>(null);

  const predefinedColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#EC4899', // Pink
    '#6B7280', // Gray
    '#14B8A6', // Teal
    '#A855F7', // Violet
  ];

  useEffect(() => {
    if (isEditing && id) {
      setIsLoading(true);
      
      // Simulate loading delay for better UX
      setTimeout(() => {
        const existingCategory = mockCategories.find(cat => cat.id === id);
        if (existingCategory) {
          setCategory(existingCategory);
          setFormData({
            name: existingCategory.name,
            description: existingCategory.description,
            color: existingCategory.color,
          });
        } else {
          navigate('/categories');
        }
        setIsLoading(false);
      }, 500);
    }
  }, [id, isEditing, navigate]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Category name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Category name must be less than 50 characters';
    } else {
      const isDuplicate = mockCategories.some(cat => 
        cat.name.toLowerCase() === formData.name.trim().toLowerCase() && 
        cat.id !== id
      );
      if (isDuplicate) {
        newErrors.name = 'A category with this name already exists';
      }
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Category description is required';
    } else if (formData.description.trim().length < 5) {
      newErrors.description = 'Description must be at least 5 characters';
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    // Color validation
    if (!formData.color) {
      newErrors.color = 'Please select a color';
    } else if (!/^#[0-9A-F]{6}$/i.test(formData.color)) {
      newErrors.color = 'Please enter a valid hex color code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Saving category:', formData);
      navigate('/categories');
    }
  };

  const handleCancel = () => {
    navigate('/categories');
  };

  const handleColorSelect = (color: string) => {
    setFormData(prevFormData => ({ ...prevFormData, color }));
    setErrors(prevErrors => {
      if (prevErrors.color) {
        return { ...prevErrors, color: '' };
      }
      return prevErrors;
    });
  };

  // Memoize the input change handler to prevent infinite loops
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prevFormData => ({ ...prevFormData, [field]: value }));
    setErrors(prevErrors => {
      if (prevErrors[field]) {
        return { ...prevErrors, [field]: '' };
      }
      return prevErrors;
    });
  }, []);

  const handleDescriptionChange = (e: any) => {
    handleInputChange('description', e.target.value);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
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
                {isEditing ? 'Edit Category' : 'Add New Category'}
              </h2>
            </div>
          </div>
          <div className="p-6">
            <LoadingSpinner size="lg" text="Loading category data..." />
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
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isEditing ? 'Edit Category' : 'Add New Category'}
              </h2>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category Name *
            </label>
            <div className="relative">
              <Tag className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${
                  errors.name ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter category name..."
                maxLength={50}
              />
            </div>
            {errors.name && (
              <div className="flex items-center space-x-1 mt-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              </div>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formData.name.length}/50 characters
            </p>
          </div>

          {/* Category Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <Editor
              value={formData.description}
              onChange={handleDescriptionChange}
              containerProps={{
                className: `w-full min-h-[150px] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                  errors.description ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`
              }}
              placeholder="Describe what this category covers..."
            />
            {errors.description && (
              <div className="flex items-center space-x-1 mt-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600 dark:text-red-400">{errors.description}</p>
              </div>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formData.description.replace(/<[^>]*>/g, '').length}/500 characters
            </p>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category Color *
            </label>
            
            {/* Predefined Colors */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Choose from preset colors:</p>
              <div className="grid grid-cols-6 gap-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorSelect(color)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      formData.color === color 
                        ? 'border-gray-400 dark:border-gray-500 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800' 
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Custom Color Picker */}
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Or choose a custom color:</p>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Palette className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => handleColorSelect(e.target.value)}
                    className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${
                    errors.color ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="#3B82F6"
                  pattern="^#[0-9A-Fa-f]{6}$"
                />
                <div 
                  className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: formData.color }}
                  title="Color preview"
                />
              </div>
              {errors.color && (
                <div className="flex items-center space-x-1 mt-1">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.color}</p>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</h4>
            <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: formData.color }}
              ></div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formData.name || 'Category Name'}
                </p>
                <div 
                  className="text-sm text-gray-600 dark:text-gray-400"
                  dangerouslySetInnerHTML={{ __html: formData.description || 'Category description will appear here' }}
                />
              </div>
            </div>
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
              {isEditing ? 'Update Category' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;