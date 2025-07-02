import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, User, Phone, MapPin, GraduationCap, Award, Building, Calendar, Briefcase, School, Heart, Check, ChevronRight, ChevronLeft } from 'lucide-react';

// Components
import AuthHeader from './components/AuthHeader';
import FormInput from './components/FormInput';
import SocialButtons from './components/SocialButtons';
import ThemeToggle from './components/ThemeToggle';
import StepIndicator from './components/StepIndicator';
import AccountTypeSelector from './components/AccountTypeSelector';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'teacher' | 'student'>('teacher');
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Shared account data between teacher and student
  const [accountData, setAccountData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [teacherData, setTeacherData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    jobTitle: '',
    department: '',
    yearsExperience: '',
    specializations: [] as string[],
    bio: '',
  });

  const [studentData, setStudentData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    studentId: '',
    grade: '',
    school: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const specializations = [
    'Traffic Signs',
    'Road Rules',
    'Vehicle Safety',
    'Parking',
    'Emergency Situations',
    'Defensive Driving',
    'Highway Driving',
    'City Driving',
  ];

  const grades = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Pre-Test',
  ];

  const steps = [
    { number: 1, label: 'Account' },
    { number: 2, label: 'Profile' },
    { number: 3, label: 'Additional Info' }
  ];

  const validateAccountInfo = () => {
    const newErrors: { [key: string]: string } = {};

    if (!accountData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(accountData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!accountData.password) {
      newErrors.password = 'Password is required';
    } else if (accountData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(accountData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (accountData.password !== accountData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateProfileInfo = () => {
    const newErrors: { [key: string]: string } = {};
    const data = activeTab === 'teacher' ? teacherData : studentData;

    if (!data.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!data.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAccountDataChange = (field: string, value: string) => {
    setAccountData({ ...accountData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleTeacherInputChange = (field: string, value: string | string[]) => {
    setTeacherData({ ...teacherData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleStudentInputChange = (field: string, value: string) => {
    setStudentData({ ...studentData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSpecializationToggle = (specialization: string) => {
    const current = teacherData.specializations;
    const updated = current.includes(specialization)
      ? current.filter(s => s !== specialization)
      : [...current, specialization];
    
    handleTeacherInputChange('specializations', updated);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateAccountInfo()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (validateProfileInfo()) {
        setStep(3);
      }
    }
  };

  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let isValid = false;
    
    if (step === 1) {
      isValid = validateAccountInfo();
      if (isValid) {
        setStep(2);
        return;
      }
    } else if (step === 2) {
      isValid = validateProfileInfo();
      if (isValid) {
        setStep(3);
        return;
      }
    } else {
      // All fields in step 3 are optional, so we can proceed
      isValid = true;
    }
    
    if (isValid) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        // Store auth state
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', accountData.email);
        localStorage.setItem('userRole', activeTab);
        
        // Navigate to dashboard
        navigate('/dashboard');
      }, 2000);
    }
  };

  const handleSocialSignup = (provider: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Store auth state
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', `user@${provider.toLowerCase()}.com`);
      localStorage.setItem('userRole', activeTab);
      
      // Navigate to dashboard
      navigate('/dashboard');
    }, 1500);
  };

  const handleSkipDetails = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Store auth state
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', accountData.email);
      localStorage.setItem('userRole', activeTab);
      
      // Navigate to dashboard
      navigate('/dashboard');
    }, 1000);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h3>
      
      {/* Account Type Selection */}
      <AccountTypeSelector activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Email Field */}
      <FormInput
        type="email"
        value={accountData.email}
        onChange={(value) => handleAccountDataChange('email', value)}
        placeholder="Enter your email"
        label="Email Address *"
        error={errors.email}
        icon={<Mail className="w-5 h-5" />}
      />

      {/* Password Field */}
      <FormInput
        type={showPassword ? 'text' : 'password'}
        value={accountData.password}
        onChange={(value) => handleAccountDataChange('password', value)}
        placeholder="Create a password"
        label="Password *"
        error={errors.password}
        icon={<Lock className="w-5 h-5" />}
        rightIcon={showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        onRightIconClick={() => setShowPassword(!showPassword)}
      />

      {/* Confirm Password Field */}
      <FormInput
        type={showConfirmPassword ? 'text' : 'password'}
        value={accountData.confirmPassword}
        onChange={(value) => handleAccountDataChange('confirmPassword', value)}
        placeholder="Confirm your password"
        label="Confirm Password *"
        error={errors.confirmPassword}
        icon={<Lock className="w-5 h-5" />}
        rightIcon={showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
      />

      {/* Social Signup */}
      <SocialButtons onSocialLogin={handleSocialSignup} />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          type="text"
          value={activeTab === 'teacher' ? teacherData.firstName : studentData.firstName}
          onChange={(value) => activeTab === 'teacher' 
            ? handleTeacherInputChange('firstName', value)
            : handleStudentInputChange('firstName', value)
          }
          placeholder="Enter your first name"
          label="First Name *"
          error={errors.firstName}
          icon={<User className="w-5 h-5" />}
        />

        <FormInput
          type="text"
          value={activeTab === 'teacher' ? teacherData.lastName : studentData.lastName}
          onChange={(value) => activeTab === 'teacher' 
            ? handleTeacherInputChange('lastName', value)
            : handleStudentInputChange('lastName', value)
          }
          placeholder="Enter your last name"
          label="Last Name *"
          error={errors.lastName}
          icon={<User className="w-5 h-5" />}
        />

        <FormInput
          type="tel"
          value={activeTab === 'teacher' ? teacherData.phone : studentData.phone}
          onChange={(value) => activeTab === 'teacher' 
            ? handleTeacherInputChange('phone', value)
            : handleStudentInputChange('phone', value)
          }
          placeholder="Enter your phone number"
          label="Phone Number"
          error={errors.phone}
          icon={<Phone className="w-5 h-5" />}
        />

        <FormInput
          type="text"
          value={activeTab === 'teacher' ? teacherData.location : studentData.location}
          onChange={(value) => activeTab === 'teacher' 
            ? handleTeacherInputChange('location', value)
            : handleStudentInputChange('location', value)
          }
          placeholder="City, State"
          label="Location"
          error={errors.location}
          icon={<MapPin className="w-5 h-5" />}
        />
      </div>
      
      {activeTab === 'teacher' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Professional Bio
          </label>
          <textarea
            value={teacherData.bio}
            onChange={(e) => handleTeacherInputChange('bio', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            placeholder="Tell us about your teaching experience and expertise..."
          />
        </div>
      )}
    </div>
  );

  const renderTeacherStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Professional Information (Optional)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          type="text"
          value={teacherData.jobTitle}
          onChange={(value) => handleTeacherInputChange('jobTitle', value)}
          placeholder="e.g. Driving Instructor"
          label="Job Title"
          error={errors.jobTitle}
          icon={<Briefcase className="w-5 h-5" />}
        />

        <FormInput
          type="text"
          value={teacherData.department}
          onChange={(value) => handleTeacherInputChange('department', value)}
          placeholder="e.g. Education Department"
          label="Department"
          error={errors.department}
          icon={<Building className="w-5 h-5" />}
        />

        <FormInput
          type="number"
          value={teacherData.yearsExperience}
          onChange={(value) => handleTeacherInputChange('yearsExperience', value)}
          placeholder="e.g. 5"
          label="Years of Experience"
          error={errors.yearsExperience}
          icon={<Calendar className="w-5 h-5" />}
        />
      </div>

      {/* Specializations */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Specializations
        </label>
        {errors.specializations && (
          <div className="flex items-center space-x-1 mb-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-600 dark:text-red-400">{errors.specializations}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          {specializations.map((spec) => (
            <div 
              key={spec}
              onClick={() => handleSpecializationToggle(spec)}
              className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                teacherData.specializations.includes(spec)
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                teacherData.specializations.includes(spec)
                  ? 'bg-blue-500 text-white'
                  : 'border border-gray-400 dark:border-gray-500'
              }`}>
                {teacherData.specializations.includes(spec) && <Check className="w-3 h-3" />}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{spec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStudentStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Student Information (Optional)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          type="text"
          value={studentData.studentId}
          onChange={(value) => handleStudentInputChange('studentId', value)}
          placeholder="Enter your student ID if you have one"
          label="Student ID"
          error={errors.studentId}
          icon={<Award className="w-5 h-5" />}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Grade Level
          </label>
          <select
            value={studentData.grade}
            onChange={(e) => handleStudentInputChange('grade', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
              errors.grade ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="">Select your grade level</option>
            {grades.map((grade) => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
          {errors.grade && (
            <div className="flex items-center space-x-1 mt-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-sm text-red-600 dark:text-red-400">{errors.grade}</p>
            </div>
          )}
        </div>

        <FormInput
          type="text"
          value={studentData.school}
          onChange={(value) => handleStudentInputChange('school', value)}
          placeholder="Enter your school or institution"
          label="School/Institution"
          error={errors.school}
          icon={<School className="w-5 h-5" />}
        />
      </div>

      {/* Emergency Contact */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Emergency Contact (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            type="text"
            value={studentData.emergencyContact}
            onChange={(value) => handleStudentInputChange('emergencyContact', value)}
            placeholder="Enter emergency contact name"
            label="Emergency Contact Name"
            error={errors.emergencyContact}
            icon={<Heart className="w-5 h-5" />}
          />

          <FormInput
            type="tel"
            value={studentData.emergencyPhone}
            onChange={(value) => handleStudentInputChange('emergencyPhone', value)}
            placeholder="Enter emergency contact phone"
            label="Emergency Contact Phone"
            error={errors.emergencyPhone}
            icon={<Phone className="w-5 h-5" />}
          />
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return activeTab === 'teacher' ? renderTeacherStep3() : renderStudentStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <AuthHeader 
          title="Join Quiz Master" 
          subtitle="Create your account to get started" 
        />
        
        {/* Step Indicator */}
        <StepIndicator currentStep={step} steps={steps} />

        {/* Signup Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8">
            {renderCurrentStep()}

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className={`${step === 1 ? 'ml-auto' : ''} flex items-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors`}
                >
                  {step === 1 ? <span>Create Account</span> : <span>Next</span>}
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="ml-auto flex ">
                  <button
                    type="button"
                    onClick={handleSkipDetails}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Skip for Now
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Login Link - Outside the form */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Theme Toggle */}
      <ThemeToggle />
    </div>
  );
};

export default SignupPage;