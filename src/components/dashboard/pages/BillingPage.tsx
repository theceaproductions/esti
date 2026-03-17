// Billing Page with Subscription Management
import { useState } from 'react';
import {
  CreditCard,
  Check,
  AlertCircle,
  Clock,
  Shield,
  Zap,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { MOCK_CONTRACTOR } from '../../../data/mockData';

export default function BillingPage() {
  const [isUpgrading, setIsUpgrading] = useState(false);

  const trialDaysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(MOCK_CONTRACTOR.trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
  );

  const isTrialing = MOCK_CONTRACTOR.subscriptionStatus === 'trialing';
  const isActive = MOCK_CONTRACTOR.subscriptionStatus === 'active';

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    // Simulate redirect to Stripe Checkout
    await new Promise((resolve) => setTimeout(resolve, 1500));
    alert('Redirect to Stripe Checkout (Demo)');
    setIsUpgrading(false);
  };

  const handleManageBilling = async () => {
    // Simulate redirect to Stripe Customer Portal
    alert('Redirect to Stripe Customer Portal (Demo)');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-600">Manage your subscription and payment methods</p>
      </div>

      {/* Current Plan Status */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Current Plan</h2>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isActive
                      ? 'bg-green-100 text-green-700'
                      : isTrialing
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Check className="w-4 h-4 mr-1" /> Active
                    </>
                  ) : isTrialing ? (
                    <>
                      <Clock className="w-4 h-4 mr-1" /> Trial
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 mr-1" /> Expired
                    </>
                  )}
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  {isActive ? 'Pro Plan' : 'Free Trial'}
                </span>
              </div>

              {isTrialing && (
                <div className="mt-4 text-gray-600">
                  <p>
                    Your 14-day free trial ends in{' '}
                    <span className="font-semibold text-blue-600">{trialDaysLeft} days</span>
                  </p>
                </div>
              )}

              {isActive && (
                <div className="mt-4 text-gray-600">
                  <p>
                    Your subscription renews on{' '}
                    <span className="font-semibold">
                      {new Date(
                        Date.now() + 30 * 24 * 60 * 60 * 1000
                      ).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">$39</div>
              <div className="text-gray-500">/month</div>
            </div>
          </div>

          {/* Trial Progress Bar */}
          {isTrialing && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Trial Progress</span>
                <span>{14 - trialDaysLeft}/14 days</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${((14 - trialDaysLeft) / 14) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade CTA for Trial Users */}
      {isTrialing && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Upgrade to Pro</h3>
              <p className="text-blue-100 mb-4">
                Get unlimited estimates, priority support, and advanced features.
              </p>
              <ul className="space-y-2 text-blue-100">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Unlimited customer estimates
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Custom branding on widget
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Priority email support
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Calendar integrations
                </li>
              </ul>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">$39</div>
              <div className="text-blue-200">/month</div>
              <button
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="mt-4 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                {isUpgrading ? 'Processing...' : 'Upgrade Now'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Billing for Active Users */}
      {isActive && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Manage Subscription</h3>
          <div className="flex gap-3">
            <button
              onClick={handleManageBilling}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Manage Payment Methods
            </button>
            <button
              onClick={handleManageBilling}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View Invoices
            </button>
          </div>
        </div>
      )}

      {/* Pricing Comparison */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Plans</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-0">
          {/* Free Trial Plan */}
          <div className={`p-6 ${!isActive ? 'bg-blue-50' : ''}`}>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">Free Trial</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-4">$0</div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                14-day free trial
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Limited to 10 estimates/month
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Basic widget
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Email support
              </li>
            </ul>
            {!isActive && (
              <button className="mt-6 w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50">
                Current Plan
              </button>
            )}
          </div>

          {/* Pro Plan */}
          <div className={`p-6 border-l-0 md:border-l border-t-0 md:border-t border-gray-200 ${isActive ? 'bg-blue-50' : ''}`}>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-lg font-semibold text-gray-900">Pro</span>
              {isActive && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                  Current
                </span>
              )}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              $39 <span className="text-sm font-normal text-gray-500">/month</span>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Unlimited estimates
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Custom branding
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Calendar integrations
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Priority support
              </li>
            </ul>
            {isActive ? (
              <button
                onClick={handleManageBilling}
                className="mt-6 w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Manage Plan
              </button>
            ) : (
              <button
                onClick={handleUpgrade}
                className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Upgrade
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payment Method */}
      {isActive && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <CreditCard className="w-8 h-8 text-gray-400" />
            <div>
              <div className="font-medium text-gray-900">Visa ending in 4242</div>
              <div className="text-sm text-gray-500">Expires 12/2025</div>
            </div>
            <button className="ml-auto text-blue-600 hover:text-blue-700 text-sm font-medium">
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
