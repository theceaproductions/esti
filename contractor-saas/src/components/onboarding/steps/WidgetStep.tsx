// Step 6: Widget Setup Component
import { useOnboarding } from '../../../context/OnboardingContext';
import { Copy, Check, ExternalLink, Code } from 'lucide-react';
import { useState } from 'react';

const COLOR_PRESETS = [
  { name: 'Blue', value: '#2563EB' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#7C3AED' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Teal', value: '#14B8A6' },
];

export default function WidgetStep() {
  const { data, updateData } = useOnboarding();
  const [copied, setCopied] = useState(false);

  // Generate embed code
  const generateEmbedCode = () => {
    const contractorId = 'demo-contractor-id'; // This would be the actual ID in production
    return `<script src="https://yourapp.com/widget.js" data-contractor-id="${contractorId}"></script>`;
  };

  // Generate direct link
  const generateDirectLink = () => {
    const contractorId = 'demo-contractor-id';
    return `https://yourapp.com/widget/${contractorId}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrimaryColorChange = (color: string) => {
    updateData({
      widgetSettings: {
        ...data.widgetSettings,
        primaryColor: color,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Configure your widget</h2>
        <p className="text-gray-600 mt-2">
          Customize how your widget looks and works on your website
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings Panel */}
        <div className="space-y-6">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={data.widgetSettings.companyName}
              onChange={(e) =>
                updateData({
                  widgetSettings: { ...data.widgetSettings, companyName: e.target.value },
                })
              }
              placeholder={data.businessInfo.businessName || 'Your Company Name'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Button Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Button Text
            </label>
            <input
              type="text"
              value={data.widgetSettings.buttonText}
              onChange={(e) =>
                updateData({
                  widgetSettings: { ...data.widgetSettings, buttonText: e.target.value },
                })
              }
              placeholder="Get Estimate"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Primary Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="flex flex-wrap gap-3">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handlePrimaryColorChange(preset.value)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    data.widgetSettings.primaryColor === preset.value
                      ? 'border-gray-900 scale-110'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: preset.value }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>

          {/* Custom Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Color
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                value={data.widgetSettings.primaryColor}
                onChange={(e) =>
                  updateData({
                    widgetSettings: { ...data.widgetSettings, primaryColor: e.target.value },
                  })
                }
                className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={data.widgetSettings.primaryColor}
                onChange={(e) =>
                  updateData({
                    widgetSettings: { ...data.widgetSettings, primaryColor: e.target.value },
                  })
                }
                placeholder="#2563EB"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Widget Preview</h3>

          {/* Widget Preview Card */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
            {/* Preview Header */}
            <div
              className="px-4 py-3 text-white"
              style={{ backgroundColor: data.widgetSettings.primaryColor }}
            >
              <div className="font-semibold">
                {data.widgetSettings.companyName || data.businessInfo.businessName || 'Your Company'}
              </div>
              <div className="text-sm opacity-90">Get a Free Estimate</div>
            </div>

            {/* Preview Content */}
            <div className="p-4 space-y-3">
              <div className="text-sm text-gray-600">
                Your customers will see a simple form to:
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Select services
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Get instant estimates
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Request appointments
                </li>
              </ul>

              <button
                className="w-full py-3 rounded-lg text-white font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: data.widgetSettings.primaryColor }}
              >
                {data.widgetSettings.buttonText || 'Get Estimate'}
              </button>
            </div>
          </div>

          {/* Embed Code */}
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm flex items-center gap-2">
                <Code className="w-4 h-4" />
                Embed Code
              </span>
              <button
                onClick={() => handleCopy(generateEmbedCode())}
                className="text-gray-400 hover:text-white flex items-center gap-1 text-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="text-green-400 text-xs overflow-x-auto">
              {generateEmbedCode()}
            </pre>
          </div>

          {/* Direct Link */}
          <div className="bg-gray-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Direct Link</span>
              <button
                onClick={() => handleCopy(generateDirectLink())}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
            <div className="text-blue-600 text-sm mt-1 truncate">
              {generateDirectLink()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
