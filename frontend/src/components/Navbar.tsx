import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ChevronRight, PhoneCall, Award, Landmark, HelpCircle, ShieldAlert } from 'lucide-react';
import { useAdmissionModal } from '../context/AdmissionContext';
import { useData } from '../context/DataContext';

export const Navbar: React.FC = () => {
  const { settings, admissionSettings } = useData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Use admissionSettings if available, otherwise fallback to settings
  const currentAdmissionStatus = admissionSettings?.admissionStatus || settings.admissionStatus;
  const currentAcademicSession = admissionSettings?.academicSession || settings.academicSession;
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { openModal } = useAdmissionModal();
  const location = useLocation();

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and reset active dropdowns on route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // Dropdown Items Configurations
  const aboutLinks = [
    { name: 'About College', path: '/about' },
    { name: "Founder's Message", path: '/founder' },
    { name: "Manager's Message", path: '/manager' },
    { name: 'Governing Management', path: '/management' },
  ];

  const admissionLinks = [
    { name: 'Admission Enquiry & Steps', path: '/admission-enquiry' },
    { name: 'Frequently Asked Questions (FAQ)', path: '/faq' },
  ];

  return (
    <>
      {/* Top micro-banner for premium university feel */}
      <div className="bg-primary text-white text-[11px] font-sans font-medium py-1.5 px-4 flex justify-between items-center border-b border-white/10 z-90 relative">
        <div className="flex items-center gap-4 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">📍 {settings.address}</span>
            <span>📞 Call: {settings.primaryPhone}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-gold text-primary-dark font-bold px-2 py-0.5 rounded text-[10px] animate-pulse">
              Admissions {currentAdmissionStatus === 'Open' ? `${currentAcademicSession} Open` : 'Closed'}
            </span>
            <span className="hidden md:inline">Affiliated to University of Lucknow</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <nav
        className={`sticky top-0 w-full z-80 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100 py-3'
            : 'bg-white py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* College Logo and Crest */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 p-1 group-hover:bg-primary/10 transition-colors">
                <img
                  src={settings.logoUrl}
                  alt={`${settings.collegeName} logo`}
                  className="w-full h-full object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-base sm:text-lg font-bold text-primary tracking-tight leading-tight group-hover:text-primary-light transition-colors">
                  CHANDRA BHANU GUPTA
                </span>
                <span className="font-sans text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-widest leading-none">
                  Law College, Lucknow
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6">
              
              {/* Home */}
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `relative text-sm font-semibold tracking-wide py-2 transition-colors ${
                    isActive ? 'text-primary' : 'text-slate-600 hover:text-primary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Home</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gold rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>

              {/* About Us (Interactive Hover Dropdown) */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('about')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={`flex items-center gap-1.5 text-sm font-semibold tracking-wide py-2 cursor-pointer transition-colors ${
                    location.pathname.startsWith('/about') || 
                    location.pathname.startsWith('/founder') || 
                    location.pathname.startsWith('/manager') || 
                    location.pathname.startsWith('/management')
                      ? 'text-primary'
                      : 'text-slate-600 hover:text-primary'
                  }`}
                >
                  <span>About Us</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {activeDropdown === 'about' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 mt-1 w-56 bg-white border border-slate-100 rounded-xl shadow-lg p-2.5 space-y-1 z-99"
                    >
                      {aboutLinks.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="block px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Courses */}
              <NavLink
                to="/courses"
                className={({ isActive }) =>
                  `relative text-sm font-semibold tracking-wide py-2 transition-colors ${
                    isActive ? 'text-primary' : 'text-slate-600 hover:text-primary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Courses</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gold rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>

              {/* Facilities */}
              <NavLink
                to="/facilities"
                className={({ isActive }) =>
                  `relative text-sm font-semibold tracking-wide py-2 transition-colors ${
                    isActive ? 'text-primary' : 'text-slate-600 hover:text-primary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Facilities</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gold rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>

              {/* Admissions (Interactive Hover Dropdown) */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('admissions')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={`flex items-center gap-1.5 text-sm font-semibold tracking-wide py-2 cursor-pointer transition-colors ${
                    location.pathname.startsWith('/admission-enquiry') || 
                    location.pathname.startsWith('/faq')
                      ? 'text-primary'
                      : 'text-slate-600 hover:text-primary'
                  }`}
                >
                  <span>Admissions</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {activeDropdown === 'admissions' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 mt-1 w-64 bg-white border border-slate-100 rounded-xl shadow-lg p-2.5 space-y-1 z-99"
                    >
                      {admissionLinks.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="block px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Gallery */}
              <NavLink
                to="/gallery"
                className={({ isActive }) =>
                  `relative text-sm font-semibold tracking-wide py-2 transition-colors ${
                    isActive ? 'text-primary' : 'text-slate-600 hover:text-primary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Gallery</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gold rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>

              {/* Notices */}
              <NavLink
                to="/notices"
                className={({ isActive }) =>
                  `relative text-sm font-semibold tracking-wide py-2 transition-colors ${
                    isActive ? 'text-primary' : 'text-slate-600 hover:text-primary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Notices</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gold rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>

              {/* Contact */}
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `relative text-sm font-semibold tracking-wide py-2 transition-colors ${
                    isActive ? 'text-primary' : 'text-slate-600 hover:text-primary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Contact</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gold rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>

            </div>

            {/* Desktop Action Button */}
            <div className="hidden lg:block">
              <button
                onClick={() => openModal()}
                className="bg-primary hover:bg-primary-light text-white font-semibold text-xs uppercase tracking-widest px-5 py-3 rounded-lg border border-primary transition-all duration-300 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4 text-gold animate-bounce" />
                Admission Enquiry
              </button>
            </div>

            {/* Mobile Menu Hamburger */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-98 bg-slate-900/40 backdrop-blur-xs lg:hidden"
            />

            {/* Side Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[310px] bg-white z-99 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto lg:hidden"
            >
              <div>
                {/* Header inside drawer */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 p-1 flex items-center justify-center border border-primary/10">
                      <img
                        src={settings.logoUrl}
                        alt={`${settings.collegeName} logo`}
                        className="w-full h-full object-contain rounded-md"
                        referrerPolicy="no-referrer"
                      />
                    </div>                    <span className="font-serif font-bold text-sm text-primary tracking-tight">
                      CBG LAW COLLEGE
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-full hover:bg-slate-50 text-slate-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Navigation List with Subcategories */}
                <div className="flex flex-col gap-1 py-4 divide-y divide-slate-50">
                  
                  {/* Home */}
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `flex items-center justify-between py-3 font-semibold text-sm transition-all ${
                        isActive ? 'text-primary' : 'text-slate-600 hover:text-primary'
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Home</span>
                  </NavLink>

                  {/* About Category Group */}
                  <div className="py-3.5 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">About College</span>
                    <div className="pl-3.5 space-y-2.5 border-l-2 border-slate-100">
                      {aboutLinks.map((sub) => (
                        <NavLink
                          key={sub.name}
                          to={sub.path}
                          className={({ isActive }) =>
                            `block text-xs font-semibold ${
                              isActive ? 'text-primary' : 'text-slate-500 hover:text-primary'
                            }`
                          }
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {sub.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>

                  {/* Courses */}
                  <NavLink
                    to="/courses"
                    className={({ isActive }) =>
                      `flex items-center justify-between py-3.5 font-semibold text-sm transition-all ${
                        isActive ? 'text-primary' : 'text-slate-600'
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Courses</span>
                  </NavLink>

                  {/* Facilities */}
                  <NavLink
                    to="/facilities"
                    className={({ isActive }) =>
                      `flex items-center justify-between py-3.5 font-semibold text-sm transition-all ${
                        isActive ? 'text-primary' : 'text-slate-600'
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Facilities</span>
                  </NavLink>

                  {/* Admission Category Group */}
                  <div className="py-3.5 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Admissions</span>
                    <div className="pl-3.5 space-y-2.5 border-l-2 border-slate-100">
                      {admissionLinks.map((sub) => (
                        <NavLink
                          key={sub.name}
                          to={sub.path}
                          className={({ isActive }) =>
                            `block text-xs font-semibold ${
                              isActive ? 'text-primary' : 'text-slate-500 hover:text-primary'
                            }`
                          }
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {sub.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>

                  {/* Gallery */}
                  <NavLink
                    to="/gallery"
                    className={({ isActive }) =>
                      `flex items-center justify-between py-3.5 font-semibold text-sm transition-all ${
                        isActive ? 'text-primary' : 'text-slate-600'
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Gallery</span>
                  </NavLink>

                  {/* Notices */}
                  <NavLink
                    to="/notices"
                    className={({ isActive }) =>
                      `flex items-center justify-between py-3.5 font-semibold text-sm transition-all ${
                        isActive ? 'text-primary' : 'text-slate-600'
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Notices</span>
                  </NavLink>

                  {/* Contact */}
                  <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                      `flex items-center justify-between py-3.5 font-semibold text-sm transition-all ${
                        isActive ? 'text-primary' : 'text-slate-600'
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Contact</span>
                  </NavLink>

                </div>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="space-y-3 pt-6 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openModal();
                  }}
                  className="w-full bg-primary hover:bg-primary-light text-white font-semibold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md flex justify-center items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-gold" />
                  Admission Enquiry
                </button>
                <a
                  href={`tel:${settings.primaryPhone}`}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all flex justify-center items-center gap-2 border border-slate-200"
                >
                  <PhoneCall className="w-4 h-4 text-primary" />
                  Call Admission Office
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
