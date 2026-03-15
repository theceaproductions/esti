// Step 1: Business Info Component
import { useState } from 'react';
import { useOnboarding } from '../../../context/OnboardingContext';
import { Building2, Phone, Mail, MapPin, Upload, X } from 'lucide-react';

export default function BusinessInfoStep() {
  const { data, updateData } = useOnboarding();
  const [logoPreview, setLogoPreview] = useState<string | null>(data.businessInfo.logoUrl || null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        updateData({
          businessInfo: {
            ...data.businessInfo,
            logoUrl: reader.result as string,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    updateData({
      businessInfo: {
        ...data.businessInfo,
        logoUrl: undefined,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Tell us about your business</h2>
        <p className="text-gray-600 mt-2">This information will appear on your profile and widget</p>
      </div>

      {/* Logo Upload */}
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="relative">
          {logoPreview ? (
            <div className="relative">
              <img
                src={logoPreview}
                alt="Business Logo"
                className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
              />
              <button
                onClick={removeLogo}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-xs text-gray-500 mt-1">Upload Logo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">Upload your business logo (optional)</p>
      </div>

      {/* Business Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Business Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={data.businessInfo.businessName}
            onChange={(e) =>
              updateData({
                businessInfo: { ...data.businessInfo, businessName: e.target.value },
              })
            }
            placeholder="Enter your business name"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            value={data.businessInfo.phone}
            onChange={(e) =>
              updateData({
                businessInfo: { ...data.businessInfo, phone: e.target.value },
              })
            }
            placeholder="(555) 123-4567"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Email Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={data.businessInfo.email}
            onChange={(e) =>
              updateData({
                businessInfo: { ...data.businessInfo, email: e.target.value },
              })
            }
            placeholder="you@yourbusiness.com"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Service Area */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Service Area <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={data.businessInfo.serviceArea}
            onChange={(e) =>
              updateData({
                businessInfo: { ...data.businessInfo, serviceArea: e.target.value },
              })
            }
            placeholder="e.g., Downtown, 10 mile radius, City name"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
