import React, { useState, useEffect } from 'react';
import { Phone, ArrowUp, MessageCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

export const FloatingButtons: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  const { settings } = useData();

  // Detect scroll to show/hide back to top
  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pre-configured WhatsApp text
  const whatsappNumber = (settings.whatsAppNumber || "919415056789").replace(/[\s-+]/g, '');
  const whatsappMessage = encodeURIComponent(
    `Hello, I would like to inquire about admissions at ${settings.collegeName} for the ${settings.academicSession} batch.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 group relative"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white text-emerald-500" />
        <span className="absolute right-14 bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">
          WhatsApp Admission Helpline
        </span>
      </a>

      {/* Call Now Floating Button */}
      <a
        href={`tel:${settings.primaryPhone}`}
        className="w-13 h-13 bg-primary hover:bg-primary-light text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 group relative"
        title="Call Admission Office"
      >
        <Phone className="w-5 h-5 fill-white" />
        <span className="absolute right-14 bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">
          Call Admissions: {settings.primaryPhone}
        </span>
      </a>

      {/* Back To Top Button */}
      {showBackToTop && (
        <button
          onClick={handleBackToTop}
          className="w-13 h-13 bg-slate-900/90 hover:bg-primary text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 group cursor-pointer"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
