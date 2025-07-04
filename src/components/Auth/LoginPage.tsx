import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { settingsApi } from '../../api';

// Components
import AuthHeader from './components/AuthHeader';
import FormInput from './components/FormInput';
import SocialButtons from './components/SocialButtons';
import ThemeToggle from './components/ThemeToggle';
import ForgotPasswordForm from './components/ForgotPasswordForm';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await settingsApi.getSettings();
        setSiteSettings(settings);
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };

    fetchSettings();
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        // For demo purposes, accept any valid email/password combination
        if (formData.email && formData.password.length >= 6) {
          // Store auth state
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userEmail', formData.email);
          
          // Navigate to dashboard
          navigate('/dashboard');
        } else {
          setErrors({ general: 'Invalid email or password' });
        }
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'admin@quizmaster.com',
      password: 'password123',
      rememberMe: false,
    });
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Store auth state
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', `user@${provider.toLowerCase()}.com`);
      
      // Navigate to dashboard
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <AuthHeader 
          title={siteSettings?.siteName || "Driving License Pro"} 
          subtitle={siteSettings?.siteDescription || "Sign in to your dashboard"} 
        />

        {showForgotPassword ? (
          /* Forgot Password Form */
          <ForgotPasswordForm onClose={() => setShowForgotPassword(false)} />
        ) : (
          /* Login Form */
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 transition-colors">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-red-700 dark:text-red-300">{errors.general}</span>
                </div>
              )}

              {/* Email Field */}
              <FormInput
                type="email"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                placeholder="Enter your email"
                label="Email Address"
                error={errors.email}
                icon={<Mail className="w-5 h-5" />}
                autoComplete="email"
              />

              {/* Password Field */}
              <FormInput
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(value) => handleInputChange('password', value)}
                placeholder="Enter your password"
                label="Password"
                error={errors.password}
                icon={<Lock className="w-5 h-5" />}
                rightIcon={showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                onRightIconClick={() => setShowPassword(!showPassword)}
                autoComplete="current-password"
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 bg-white dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                style={{ backgroundColor: siteSettings?.primaryColor || '#3B82F6' }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

              {/* Social Login */}
              <SocialButtons onSocialLogin={handleSocialLogin} />

              {/* Demo Login */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Use Demo Credentials</span>
              </button>
            </form>

            {/* Demo Credentials Info */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">Demo Credentials</h4>
              <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <p><strong>Email:</strong> admin@quizmaster.com</p>
                <p><strong>Password:</strong> password123</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Theme Toggle */}
      <ThemeToggle />
    </div>
  );
};

export default LoginPage;