// Customer-Facing Widget UI - The estimator form that customers see
// Estimation Station Theme - Friendly, minimal, mobile-first design
import { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Upload,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Home,
  X,
} from 'lucide-react';
import { SERVICE_CATEGORIES, PRELOADED_SERVICES } from '../../data/mockData';

interface CustomerWidgetProps {
  contractorId: string;
}

type Step = 'category' | 'services' | 'details' | 'estimate' | 'schedule' | 'success';

export default function CustomerWidget({ contractorId }: CustomerWidgetProps) {
  const [currentStep, setCurrentStep] = useState<Step>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [jobDetails, setJobDetails] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter services by selected category
  const categoryServices = selectedCategory
    ? PRELOADED_SERVICES.filter((s) => s.categoryId === selectedCategory)
    : [];

  // Calculate estimate
  const calculateEstimate = () => {
    let totalMin = 0;
    let totalMax = 0;

    selectedServices.forEach((serviceId) => {
      const service = PRELOADED_SERVICES.find((s) => s.id === serviceId);
      if (service) {
        totalMin += service.defaultMinPrice;
        totalMax += service.defaultMaxPrice;
      }
    });

    return { min: totalMin, max: totalMax };
  };

  const estimate = calculateEstimate();

  // Toggle service selection
  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map((file) => URL.createObjectURL(file));
      setPhotos((prev) => [...prev, ...newPhotos]);
    }
  };

  // Remove photo
  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle submit
  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setCurrentStep('success');
  };

  // Navigation
  const canProceed = () => {
    switch (currentStep) {
      case 'category':
        return selectedCategory !== null;
      case 'services':
        return selectedServices.length > 0;
      case 'details':
        return jobDetails.length > 0;
      case 'estimate':
        return true;
      case 'schedule':
        return appointmentDate && appointmentTime;
      default:
        return false;
    }
  };

  const nextStep = () => {
    const steps: Step[] = [
      'category',
      'services',
      'details',
      'estimate',
      'schedule',
      'success',
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: Step[] = [
      'category',
      'services',
      'details',
      'estimate',
      'schedule',
      'success',
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const getStepNumber = (step: Step) => {
    const steps: Step[] = [
      'category',
      'services',
      'details',
      'estimate',
      'schedule',
      'success',
    ];
    return steps.indexOf(step) + 1;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Render step content
  const renderStep = () => {
    switch (currentStep) {
      case 'category':
        return (
          <div className="customer-ui space-y-5">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Home className="w-7 h-7 text-accent-600" />
              </div>
              <h2 className="text-xl font-bold text-primary-900">What service do you need?</h2>
              <p className="text-primary-500 text-sm mt-1">Select a category to get started</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SERVICE_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'border-accent-500 bg-accent-50 shadow-sm'
                      : 'border-primary-200 hover:border-accent-300 hover:bg-primary-50'
                  }`}
                >
                  <div className="font-semibold text-primary-900">{category.name}</div>
                  <div className="text-xs text-primary-500 mt-1 line-clamp-2">{category.description}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="customer-ui space-y-5">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-primary-900">Select Services</h2>
              <p className="text-primary-500 text-sm mt-1">
                Choose what you need (pick as many as you want)
              </p>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto -mx-2 px-2">
              {categoryServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between ${
                    selectedServices.includes(service.id)
                      ? 'border-accent-500 bg-accent-50 shadow-sm'
                      : 'border-primary-200 hover:border-accent-300 hover:bg-primary-50'
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-semibold text-primary-900">{service.name}</div>
                    <div className="text-sm text-primary-500">{service.description}</div>
                  </div>
                  <div className="text-right ml-3">
                    <div className="font-bold text-accent-600">
                      {formatCurrency(service.defaultMinPrice)} - {formatCurrency(service.defaultMaxPrice)}
                    </div>
                    {selectedServices.includes(service.id) && (
                      <div className="w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center mt-2">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            {selectedServices.length > 0 && (
              <div className="text-center text-sm text-primary-600 bg-primary-50 rounded-lg py-2">
                {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
              </div>
            )}
          </div>
        );

      case 'details':
        return (
          <div className="customer-ui space-y-5">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-primary-900">Tell us about your project</h2>
              <p className="text-primary-500 text-sm mt-1">Describe what you need help with</p>
            </div>

            <div>
              <label className="input-label">
                Project Details <span className="text-error-500">*</span>
              </label>
              <textarea
                value={jobDetails}
                onChange={(e) => setJobDetails(e.target.value)}
                placeholder="Describe your project, including any specific requirements..."
                rows={5}
                className="input-field"
              />
            </div>

            <div>
              <label className="input-label">Photos (optional)</label>
              <div className="border-2 border-dashed border-primary-300 rounded-xl p-6 text-center bg-primary-50">
                <Upload className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                <p className="text-sm text-primary-500">Click to upload photos</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="mt-3 inline-block px-5 py-2.5 bg-primary-100 text-primary-700 rounded-lg text-sm font-semibold cursor-pointer hover:bg-primary-200 transition-colors"
                >
                  Upload Photos
                </label>
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-error-500 text-white rounded-full flex items-center justify-center hover:bg-error-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'estimate':
        return (
          <div className="customer-ui space-y-5">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-primary-900">Your Estimate</h2>
              <p className="text-primary-500 text-sm mt-1">
                Here's what your project might cost
              </p>
            </div>

            <div className="bg-primary-50 rounded-xl p-5">
              <div className="space-y-3 mb-5">
                {selectedServices.map((serviceId) => {
                  const service = PRELOADED_SERVICES.find((s) => s.id === serviceId);
                  if (!service) return null;
                  return (
                    <div key={serviceId} className="flex justify-between text-sm">
                      <span className="text-primary-600">{service.name}</span>
                      <span className="font-semibold text-primary-900">
                        {formatCurrency(service.defaultMinPrice)} - {formatCurrency(service.defaultMaxPrice)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t-2 border-dashed border-primary-300 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-primary-900">Estimated Total</span>
                  <span className="text-3xl font-bold text-accent-600">
                    {formatCurrency(estimate.min)} - {formatCurrency(estimate.max)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-brand-50 rounded-lg p-4 text-sm text-brand-700">
              <p>
                This is just an estimate. The final price may change after we see the project. We'll give you a detailed quote before starting any work.
              </p>
            </div>
          </div>
        );

      case 'schedule':
        return (
          <div className="customer-ui space-y-5">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-primary-900">Request an Appointment</h2>
              <p className="text-primary-500 text-sm mt-1">When would you like us to visit?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">
                  Preferred Date <span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="input-label">
                  Preferred Time <span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                  <select
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="select-field pl-10"
                  >
                    <option value="">Select time</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-primary-200 pt-5">
              <h3 className="font-bold text-primary-900 mb-4">Your Contact Information</h3>
              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    placeholder="Your Name"
                    className="input-field pl-10"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    placeholder="Email Address"
                    className="input-field pl-10"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    placeholder="Phone Number"
                    className="input-field pl-10"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                  <input
                    type="text"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    placeholder="Service Address"
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="customer-ui text-center py-8">
            <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Check className="w-10 h-10 text-success-600" />
            </div>
            <h2 className="text-2xl font-bold text-primary-900 mb-2">Request Submitted!</h2>
            <p className="text-primary-600 mb-6">
              We've received your request. We'll be in touch soon to confirm your appointment.
            </p>
            <div className="bg-primary-50 rounded-xl p-5 text-left">
              <h3 className="font-bold text-primary-900 mb-3">What's Next?</h3>
              <ul className="text-sm text-primary-600 space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check className="w-3 h-3 text-success-600" />
                  </div>
                  <span>We'll review your request</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check className="w-3 h-3 text-success-600" />
                  </div>
                  <span>We'll contact you to confirm</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check className="w-3 h-3 text-success-600" />
                  </div>
                  <span>We'll provide a final quote</span>
                </li>
              </ul>
            </div>
          </div>
        );
    }
  };

  // Don't show navigation on success step
  const showNavigation = currentStep !== 'success';

  return (
    <div className="min-h-screen bg-primary-50 customer-ui">
      {/* Progress Bar */}
      {currentStep !== 'success' && (
        <div className="bg-white border-b border-primary-200 sticky top-0 z-10">
          <div className="max-w-lg mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-primary-500">
                Step {getStepNumber(currentStep)} of 5
              </span>
              <span className="text-xs font-semibold text-accent-600">
                {Math.round((getStepNumber(currentStep) / 5) * 100)}%
              </span>
            </div>
            <div className="w-full bg-primary-200 rounded-full h-2">
              <div
                className="bg-accent-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(getStepNumber(currentStep) / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="customer-card">{renderStep()}</div>
      </div>

      {/* Navigation */}
      {showNavigation && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-primary-200 p-4 shadow-lg">
          <div className="max-w-lg mx-auto flex gap-3">
            {currentStep !== 'category' && (
              <button
                onClick={prevStep}
                className="px-6 py-3.5 border-2 border-primary-300 text-primary-700 rounded-xl font-semibold hover:bg-primary-50 flex items-center gap-2 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            )}
            {currentStep === 'schedule' ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3.5 bg-accent-500 text-white rounded-xl font-semibold hover:bg-accent-600 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors shadow-accent"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex-1 px-6 py-3.5 bg-accent-500 text-white rounded-xl font-semibold hover:bg-accent-600 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-accent"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Spacer for navigation */}
      {showNavigation && <div className="h-28" />}
    </div>
  );
}
