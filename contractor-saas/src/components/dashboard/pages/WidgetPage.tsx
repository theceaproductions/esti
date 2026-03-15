// Widget Page - Embed Code Generator
import { useState } from 'react';
import { Copy, Check, Code, ExternalLink, Eye, Settings } from 'lucide-react';
import { MOCK_CONTRACTOR } from '../../../data/mockData';

export default function WidgetPage() {
  const [copied, setCopied] = useState(false);

  const contractorId = MOCK_CONTRACTOR.id;
  const embedCode = `<script src="https://yourapp.com/widget.js" data-contractor-id="${contractorId}"></script>`;
  const directLink = `https://yourapp.com/widget/${contractorId}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Website Widget</h1>
        <p className="text-gray-600">
          Add the estimator widget to your website to start receiving estimate requests
        </p>
      </div>

      {/* Preview Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Widget Preview</h2>
          <a
            href={directLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
          >
            Open in new tab <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Widget Preview */}
        <div className="p-8 bg-gray-50">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Widget Header */}
            <div className="bg-blue-600 px-4 py-3 text-white">
              <div className="font-semibold">{MOCK_CONTRACTOR.businessName}</div>
              <div className="text-sm opacity-90">Get a Free Estimate</div>
            </div>

            {/* Widget Content */}
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

              <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Get Estimate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Embed Code Section */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Code className="w-5 h-5" />
            Embed Code
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-600">
            Copy and paste this code into your website's HTML to display the estimator widget.
          </p>

          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">HTML</span>
              <button
                onClick={() => handleCopy(embedCode)}
                className="text-gray-400 hover:text-white flex items-center gap-1 text-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="text-green-400 text-sm overflow-x-auto font-mono">
              {embedCode}
            </pre>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Installation Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Paste the code just before the closing &lt;/body&gt; tag</li>
              <li>• The widget will automatically appear on your page</li>
              <li>• You can customize the widget color in Settings</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Direct Link Section */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Direct Link
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-600">
            If you don't have a website, share this direct link with your customers.
          </p>

          <div className="bg-gray-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 truncate">
                <span className="text-blue-600">{directLink}</span>
              </div>
              <button
                onClick={() => handleCopy(directLink)}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2 flex-shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <a
              href={`mailto:?subject=Get a Free Estimate&body=Hi, you can get a free estimate from ${MOCK_CONTRACTOR.businessName} here: ${directLink}`}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
            >
              Share via Email
            </a>
            <a
              href={`https://wa.me/?text=Get a free estimate from ${MOCK_CONTRACTOR.businessName}: ${directLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              Share via WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Widget Settings */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Widget Settings
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Text
              </label>
              <input
                type="text"
                defaultValue="Get Estimate"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  defaultValue="#2563EB"
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  defaultValue="#2563EB"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
