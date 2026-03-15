// Step 4: Custom Services Component
import { useOnboarding } from '../../../context/OnboardingContext';
import { SERVICE_CATEGORIES } from '../../../data/mockData';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useState } from 'react';

interface CustomService {
  name: string;
  description: string;
  categoryId: string;
  minPrice: string;
  maxPrice: string;
  fixedPrice: string;
}

export default function CustomServicesStep() {
  const { data, updateData } = useOnboarding();
  const [customServices, setCustomServices] = useState<CustomService[]>([]);

  const addCustomService = () => {
    setCustomServices([
      ...customServices,
      {
        name: '',
        description: '',
        categoryId: data.selectedCategories[0] || '',
        minPrice: '',
        maxPrice: '',
        fixedPrice: '',
      },
    ]);
  };

  const removeCustomService = (index: number) => {
    setCustomServices(customServices.filter((_, i) => i !== index));
  };

  const updateCustomService = (index: number, field: keyof CustomService, value: string) => {
    const updated = [...customServices];
    updated[index] = { ...updated[index], [field]: value };
    setCustomServices(updated);

    // Also update the main data
    const allCustomServices = [...data.customServices];
    if (index < allCustomServices.length) {
      allCustomServices[index] = {
        ...allCustomServices[index],
        [field]: field === 'minPrice' || field === 'maxPrice' || field === 'fixedPrice'
          ? Number(value) || 0
          : value,
      };
    } else {
      allCustomServices.push({
        categoryId: updated[index].categoryId,
        name: updated[index].name,
        description: updated[index].description,
        minPrice: Number(updated[index].minPrice) || 0,
        maxPrice: Number(updated[index].maxPrice) || 0,
        fixedPrice: updated[index].fixedPrice ? Number(updated[index].fixedPrice) : undefined,
        isActive: true,
        isCustom: true,
      });
    }
    updateData({ customServices: allCustomServices });
  };

  const selectedCategoryDetails = SERVICE_CATEGORIES.filter((cat) =>
    data.selectedCategories.includes(cat.id)
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Add custom services</h2>
        <p className="text-gray-600 mt-2">
          Create services specific to your business that aren't in our list
        </p>
      </div>

      {/* Custom Services List */}
      <div className="space-y-4">
        {customServices.map((service, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-4 space-y-4"
          >
            <div className="flex items-start gap-4">
              <div className="cursor-move text-gray-400 hover:text-gray-600">
                <GripVertical className="w-5 h-5" />
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Service Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => updateCustomService(index, 'name', e.target.value)}
                    placeholder="e.g., Cabinet Refinishing"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Category
                  </label>
                  <select
                    value={service.categoryId}
                    onChange={(e) => updateCustomService(index, 'categoryId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    {selectedCategoryDetails.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Description
                  </label>
                  <textarea
                    value={service.description}
                    onChange={(e) => updateCustomService(index, 'description', e.target.value)}
                    placeholder="Describe this service..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Min Price
                    </label>
                    <input
                      type="number"
                      value={service.minPrice}
                      onChange={(e) => updateCustomService(index, 'minPrice', e.target.value)}
                      placeholder="$0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Max Price
                    </label>
                    <input
                      type="number"
                      value={service.maxPrice}
                      onChange={(e) => updateCustomService(index, 'maxPrice', e.target.value)}
                      placeholder="$0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Fixed (opt)
                    </label>
                    <input
                      type="number"
                      value={service.fixedPrice}
                      onChange={(e) => updateCustomService(index, 'fixedPrice', e.target.value)}
                      placeholder="$0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeCustomService(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <button
        onClick={addCustomService}
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add Custom Service
      </button>

      {/* Info */}
      <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
        <p>
          You can always add more services later from your dashboard. This step is optional.
        </p>
      </div>
    </div>
  );
}
