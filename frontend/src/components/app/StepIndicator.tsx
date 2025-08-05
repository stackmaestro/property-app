import React from 'react';

interface Step {
  id: string;
  label: string;
  number: number;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: string;
  completedSteps: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  completedSteps
}) => {
  const getStepClasses = (stepId: string) => {
    if (stepId === currentStep) {
      return {
        text: 'text-primary-600',
        circle: 'bg-primary-600 text-white'
      };
    }
    
    return {
      text: 'text-gray-400',
      circle: 'bg-gray-200 text-gray-600'
    };
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-4 mb-4">
        {steps.map((step, index) => {
          const classes = getStepClasses(step.id);
          
          return (
            <React.Fragment key={step.id}>
              <div className={`flex items-center ${classes.text}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${classes.circle}`}>
                  {step.number}
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:block">
                  {step.label}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className="w-8 h-0.5 bg-gray-300"></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;