import React, { useState } from 'react';
import { Crown, Check, X, Users, Zap, Shield, Star, GraduationCap, BookOpen, User } from 'lucide-react';

interface MembershipSettingsProps {
  settings: any;
  onChange: (key: string, value: any) => void;
}

const MembershipSettings: React.FC<MembershipSettingsProps> = ({ settings, onChange }) => {
  const [activeTab, setActiveTab] = useState<'teacher' | 'student'>('teacher');

  const teacherPlans = [
    {
      id: 'teacher-free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      icon: Users,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-800',
      borderColor: 'border-gray-200 dark:border-gray-700',
      features: [
        { name: 'Up to 5 quizzes', included: true },
        { name: 'Basic question types', included: true },
        { name: 'Up to 50 students', included: true },
        { name: 'Basic analytics', included: true },
        { name: 'Email support', included: true },
        { name: 'Advanced question types', included: false },
        { name: 'Unlimited quizzes', included: false },
        { name: 'Advanced analytics', included: false },
        { name: 'Priority support', included: false },
        { name: 'Custom branding', included: false }
      ]
    },
    {
      id: 'teacher-pro',
      name: 'Pro',
      price: '$29',
      period: 'per month',
      icon: GraduationCap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      popular: true,
      features: [
        { name: 'Unlimited quizzes', included: true },
        { name: 'All question types', included: true },
        { name: 'Up to 500 students', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Priority email support', included: true },
        { name: 'Export results', included: true },
        { name: 'Custom categories', included: true },
        { name: 'Student management', included: true },
        { name: 'Custom branding', included: false },
        { name: 'API access', included: false }
      ]
    },
    {
      id: 'teacher-enterprise',
      name: 'Enterprise',
      price: '$99',
      period: 'per month',
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      features: [
        { name: 'Everything in Pro', included: true },
        { name: 'Unlimited students', included: true },
        { name: 'Custom branding', included: true },
        { name: 'API access', included: true },
        { name: 'SSO integration', included: true },
        { name: 'Dedicated support', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'Advanced security', included: true },
        { name: 'White-label solution', included: true },
        { name: 'On-premise deployment', included: true }
      ]
    }
  ];

  const studentPlans = [
    {
      id: 'student-free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      icon: BookOpen,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-800',
      borderColor: 'border-gray-200 dark:border-gray-700',
      features: [
        { name: 'Access to 3 free quizzes', included: true },
        { name: 'Basic progress tracking', included: true },
        { name: 'Community support', included: true },
        { name: 'Limited practice tests', included: true },
        { name: 'Access to premium quizzes', included: false },
        { name: 'Personalized feedback', included: false },
        { name: 'Advanced progress tracking', included: false },
        { name: 'Unlimited practice tests', included: false }
      ]
    },
    {
      id: 'student-basic',
      name: 'Basic',
      price: '$9.99',
      period: 'per month',
      icon: User,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      popular: true,
      features: [
        { name: 'Access to all quizzes', included: true },
        { name: 'Basic progress tracking', included: true },
        { name: 'Community support', included: true },
        { name: 'Unlimited practice tests', included: true },
        { name: 'Personalized feedback', included: true },
        { name: 'Study materials', included: true },
        { name: 'Advanced progress tracking', included: false },
        { name: 'One-on-one tutoring', included: false }
      ]
    },
    {
      id: 'student-premium',
      name: 'Premium',
      price: '$19.99',
      period: 'per month',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      features: [
        { name: 'Everything in Basic', included: true },
        { name: 'Advanced progress tracking', included: true },
        { name: 'Personalized study plan', included: true },
        { name: 'One-on-one tutoring (2 hrs/mo)', included: true },
        { name: 'Guaranteed pass', included: true },
        { name: 'Offline access', included: true },
        { name: 'Priority support', included: true },
        { name: 'Certification preparation', included: true }
      ]
    }
  ];

  const currentPlan = settings?.membershipPlan || 'free';

  const handlePlanChange = (planId: string) => {
    onChange('membershipPlan', planId);
    onChange('membershipChangedAt', new Date().toISOString());
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Membership & Billing
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage your subscription and billing preferences
        </p>
      </div>

      {/* Membership Type Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('teacher')}
          className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'teacher'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4" />
            <span>Teacher Plans</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('student')}
          className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'student'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Student Plans</span>
          </div>
        </button>
      </div>

      {/* Current Plan Status */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <Star className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Current Plan: {activeTab === 'teacher' ? 
                  teacherPlans.find(p => p.id === currentPlan)?.name || teacherPlans[0].name :
                  studentPlans.find(p => p.id === currentPlan)?.name || studentPlans[0].name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentPlan.includes('free') ? 'Enjoy our free tier with essential features' : 'Thank you for being a valued subscriber'}
              </p>
            </div>
          </div>
          {!currentPlan.includes('free') && (
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Next billing</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Membership Plans */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Available {activeTab === 'teacher' ? 'Teacher' : 'Student'} Plans
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(activeTab === 'teacher' ? teacherPlans : studentPlans).map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = currentPlan === plan.id;
            
            return (
              <div
                key={plan.id}
                className={`relative rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-lg ${
                  isCurrentPlan 
                    ? `${plan.borderColor} ${plan.bgColor} ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-900` 
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <Check className="h-3 w-3" />
                      <span>Current</span>
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`inline-flex p-3 rounded-lg ${plan.bgColor} mb-4`}>
                    <Icon className={`h-6 w-6 ${plan.color}`} />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {plan.name}
                  </h4>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${
                        feature.included 
                          ? 'text-gray-700 dark:text-gray-300' 
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanChange(plan.id)}
                  disabled={isCurrentPlan}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    isCurrentPlan
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : plan.id.includes('free')
                      ? 'bg-gray-600 hover:bg-gray-700 text-white'
                      : plan.id.includes('pro') || plan.id.includes('basic')
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {isCurrentPlan ? 'Current Plan' : plan.id.includes('free') ? 'Downgrade' : 'Upgrade'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Teacher-Student Connection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {activeTab === 'teacher' ? 'Student Management' : 'Teacher Connection'}
        </h3>
        
        {activeTab === 'teacher' ? (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              As a teacher, you can manage your students and track their progress. Invite students to join your class using the link or code below.
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Class Code</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono">DRIV-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                  Copy Invite Link
                </button>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Your Students</h4>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Progress</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {[
                      { id: 1, name: 'Alex Johnson', email: 'alex@example.com', joined: '2 weeks ago', progress: 75 },
                      { id: 2, name: 'Maria Garcia', email: 'maria@example.com', joined: '1 month ago', progress: 92 },
                      { id: 3, name: 'James Wilson', email: 'james@example.com', joined: '3 days ago', progress: 45 },
                    ].map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{student.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{student.joined}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${student.progress}%` }}></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{student.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  View All Students →
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Connect with a teacher to access their premium content and get personalized feedback on your progress.
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Join a Class</h4>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input 
                  type="text" 
                  placeholder="Enter class code" 
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  Join Class
                </button>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Your Teachers</h4>
              
              {[
                { id: 1, name: 'Sarah Johnson', subject: 'Traffic Rules', students: 42, rating: 4.8 },
                { id: 2, name: 'Michael Brown', subject: 'Vehicle Safety', students: 28, rating: 4.6 },
              ].length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 1, name: 'Sarah Johnson', subject: 'Traffic Rules', students: 42, rating: 4.8 },
                    { id: 2, name: 'Michael Brown', subject: 'Vehicle Safety', students: 28, rating: 4.6 },
                  ].map((teacher) => (
                    <div key={teacher.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 dark:text-white">{teacher.name}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{teacher.subject}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < Math.floor(teacher.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                            ))}
                          </div>
                          <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{teacher.rating}</span>
                          <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{teacher.students} students</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <GraduationCap className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">You haven't joined any classes yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Join a class to get personalized learning</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Billing Settings */}
      {!currentPlan.includes('free') && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Billing Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Auto-renewal</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically renew your subscription
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings?.autoRenewal !== false}
                  onChange={(e) => onChange('autoRenewal', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Email receipts</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive billing receipts via email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings?.emailReceipts !== false}
                  onChange={(e) => onChange('emailReceipts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="pt-4">
              <button className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm">
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Usage Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Current Usage
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeTab === 'teacher' ? (
            <>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {settings?.currentUsage?.quizzes || 3}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Quizzes Created
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {currentPlan.includes('free') ? 'of 5 limit' : 'unlimited'}
                </p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {settings?.currentUsage?.students || 12}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active Students
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {currentPlan.includes('free') ? 'of 50 limit' : currentPlan.includes('pro') ? 'of 500 limit' : 'unlimited'}
                </p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {settings?.currentUsage?.responses || 156}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Quiz Responses
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  this month
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {settings?.currentUsage?.quizzesTaken || 8}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Quizzes Taken
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  this month
                </p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {settings?.currentUsage?.avgScore || 78}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Average Score
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  across all quizzes
                </p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {settings?.currentUsage?.studyTime || 12}h
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Study Time
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  this month
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembershipSettings;