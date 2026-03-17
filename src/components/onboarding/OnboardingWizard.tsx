// Main Onboarding Wizard Component
import { useOnboarding, OnboardingProvider } from '../../context/OnboardingContext';
import { ONBOARDING_STEPS } from '../../types';
import BusinessInfoStep from './steps/BusinessInfoStep';
import CategoriesStep from './steps/CategoriesStep';
import PreloadedServicesStep from './steps/PreloadedServicesStep';
import CustomServicesStep from './steps/CustomServicesStep';
import PricingStep from './steps/PricingStep';
import WidgetStep from './steps/WidgetStep';
import FinishStep from './steps/FinishStep';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useState } from 'react';

function OnboardingWizardContent({ onComplete }: { onComplete: () => void }) {
  const { currentStep, totalSteps, progress, nextStep, prevStep, canProceed, currentStepKey } = useOnboarding();
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    // Simulate saving data
    await new Promise(resolve => setTimeout(resolve, 1000));
    onComplete();
  };

  const renderStep = () => {
    switch (currentStepKey) {
      case 'business-info':
        return <BusinessInfoStep />;
      case 'categories':
        return <CategoriesStep />;
      case 'preloaded-services':
        return <PreloadedServicesStep />;
      case 'custom-services':
        return <CustomServicesStep />;
      case 'pricing':
        return <PricingStep />;
      case 'widget':
        return <WidgetStep />;
      case 'finish':
        return <FinishStep onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {ONBOARDING_STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={step.key} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                    </div>
                    <div
                      className={`text-xs mt-2 hidden md:block ${
                        isActive ? 'text-blue-600 font-medium' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </div>
                  </div>
                  {index < totalSteps - 1 && (
                    <div
                      className={`w-8 md:w-16 h-0.5 mx-2 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step Content */}
          <div className="min-h-[400px]">{renderStep()}</div>

          {/* Navigation Buttons */}
          {!isLastStep && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={isFirstStep}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  isFirstStep
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>

              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-colors ${
                  canProceed()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isLastStep ? 'Finish' : 'Continue'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Step Description */}
        <div className="text-center mt-6 text-gray-500">
          <span className="font-medium">{currentStep + 1}</span> of {totalSteps}:{' '}
          {ONBOARDING_STEPS[currentStep].description}
        </div>
      </div>
    </div>
  );
}

interface OnboardingWizardProps {
  onComplete: () => void;
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  return (
    <OnboardingProvider>
      <OnboardingWizardContent onComplete={onComplete} />
    </OnboardingProvider>
  );
}
