import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Facebook, Github, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; server?: string }>({});

  const handleChange = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: undefined, server: undefined }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.email) e.email = 'Email required';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // TODO: login logic, handle response
    alert('Login logic here');
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 space-y-8 border border-blue-100">
        <div className="flex flex-col items-center">
          <Mail className="w-10 h-10 mb-2 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Login to Kuizzz</h2>
          <p className="text-gray-500 text-sm">Welcome back!</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="email"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-blue-500`}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={e => handleChange('password', e.target.value)}
                className={`w-full pl-10 pr-10 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-blue-500`}
                placeholder="Enter your password"
                autoComplete="current-password"
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
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg shadow-lg transition-colors font-semibold text-lg"
          >
            Login
          </button>
          <div className="text-right">
            <button
              type="button"
              className="text-xs text-blue-500 hover:underline"
              onClick={() => alert('Forgot password flow')}
            >
              Forgot password?
            </button>
          </div>
        </form>
        <div>
          <div className="w-full text-center border-t border-gray-200 my-6 relative">
            <span className="bg-white px-2 absolute -top-3 left-1/2 -translate-x-1/2 text-xs text-gray-400">
              OR LOGIN WITH
            </span>
          </div>
          <div className="flex space-x-2 justify-center">
            <button className="p-3 rounded-lg bg-blue-100 hover:bg-blue-200">
              <Facebook className="w-5 h-5 text-blue-600" title="Facebook login" />
            </button>
            <button className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200">
              <Github className="w-5 h-5 text-black" title="GitHub login" />
            </button>
            <button className="p-3 rounded-lg bg-red-100 hover:bg-red-200" title="Google login">
              <Globe className="w-5 h-5 text-red-600" />
            </button>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 mt-4">
          Don&apos;t have an account?
          <button onClick={() => navigate('/signup')} className="ml-2 text-blue-600 hover:underline font-medium">
            Create account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
