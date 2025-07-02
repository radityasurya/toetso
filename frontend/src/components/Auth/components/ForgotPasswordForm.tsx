import React, { useState } from 'react';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';
import FormInput from './FormInput';

interface ForgotPasswordFormProps {
  onClose: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onClose }) => {
  const [forgotEmail, setForgotEmail] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [forgotEmailSent, setForgotEmailSent] = useState(false);

  const validateForgotEmail = () => {
    if (!forgotEmail.trim()) {
      setErrors({ forgotEmail: 'Email is required' });
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      setErrors({ forgotEmail: 'Please enter a valid email address' });
      return false;
    }
    
    return true;
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForgotEmail()) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setForgotEmailSent(true);
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reset Password</h2>
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          &times;
        </button>
      </div>

      {forgotEmailSent ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Email Sent</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We've sent password reset instructions to:
          </p>
          <p className="text-blue-600 dark:text-blue-400 font-medium mb-6">{forgotEmail}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleForgotPassword} className="space-y-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
          
          <FormInput
            type="email"
            value={forgotEmail}
            onChange={(value) => {
              setForgotEmail(value);
              if (errors.forgotEmail) {
                setErrors({});
              }
            }}
            placeholder="Enter your email"
            label="Email Address"
            error={errors.forgotEmail}
            icon={<Mail className="w-5 h-5" />}
          />

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordForm;