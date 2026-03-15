// Types for Contractor SaaS Application

export interface Contractor {
  id: string;
  email: string;
  businessName: string;
  logoUrl?: string;
  phone: string;
  serviceArea: string;
  trialStartDate: string;
  trialEndDate: string;
  subscriptionStatus: 'trialing' | 'active' | 'past_due' | 'canceled' | 'expired';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  onboardingCompleted: boolean;
  currentOnboardingStep: number;
  createdAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  isCustom?: boolean;
}

export interface PreloadedService {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  defaultMinPrice: number;
  defaultMaxPrice?: number;
  defaultFixedPrice?: number;
}

export interface ContractorService {
  id: string;
  contractorId: string;
  categoryId: string;
  name: string;
  description: string;
  minPrice: number;
  maxPrice?: number;
  fixedPrice?: number;
  isActive: boolean;
  isCustom: boolean;
}

export interface Estimate {
  id: string;
  contractorId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  selectedServices: SelectedService[];
  totalMinPrice: number;
  totalMaxPrice: number;
  totalFixedPrice?: number;
  jobDetails: string;
  photoUrls: string[];
  status: 'pending' | 'approved' | 'declined';
  createdAt: string;
}

export interface SelectedService {
  serviceId: string;
  name: string;
  minPrice: number;
  maxPrice: number;
  fixedPrice?: number;
}

export interface Appointment {
  id: string;
  contractorId: string;
  estimateId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'requested' | 'confirmed' | 'completed' | 'declined' | 'rescheduled';
  notes?: string;
  createdAt: string;
}

export interface WidgetSettings {
  primaryColor: string;
  buttonText: string;
  companyName: string;
  logoUrl?: string;
}

export interface OnboardingData {
  businessInfo: {
    businessName: string;
    logoUrl?: string;
    phone: string;
    email: string;
    serviceArea: string;
  };
  selectedCategories: string[];
  selectedServices: string[];
  customServices: Omit<ContractorService, 'id' | 'contractorId'>[];
  servicePrices: Record<string, { minPrice?: number; maxPrice?: number; fixedPrice?: number }>;
  widgetSettings: WidgetSettings;
}

// Onboarding Step Types
export type OnboardingStep =
  | 'business-info'
  | 'categories'
  | 'preloaded-services'
  | 'custom-services'
  | 'pricing'
  | 'widget'
  | 'finish';

export const ONBOARDING_STEPS: { key: OnboardingStep; title: string; description: string }[] = [
  { key: 'business-info', title: 'Business Info', description: 'Tell us about your business' },
  { key: 'categories', title: 'Service Categories', description: 'What services do you offer?' },
  { key: 'preloaded-services', title: 'Preloaded Services', description: 'Select common services' },
  { key: 'custom-services', title: 'Custom Services', description: 'Add your own services' },
  { key: 'pricing', title: 'Pricing Setup', description: 'Set your prices' },
  { key: 'widget', title: 'Widget Setup', description: 'Configure your widget' },
  { key: 'finish', title: 'Finish', description: 'You\'re all set!' },
];
