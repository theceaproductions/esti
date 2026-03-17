// Onboarding Context for Managing Wizard State
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { OnboardingData, OnboardingStep, ONBOARDING_STEPS } from '../types';

interface OnboardingContextType {
  currentStep: number;
  totalSteps: number;
  currentStepKey: OnboardingStep;
  progress: number;
  data: OnboardingData;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (updates: Partial<OnboardingData>) => void;
  canProceed: () => boolean;
}

const initialData: OnboardingData = {
  businessInfo: {
    businessName: '',
    logoUrl: undefined,
    phone: '',
    email: '',
    serviceArea: '',
  },
  selectedCategories: [],
  selectedServices: [],
  customServices: [],
  servicePrices: {},
  widgetSettings: {
    primaryColor: '#2563EB',
    buttonText: 'Get Estimate',
    companyName: '',
  },
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);

  const totalSteps = ONBOARDING_STEPS.length;
  const currentStepKey = ONBOARDING_STEPS[currentStep].key;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const setStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const canProceed = useCallback(() => {
    switch (currentStepKey) {
      case 'business-info':
        return data.businessInfo.businessName.length > 0 &&
               data.businessInfo.phone.length > 0 &&
               data.businessInfo.email.length > 0;
      case 'categories':
        return data.selectedCategories.length > 0;
      case 'preloaded-services':
        return data.selectedServices.length > 0 || data.customServices.length > 0;
      case 'custom-services':
        return true; // Optional step
      case 'pricing':
        return Object.keys(data.servicePrices).length > 0;
      case 'widget':
        return data.widgetSettings.companyName.length > 0;
      case 'finish':
        return true;
      default:
        return false;
    }
  }, [currentStepKey, data]);

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        totalSteps,
        currentStepKey,
        progress,
        data,
        setStep,
        nextStep,
        prevStep,
        updateData,
        canProceed,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
