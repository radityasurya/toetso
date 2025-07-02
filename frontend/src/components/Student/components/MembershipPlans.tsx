import React from 'react';
import { Check, Star } from 'lucide-react';

interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular: boolean;
  billingPeriod: string;
  discount?: string;
}

interface MembershipPlansProps {
  plans: MembershipPlan[];
  onSelectPlan: (planId: string) => void;
  selectedPlan: string | null;
}

const MembershipPlans: React.FC<MembershipPlansProps> = ({ plans, onSelectPlan, selectedPlan }) => {
  // Filter plans based on user role (student plans)
  const studentPlans = plans.filter(plan => plan.id.includes('student') || !plan.id.includes('teacher'));
  
  return (
    <div className="py-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Choose Your Membership Plan</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Select the plan that works best for your needs</p>
      
      <div className="space-y-4">
        {studentPlans.map((plan) => (
          <div 
            key={plan.id} 
            className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
              plan.popular ? 'shadow-md border-2 border-blue-500 dark:border-blue-400' : 
              'shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md'
            } ${
              selectedPlan === plan.id ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg flex items-center">
                <Star className="w-3 h-3 mr-1" />
                <span className="text-xs font-medium">Popular</span>
              </div>
            )}
            
            <div className="bg-white dark:bg-gray-800 p-4">
              <div className="flex flex-wrap items-center justify-between">
                <div className="mb-2 md:mb-0">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{plan.description}</p>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1 text-sm">/{plan.billingPeriod}</span>
                  </div>
                  {plan.discount && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs rounded-full">
                      Save {plan.discount}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 mt-3 mb-4">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => onSelectPlan(plan.id)}
                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                  selectedPlan === plan.id
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                }`}
              >
                {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembershipPlans;