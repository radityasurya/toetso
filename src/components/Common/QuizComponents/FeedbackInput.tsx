import React, { useState } from 'react';
import { Save, AlertTriangle } from 'lucide-react';

interface FeedbackInputProps {
  initialFeedback?: string;
  onSaveFeedback: (feedback: string) => void;
  isSaving?: boolean;
  placeholder?: string;
}

const FeedbackInput: React.FC<FeedbackInputProps> = ({
  initialFeedback = '',
  onSaveFeedback,
  isSaving = false,
  placeholder = 'Add feedback for the student...'
}) => {
  const [feedback, setFeedback] = useState(initialFeedback);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!feedback.trim()) {
      setError('Please enter feedback before saving');
      return;
    }
    
    setError(null);
    onSaveFeedback(feedback);
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Feedback for Student</h4>
      
      <textarea
        value={feedback}
        onChange={(e) => {
          setFeedback(e.target.value);
          if (error) setError(null);
        }}
        rows={4}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors ${
          error ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
        }`}
        placeholder={placeholder}
      />
      
      {error && (
        <div className="flex items-center space-x-1">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Feedback</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FeedbackInput;