/**
 * Step progress indicator
 */

import React from 'react';
import type { ImportStep } from './types';

interface StepIndicatorProps {
  currentStep: ImportStep;
}

const STEPS: ImportStep[] = ['select', 'data', 'validate', 'options', 'import'];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <div className="flex items-center gap-1">
        {STEPS.map((step, index) => (
          <div
            key={step}
            className={`flex items-center ${index > 0 ? 'ml-2' : ''}`}
          >
            {index > 0 && <span className="mx-1 text-gray-300">→</span>}
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                step === currentStep
                  ? 'bg-[#8b7aaa] text-white'
                  : STEPS.indexOf(currentStep) > STEPS.indexOf(step)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-600 text-gray-300'
              }`}
            >
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
