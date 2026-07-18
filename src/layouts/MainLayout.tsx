import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FloatingButtons } from '../components/FloatingButtons';
import { AdmissionModal } from '../components/AdmissionModal';

export const MainLayout: React.FC = () => {
  const { pathname } = useLocation();

  // Reset scroll on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Premium Navigation Head */}
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer Area */}
      <Footer />

      {/* Shared Modals and Overlays */}
      <AdmissionModal />

      {/* Action Widgets */}
      <FloatingButtons />
    </div>
  );
};
