// Estimates Page
import { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  Check,
  X,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  Image,
  Clock,
} from 'lucide-react';
import { MOCK_ESTIMATES } from '../../../data/mockData';

export default function EstimatesPage() {
  const [estimates] = useState(MOCK_ESTIMATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEstimate, setSelectedEstimate] = useState<typeof estimates[0] | null>(null);

  const filteredEstimates = estimates.filter((estimate) => {
    const matchesSearch =
      estimate.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estimate.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || estimate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'declined':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estimates</h1>
          <p className="text-gray-600">Manage customer estimate requests</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Estimates Count */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>{filteredEstimates.length} estimates</span>
        <span className="w-1 h-1 bg-gray-300 rounded-full" />
        <span>
          {filteredEstimates.filter((e) => e.status === 'pending').length} pending
        </span>
      </div>

      {/* Estimates Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Customer</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Services</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Estimate</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Status</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Date</th>
              <th className="text-right px-6 py-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEstimates.map((estimate) => (
              <tr key={estimate.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{estimate.customerName}</div>
                    <div className="text-sm text-gray-500">{estimate.customerEmail}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">
                    {estimate.selectedServices.map((s) => s.name).join(', ')}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {estimate.selectedServices.length} service(s)
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    ${estimate.totalMinPrice} - ${estimate.totalMaxPrice}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      estimate.status
                    )}`}
                  >
                    {estimate.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">
                    {new Date(estimate.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedEstimate(estimate)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {estimate.status === 'pending' && (
                      <>
                        <button
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Approve"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Decline"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEstimates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No estimates found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Estimate Details Modal */}
      {selectedEstimate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Estimate Details</h2>
              <button
                onClick={() => setSelectedEstimate(null)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    {selectedEstimate.customerName}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    {selectedEstimate.customerEmail}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    {selectedEstimate.customerPhone}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {selectedEstimate.customerAddress}
                  </div>
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Selected Services</h3>
                <div className="space-y-2">
                  {selectedEstimate.selectedServices.map((service) => (
                    <div
                      key={service.serviceId}
                      className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                    >
                      <span className="font-medium text-gray-900">{service.name}</span>
                      <span className="text-gray-600">
                        ${service.minPrice} - ${service.maxPrice}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between bg-blue-50 rounded-lg p-3">
                  <span className="font-semibold text-blue-900">Total Estimate</span>
                  <span className="font-bold text-blue-700">
                    ${selectedEstimate.totalMinPrice} - ${selectedEstimate.totalMaxPrice}
                  </span>
                </div>
              </div>

              {/* Job Details */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Job Details</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{selectedEstimate.jobDetails}</p>
                </div>
              </div>

              {/* Photos */}
              {selectedEstimate.photoUrls.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Photos</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedEstimate.photoUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Job photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {selectedEstimate.status === 'pending' && (
                  <>
                    <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2">
                      <Check className="w-5 h-5" />
                      Approve Estimate
                    </button>
                    <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center justify-center gap-2">
                      <X className="w-5 h-5" />
                      Decline
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedEstimate(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for User icon
function User({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}
