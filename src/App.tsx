import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdmissionProvider } from './context/AdmissionContext';
import { DataProvider } from './context/DataContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { MainLayout } from './layouts/MainLayout';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Courses } from './pages/Courses';
import { Facilities } from './pages/Facilities';
import { Gallery } from './pages/Gallery';
import { Notices } from './pages/Notices';
import { Contact } from './pages/Contact';
import { FounderMessage } from './pages/FounderMessage';
import { ManagerMessage } from './pages/ManagerMessage';
import { Management } from './pages/Management';
import { AdmissionEnquiry } from './pages/AdmissionEnquiry';
import { FAQ } from './pages/FAQ';
import { NotFound } from './pages/NotFound';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdmissionEnquiries } from './pages/admin/AdmissionEnquiries';
import { AdmissionManagement } from './pages/admin/AdmissionManagement';
import { WebsiteSettingsPage } from './pages/admin/WebsiteSettingsPage';
import { CMSManagement } from './pages/admin/CMSManagement';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <AdminAuthProvider>
          <AdmissionProvider>
            <Routes>
              {/* Main App Routes */}
              <Route path="/" element={<MainLayout />}>
                {/* Core Page Routes */}
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="founder" element={<FounderMessage />} />
                <Route path="manager" element={<ManagerMessage />} />
                <Route path="management" element={<Management />} />
                <Route path="courses" element={<Courses />} />
                <Route path="facilities" element={<Facilities />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="notices" element={<Notices />} />
                <Route path="admission-enquiry" element={<AdmissionEnquiry />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="contact" element={<Contact />} />
                
                {/* Fallback Redirection (404 Page) */}
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/enquiries"
                element={
                  <ProtectedRoute>
                    <AdmissionEnquiries />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/management"
                element={
                  <ProtectedRoute>
                    <AdmissionManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute>
                    <WebsiteSettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/cms"
                element={
                  <ProtectedRoute>
                    <CMSManagement />
                  </ProtectedRoute>
                }
              />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </AdmissionProvider>
        </AdminAuthProvider>
      </DataProvider>
    </BrowserRouter>
  );
}
