import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const FormStepIndicator = ({ currentStep, totalSteps }: FormStepIndicatorProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index + 1 <= currentStep
                ? 'bg-[#6366f1] text-white'
                : 'bg-[#e8f3ff] text-[#4a4869]'
            }`}
          >
            {index + 1 < currentStep ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          {index < totalSteps - 1 && (
            <div
              className={`w-full h-1 mx-2 ${
                index + 1 < currentStep
                  ? 'bg-[#6366f1]'
                  : 'bg-[#e8f3ff]'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default FormStepIndicator;
