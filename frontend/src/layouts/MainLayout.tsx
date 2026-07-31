import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FloatingButtons } from '../components/FloatingButtons';
import { AdmissionModal } from '../components/AdmissionModal';
import { useData } from '../context/DataContext';

export const MainLayout: React.FC = () => {
  const { pathname } = useLocation();
  const { backendOffline } = useData();

  // Reset scroll on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {backendOffline && (
        <div className="fixed top-4 right-4 z-[60] rounded-full bg-red-600 px-3 py-1 text-[11px] font-bold text-white shadow-lg">
          🔴 Backend Offline
        </div>
      )}

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
