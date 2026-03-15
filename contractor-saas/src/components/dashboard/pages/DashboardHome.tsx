// Dashboard Home Page
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Calendar,
  FileText,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { MOCK_ESTIMATES, MOCK_APPOINTMENTS, MOCK_CONTRACTOR } from '../../../data/mockData';

export default function DashboardHome() {
  const pendingEstimates = MOCK_ESTIMATES.filter((e) => e.status === 'pending').length;
  const upcomingAppointments = MOCK_APPOINTMENTS.filter((a) => a.status === 'confirmed').length;

  const stats = [
    {
      label: 'Total Estimates',
      value: MOCK_ESTIMATES.length,
      change: '+12%',
      trend: 'up',
      icon: FileText,
    },
    {
      label: 'Pending Requests',
      value: pendingEstimates,
      change: '+3',
      trend: 'up',
      icon: Clock,
    },
    {
      label: 'Upcoming Jobs',
      value: upcomingAppointments,
      change: '+2',
      trend: 'up',
      icon: Calendar,
    },
    {
      label: 'Trial Days Left',
      value: Math.ceil(
        (new Date(MOCK_CONTRACTOR.trialEndDate).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      ),
      change: 'days',
      trend: 'neutral',
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                {stat.trend === 'up' && (
                  <span className="flex items-center text-sm text-green-600">
                    <ArrowUpRight className="w-4 h-4" />
                    {stat.change}
                  </span>
                )}
                {stat.trend === 'down' && (
                  <span className="flex items-center text-sm text-red-600">
                    <ArrowDownRight className="w-4 h-4" />
                    {stat.change}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/dashboard/widget"
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white hover:from-blue-700 hover:to-blue-800 transition-all"
        >
          <h3 className="font-semibold text-lg mb-2">Get More Customers</h3>
          <p className="text-blue-100 text-sm mb-4">
            Share your widget link to start receiving estimate requests
          </p>
          <span className="inline-flex items-center text-sm font-medium">
            View Widget <ArrowUpRight className="w-4 h-4 ml-1" />
          </span>
        </Link>

        <Link
          to="/dashboard/services"
          className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all"
        >
          <h3 className="font-semibold text-lg text-gray-900 mb-2">Manage Services</h3>
          <p className="text-gray-500 text-sm mb-4">Update your service offerings and pricing</p>
          <span className="inline-flex items-center text-sm text-blue-600 font-medium">
            Go to Services <ArrowUpRight className="w-4 h-4 ml-1" />
          </span>
        </Link>

        <Link
          to="/dashboard/billing"
          className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all"
        >
          <h3 className="font-semibold text-lg text-gray-900 mb-2">Upgrade to Pro</h3>
          <p className="text-gray-500 text-sm mb-4">
            Get unlimited estimates and advanced features
          </p>
          <span className="inline-flex items-center text-sm text-blue-600 font-medium">
            View Plans <ArrowUpRight className="w-4 h-4 ml-1" />
          </span>
        </Link>
      </div>

      {/* Recent Estimates & Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Estimates */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Recent Estimates</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {MOCK_ESTIMATES.slice(0, 5).map((estimate) => (
              <div key={estimate.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{estimate.customerName}</div>
                  <div className="text-sm text-gray-500">
                    {estimate.selectedServices.map((s) => s.name).join(', ')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    ${estimate.totalMinPrice} - ${estimate.totalMaxPrice}
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      estimate.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : estimate.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {estimate.status === 'pending' && <AlertCircle className="w-3 h-3 mr-1" />}
                    {estimate.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {estimate.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/dashboard/estimates"
            className="block px-6 py-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium border-t border-gray-200"
          >
            View All Estimates
          </Link>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Upcoming Appointments</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {MOCK_APPOINTMENTS.filter((a) => a.status !== 'declined').map((appointment) => (
              <div key={appointment.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{appointment.customerName}</div>
                  <div className="text-sm text-gray-500">
                    {appointment.scheduledDate} at {appointment.scheduledTime}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'confirmed'
                      ? 'bg-green-100 text-green-700'
                      : appointment.status === 'requested'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/dashboard/calendar"
            className="block px-6 py-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium border-t border-gray-200"
          >
            View Calendar
          </Link>
        </div>
      </div>
    </div>
  );
}
