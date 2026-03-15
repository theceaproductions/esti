// Step 5: Pricing Setup Component
import { useOnboarding } from '../../../context/OnboardingContext';
import { PRELOADED_SERVICES, SERVICE_CATEGORIES } from '../../../data/mockData';
import { DollarSign, Save } from 'lucide-react';

export default function PricingStep() {
  const { data, updateData } = useOnboarding();

  // Get all selected services
  const getSelectedServices = () => {
    const services = [];

    // Add preloaded services
    for (const serviceId of data.selectedServices) {
      const service = PRELOADED_SERVICES.find((s) => s.id === serviceId);
      if (service) {
        const category = SERVICE_CATEGORIES.find((c) => c.id === service.categoryId);
        services.push({
          id: service.id,
          name: service.name,
          categoryName: category?.name || 'Unknown',
          minPrice: data.servicePrices[service.id]?.minPrice ?? service.defaultMinPrice,
          maxPrice: data.servicePrices[service.id]?.maxPrice ?? service.defaultMaxPrice,
          fixedPrice: data.servicePrices[service.id]?.fixedPrice ?? service.defaultFixedPrice,
          isCustom: false,
        });
      }
    }

    // Add custom services
    for (const service of data.customServices) {
      const category = SERVICE_CATEGORIES.find((c) => c.id === service.categoryId);
      services.push({
        id: `custom-${Date.now()}-${Math.random()}`,
        name: service.name,
        categoryName: category?.name || 'Custom',
        minPrice: service.minPrice || 0,
        maxPrice: service.maxPrice || 0,
        fixedPrice: service.fixedPrice,
        isCustom: true,
      });
    }

    return services;
  };

  const updatePrice = (serviceId: string, field: 'minPrice' | 'maxPrice' | 'fixedPrice', value: string) => {
    const currentPrices = data.servicePrices[serviceId] || { minPrice: 0, maxPrice: 0 };
    let newPrices: { minPrice?: number; maxPrice?: number; fixedPrice?: number };

    if (field === 'fixedPrice' && value !== '') {
      // If fixed price is set, clear min/max
      newPrices = {
        fixedPrice: Number(value)
      };
    } else {
      newPrices = {
        ...currentPrices,
        [field]: value === '' ? undefined : Number(value),
      };
    }

    updateData({
      servicePrices: {
        ...data.servicePrices,
        [serviceId]: newPrices,
      },
    });
  };

  const services = getSelectedServices();

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No services selected. Please go back and select services.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Set your prices</h2>
        <p className="text-gray-600 mt-2">
          Customize pricing for your services. Leave max price empty for fixed pricing.
        </p>
      </div>

      {/* Services Pricing Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Service</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Min Price</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Max Price</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Fixed Price</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => {
              const prices = data.servicePrices[service.id] || {
                minPrice: service.minPrice,
                maxPrice: service.maxPrice,
                fixedPrice: service.fixedPrice,
              };

              return (
                <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{service.name}</div>
                    {service.isCustom && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Custom</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{service.categoryName}</td>
                  <td className="py-3 px-4">
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={prices.minPrice ?? ''}
                        onChange={(e) => updatePrice(service.id, 'minPrice', e.target.value)}
                        placeholder="0"
                        disabled={prices.fixedPrice !== undefined}
                        className="w-24 pl-7 pr-2 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={prices.maxPrice ?? ''}
                        onChange={(e) => updatePrice(service.id, 'maxPrice', e.target.value)}
                        placeholder="0"
                        disabled={prices.fixedPrice !== undefined}
                        className="w-24 pl-7 pr-2 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={prices.fixedPrice ?? ''}
                        onChange={(e) => updatePrice(service.id, 'fixedPrice', e.target.value)}
                        placeholder="Optional"
                        className="w-24 pl-7 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pricing Info */}
      <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-700">
        <div className="font-medium mb-1">Pricing Tips:</div>
        <ul className="list-disc list-inside space-y-1">
          <li>Set both min and max prices for a price range</li>
          <li>Set only a fixed price for a flat-rate service</li>
          <li>Customers will see ranges or fixed prices in your widget</li>
        </ul>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 rounded-xl p-4">
        <div className="flex items-center gap-2 text-blue-700">
          <Save className="w-5 h-5" />
          <span className="font-medium">{services.length} services configured</span>
        </div>
      </div>
    </div>
  );
}
