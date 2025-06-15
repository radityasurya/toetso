import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Facebook, Github, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role: '',
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    repeatPassword: '',
    agree: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const handleChange = (field: string, value: any) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: undefined, server: undefined }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.firstName.trim()) e.firstName = 'First name required';
    if (!form.lastName.trim()) e.lastName = 'Last name required';
    if (!form.username.trim()) e.username = 'Username is required';
    if (!/^[a-zA-Z0-9_]{3,16}$/.test(form.username)) e.username = 'Username must be 3-16 characters, letters/numbers/_';
    if (!form.role || (form.role !== 'teacher' && form.role !== 'student')) e.role = 'Please select a role';
    if (!form.email) e.email = 'Email required';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.password) e.password = 'Password required';
    if (form.password.length < 8) e.password = 'Password too short';
    if (!form.repeatPassword) e.repeatPassword = 'Repeat your password';
    else if (form.repeatPassword !== form.password) e.repeatPassword = 'Passwords do not match';
    if (!form.agree) e.agree = 'You must accept the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // TODO: signup logic
    alert('Signup logic here');
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-100 to-blue-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 space-y-8 border border-purple-100">
        <div className="flex flex-col items-center">
          <User className="w-10 h-10 mb-2 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Create your Account</h2>
          <p className="text-gray-500 text-sm">It's quick and easy!</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                value={form.firstName}
                onChange={e => handleChange('firstName', e.target.value)}
                className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-blue-500`}
                placeholder="First name"
              />
              {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                value={form.lastName}
                onChange={e => handleChange('lastName', e.target.value)}
                className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-blue-500`}
                placeholder="Last name"
              />
              {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={e => handleChange('username', e.target.value)}
              className={`w-full px-3 py-2 border ${errors.username ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-blue-500`}
              placeholder="Username"
            />
            {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
          </div>
          {/* Role Tabbed Button */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">I am a *</label>
            <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
              <button
                type="button"
                className={`flex-1 px-4 py-2 text-center font-medium transition-colors ${
                  form.role === 'student'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-blue-50'
                }`}
                onClick={() => handleChange('role', 'student')}
              >
                Student
              </button>
              <button
                type="button"
                className={`flex-1 px-4 py-2 text-center font-medium transition-colors border-l border-gray-300 dark:border-gray-600 ${
                  form.role === 'teacher'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-blue-50'
                }`}
                onClick={() => handleChange('role', 'teacher')}
              >
                Teacher
              </button>
            </div>
            {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="email"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-purple-500`}
                placeholder="Email address"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          {/* Password and Repeat Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={e => handleChange('password', e.target.value)}
                className={`w-full pl-10 pr-10 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-purple-500`}
                placeholder="Create password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Repeat Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.repeatPassword}
                onChange={e => handleChange('repeatPassword', e.target.value)}
                className={`w-full pl-10 pr-10 py-2 border ${errors.repeatPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-purple-500`}
                placeholder="Repeat password"
                autoComplete="new-password"
              />
            </div>
            {errors.repeatPassword && <p className="text-xs text-red-500 mt-1">{errors.repeatPassword}</p>}
          </div>
          <div className="flex items-center mt-4">
            <input
              id="terms"
              type="checkbox"
              checked={form.agree}
              onChange={e => handleChange('agree', String(e.target.checked) === 'true' || e.target.checked)}
              className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="terms" className="ml-2 block text-xs text-gray-500">
              I agree to the{' '}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Terms and Conditions
              </a>
            </label>
            {errors.agree && <span className="ml-2 text-xs text-red-500">{errors.agree}</span>}
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg shadow-lg transition-colors font-semibold text-lg mt-4"
          >
            Create Account
          </button>
        </form>
        <div>
          <div className="w-full text-center border-t border-gray-200 my-6 relative">
            <span className="bg-white px-2 absolute -top-3 left-1/2 -translate-x-1/2 text-xs text-gray-400">
              OR SIGN UP WITH
            </span>
          </div>
          <div className="flex space-x-2 justify-center">
            <button className="p-3 rounded-lg bg-blue-100 hover:bg-blue-200">
              <Facebook className="w-5 h-5 text-blue-600" title="Facebook signup" />
            </button>
            <button className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200">
              <Github className="w-5 h-5 text-black" title="GitHub signup" />
            </button>
            <button className="p-3 rounded-lg bg-red-100 hover:bg-red-200" title="Google signup">
              <Globe className="w-5 h-5 text-red-600" />
            </button>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 mt-4">
          Already have an account?
          <button onClick={() => navigate('/login')} className="ml-2 text-purple-600 hover:underline font-medium">
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
