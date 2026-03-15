// Main App Component with Routing
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import OnboardingWizard from './components/onboarding/OnboardingWizard';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './components/dashboard/pages/DashboardHome';
import ServicesPage from './components/dashboard/pages/ServicesPage';
import CalendarPage from './components/dashboard/pages/CalendarPage';
import EstimatesPage from './components/dashboard/pages/EstimatesPage';
import WidgetPage from './components/dashboard/pages/WidgetPage';
import BillingPage from './components/dashboard/pages/BillingPage';
import CustomerWidget from './components/widget/CustomerWidget';
import { MOCK_CONTRACTOR } from './data/mockData';

function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking onboarding status
    const checkOnboarding = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsOnboarded(MOCK_CONTRACTOR.onboardingCompleted);
      setIsLoading(false);
    };
    checkOnboarding();
  }, []);

  const handleOnboardingComplete = () => {
    setIsOnboarded(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Onboarding Route */}
        <Route
          path="/onboarding"
          element={
            isOnboarded ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <OnboardingWizard onComplete={handleOnboardingComplete} />
            )
          }
        />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            isOnboarded ? (
              <DashboardLayout>
                <DashboardHome />
              </DashboardLayout>
            ) : (
              <Navigate to="/onboarding" replace />
            )
          }
        />
        <Route
          path="/dashboard/services"
          element={
            isOnboarded ? (
              <DashboardLayout>
                <ServicesPage />
              </DashboardLayout>
            ) : (
              <Navigate to="/onboarding" replace />
            )
          }
        />
        <Route
          path="/dashboard/calendar"
          element={
            isOnboarded ? (
              <DashboardLayout>
                <CalendarPage />
              </DashboardLayout>
            ) : (
              <Navigate to="/onboarding" replace />
            )
          }
        />
        <Route
          path="/dashboard/estimates"
          element={
            isOnboarded ? (
              <DashboardLayout>
                <EstimatesPage />
              </DashboardLayout>
            ) : (
              <Navigate to="/onboarding" replace />
            )
          }
        />
        <Route
          path="/dashboard/widget"
          element={
            isOnboarded ? (
              <DashboardLayout>
                <WidgetPage />
              </DashboardLayout>
            ) : (
              <Navigate to="/onboarding" replace />
            )
          }
        />
        <Route
          path="/dashboard/billing"
          element={
            isOnboarded ? (
              <DashboardLayout>
                <BillingPage />
              </DashboardLayout>
            ) : (
              <Navigate to="/onboarding" replace />
            )
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            isOnboarded ? (
              <DashboardLayout>
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                  <p className="text-gray-600 mt-2">Settings page coming soon...</p>
                </div>
              </DashboardLayout>
            ) : (
              <Navigate to="/onboarding" replace />
            )
          }
        />

        {/* Customer Widget Route */}
        <Route path="/widget/:contractorId" element={<CustomerWidgetWidgetWrapper />} />

        {/* Default redirect */}
        <Route
          path="/"
          element={
            isOnboarded ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/onboarding" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

// Wrapper to extract contractorId from URL params
function CustomerWidgetWidgetWrapper() {
  // Use React Router's useParams hook properly
  return <CustomerWidgetWrapper />;
}

function CustomerWidgetWrapper() {
  // We'll use a simple approach with the path
  const pathParts = window.location.pathname.split('/');
  const contractorId = pathParts[pathParts.length - 1] || 'demo';
  return <CustomerWidget contractorId={contractorId} />;
}

export default App;
