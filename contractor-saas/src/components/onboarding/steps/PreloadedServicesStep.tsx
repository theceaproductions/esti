// Step 3: Preloaded Services Selection Component
import { useOnboarding } from '../../../context/OnboardingContext';
import { PRELOADED_SERVICES, SERVICE_CATEGORIES } from '../../../data/mockData';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function PreloadedServicesStep() {
  const { data, updateData } = useOnboarding();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const selectedCategoryDetails = SERVICE_CATEGORIES.filter((cat) =>
    data.selectedCategories.includes(cat.id)
  );

  const getServicesForCategory = (categoryId: string) => {
    return PRELOADED_SERVICES.filter((service) => service.categoryId === categoryId);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleService = (serviceId: string) => {
    const newSelected = data.selectedServices.includes(serviceId)
      ? data.selectedServices.filter((id) => id !== serviceId)
      : [...data.selectedServices, serviceId];
    updateData({ selectedServices: newSelected });
  };

  const selectAllInCategory = (categoryId: string) => {
    const categoryServices = getServicesForCategory(categoryId).map((s) => s.id);
    const allSelected = categoryServices.every((id) => data.selectedServices.includes(id));
    if (allSelected) {
      updateData({
        selectedServices: data.selectedServices.filter((id) => !categoryServices.includes(id)),
      });
    } else {
      updateData({
        selectedServices: [...new Set([...data.selectedServices, ...categoryServices])],
      });
    }
  };

  if (selectedCategoryDetails.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please select categories in the previous step first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Select your services</h2>
        <p className="text-gray-600 mt-2">Choose the services you want to offer from each category</p>
      </div>

      {/* Services by Category */}
      <div className="space-y-4">
        {selectedCategoryDetails.map((category) => {
          const categoryServices = getServicesForCategory(category.id);
          const allSelected = categoryServices.every((s) =>
            data.selectedServices.includes(s.id)
          );
          const someSelected = categoryServices.some((s) =>
            data.selectedServices.includes(s.id)
          );
          const isExpanded = expandedCategories.includes(category.id);

          return (
            <div key={category.id} className="border border-gray-200 rounded-xl overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer ${
                      allSelected
                        ? 'bg-blue-500 border-blue-500'
                        : someSelected
                        ? 'bg-blue-100 border-blue-500'
                        : 'border-gray-300'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectAllInCategory(category.id);
                    }}
                  >
                    {allSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="font-semibold text-gray-900">{category.name}</span>
                  <span className="text-sm text-gray-500">
                    ({categoryServices.length} services)
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {/* Services List */}
              {isExpanded && (
                <div className="divide-y divide-gray-100">
                  {categoryServices.map((service) => {
                    const isSelected = data.selectedServices.includes(service.id);
                    return (
                      <button
                        key={service.id}
                        onClick={() => toggleService(service.id)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex-1 text-left">
                          <div className="font-medium text-gray-900">{service.name}</div>
                          <div className="text-sm text-gray-500">{service.description}</div>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="text-sm font-medium text-gray-900">
                            ${service.defaultMinPrice} - ${service.defaultMaxPrice}
                          </div>
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-2 ${
                              isSelected
                                ? 'bg-blue-500 border-blue-500'
                                : 'border-gray-300'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="text-center text-sm text-gray-500 pt-4">
        {data.selectedServices.length > 0
          ? `${data.selectedServices.length} services selected`
          : 'Select at least one service to continue'}
      </div>
    </div>
  );
}
