import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  steps: { number: number; label: string }[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center justify-center mb-6">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= step.number ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}>
              <span>{step.number}</span>
            </div>
            <span className={`ml-2 text-sm font-medium ${
              currentStep >= step.number ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
            }`}>{step.label}</span>
          </div>
          
          {index < steps.length - 1 && (
            <div className="w-16 h-0.5 mx-2 bg-gray-200 dark:bg-gray-700"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;