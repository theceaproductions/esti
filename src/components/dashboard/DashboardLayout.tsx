// Dashboard Layout Component with Sidebar - Estimation Station Theme
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Wrench,
  Calendar,
  FileText,
  Code,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  User,
} from 'lucide-react';
import { MOCK_CONTRACTOR } from '../../data/mockData';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/services', label: 'Services', icon: Wrench },
  { path: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
  { path: '/dashboard/estimates', label: 'Estimates', icon: FileText },
  { path: '/dashboard/widget', label: 'Widget', icon: Code },
  { path: '/dashboard/billing', label: 'Billing', icon: CreditCard },
];

// Logo Component - Estimation Station
const Logo = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* House shape with checkmark - representing estimation/approval */}
    <path
      d="M4 12L16 4L28 12V26C28 26.5523 27.5523 27 27 27H5C4.44772 27 4 26.5523 4 26V12Z"
      fill="#F97316"
    />
    {/* Checkmark forming the roof line */}
    <path
      d="M12 18L15 21L22 12"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Dollar sign for estimation */}
    <circle cx="22" cy="22" r="6" fill="#0F172A"/>
    <text x="22" y="25" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">$</text>
  </svg>
);

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-primary-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-primary-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-primary-700">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-accent-500 rounded-lg flex items-center justify-center shadow-accent">
              <Logo className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-lg leading-tight">Estimation</span>
              <span className="text-accent-400 text-sm leading-tight">Station</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-primary-300 hover:text-white hover:bg-primary-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-accent-500 text-white shadow-accent'
                    : 'text-primary-300 hover:bg-primary-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-primary-400'}`} />
                {item.label}
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-700">
          <Link
            to="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-primary-300 hover:bg-primary-800 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-error-400 hover:bg-error-500/10 hover:text-error-300 transition-colors w-full">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-primary-200 sticky top-0 z-30">
          <div className="h-full px-4 lg:px-8 flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-primary-500 hover:text-primary-700 hover:bg-primary-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search */}
            <div className="hidden md:flex items-center flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                <input
                  type="text"
                  placeholder="Search estimates, appointments..."
                  className="w-full pl-10 pr-4 py-2 bg-primary-50 border-0 rounded-lg focus:ring-2 focus:ring-accent-500/20 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* New Estimate Button */}
              <button className="btn-primary hidden sm:flex">
                <FileText className="w-4 h-4" />
                New Estimate
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-primary-500 hover:text-primary-700 hover:bg-primary-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 p-2 hover:bg-primary-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-semibold text-primary-900">
                      {MOCK_CONTRACTOR.businessName}
                    </div>
                    <div className="text-xs text-accent-600 font-medium">Free Trial</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-primary-400" />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-primary-200 py-2 animate-in">
                    <div className="px-4 py-2 border-b border-primary-100">
                      <div className="text-sm font-semibold text-primary-900">{MOCK_CONTRACTOR.businessName}</div>
                      <div className="text-xs text-primary-500">{MOCK_CONTRACTOR.email}</div>
                    </div>
                    <Link
                      to="/dashboard/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      to="/dashboard/billing"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 transition-colors"
                    >
                      <CreditCard className="w-4 h-4" />
                      Billing
                    </Link>
                    <hr className="my-2" />
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors w-full">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
