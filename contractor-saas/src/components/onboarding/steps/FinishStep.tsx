// Step 7: Finish Component
import { useOnboarding } from '../../../context/OnboardingContext';
import { CheckCircle2, Rocket, ArrowRight } from 'lucide-react';

interface FinishStepProps {
  onComplete: () => void;
}

export default function FinishStep({ onComplete }: FinishStepProps) {
  const { data } = useOnboarding();

  // Calculate summary
  const totalServices = data.selectedServices.length + data.customServices.length;
  const categoriesSelected = data.selectedCategories.length;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">You're all set!</h2>
        <p className="text-gray-600 mt-2">
          Your account has been configured and you're ready to start receiving estimates
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{categoriesSelected}</div>
          <div className="text-sm text-blue-700">Categories</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{totalServices}</div>
          <div className="text-sm text-green-700">Services</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">14</div>
          <div className="text-sm text-purple-700">Day Trial</div>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">$39</div>
          <div className="text-sm text-orange-700">/month</div>
        </div>
      </div>

      {/* What's Next */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">What's next?</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-blue-600">1</span>
            </div>
            <div>
              <div className="font-medium text-gray-900">Add your widget to your website</div>
              <div className="text-sm text-gray-600">
                Copy the embed code from the Widget page and add it to your site
              </div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-blue-600">2</span>
            </div>
            <div>
              <div className="font-medium text-gray-900">Wait for customer estimates</div>
              <div className="text-sm text-gray-600">
                Customers will start requesting estimates through your widget
              </div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-blue-600">3</span>
            </div>
            <div>
              <div className="font-medium text-gray-900">Review and approve estimates</div>
              <div className="text-sm text-gray-600">
                Check your dashboard to review and manage incoming requests
              </div>
            </div>
          </li>
        </ul>
      </div>

      {/* Trial Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Rocket className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <div className="font-medium text-amber-800">14-Day Free Trial</div>
            <div className="text-sm text-amber-700">
              You have full access to all features. Upgrade to continue after your trial ends.
            </div>
          </div>
        </div>
      </div>

      {/* Go to Dashboard Button */}
      <button
        onClick={onComplete}
        className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        Go to Dashboard
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
