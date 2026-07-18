import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, Shield, FileText, ChevronRight } from 'lucide-react';
import { useAdmissionModal } from '../context/AdmissionContext';
import { useData } from '../context/DataContext';
import { COURSES } from '../constants/data';

export const Footer: React.FC = () => {
  const { openModal } = useAdmissionModal();
  const { settings } = useData();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 font-sans relative">
      {/* Decorative colored top boundary */}
      <div className="h-1.5 bg-gradient-to-r from-primary via-gold to-primary-dark" />

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Crest & Overview */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 p-1 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-primary"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M50 10L15 25V55C15 72.5 30 87.5 50 92C70 87.5 85 72.5 85 55V25L50 10Z"
                    stroke="#0B3C8A"
                    strokeWidth="5"
                    fill="#D4AF37"
                    fillOpacity="0.1"
                  />
                  <path d="M50 30V65M32 40H68" stroke="#D4AF37" strokeWidth="5" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-sm font-extrabold text-primary leading-tight uppercase">
                  {settings.collegeName.split(' ')[0]} {settings.collegeName.split(' ')[1]}
                </span>
                <span className="font-sans text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                  {settings.collegeName.split(' ').slice(2).join(' ')}
                </span>
              </div>
            </Link>
            
            <p className="text-slate-500 text-xs leading-relaxed">
              {settings.footerText || "Approved by the Bar Council of India (BCI), New Delhi and affiliated with the prestigious University of Lucknow. Nurturing legal ethics and advocacy skills."}
            </p>

            {/* Accreditations Badge Grid */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5 text-primary" /> BCI Approved
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                🎓 Lucknow Univ.
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif text-slate-800 font-bold text-sm uppercase tracking-widest mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-gold">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                { label: 'Home', path: '/' },
                { label: 'About College', path: '/about' },
                { label: 'Founder', path: '/founder' },
                { label: 'Manager', path: '/manager' },
                { label: 'Management', path: '/management' },
                { label: 'Admissions', path: '/admission-enquiry' },
                { label: 'FAQs', path: '/faq' },
                { label: 'Facilities', path: '/facilities' },
                { label: 'Gallery', path: '/gallery' },
                { label: 'Notices', path: '/notices' },
                { label: 'Contact Us', path: '/contact' }
              ].map((link) => (
                <div key={link.label}>
                  <Link
                    to={link.path}
                    className="text-slate-500 hover:text-primary text-[11px] sm:text-xs font-semibold flex items-center gap-1 transition-colors group"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-primary transition-colors shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Academic Programs */}
          <div>
            <h4 className="font-serif text-slate-800 font-bold text-sm uppercase tracking-widest mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-gold">
              Law Programs
            </h4>
            <ul className="space-y-3.5">
              {COURSES.map((course) => (
                <li key={course.id}>
                  <Link
                    to={`/courses`}
                    className="text-slate-500 hover:text-primary text-xs font-semibold flex items-center gap-1.5 transition-colors group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-primary transition-colors shrink-0" />
                    <span className="truncate">{course.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={() => openModal()}
                  className="mt-2 text-gold hover:text-gold-dark text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors text-left cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Apply For Admissions {currentYear}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="space-y-5">
            <h4 className="font-serif text-slate-800 font-bold text-sm uppercase tracking-widest mb-2 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-gold">
              Contact Info
            </h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-slate-500 text-xs leading-relaxed">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500 text-xs">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href={`tel:${settings.primaryPhone || (settings as any).phone}`} className="hover:text-primary transition-colors">
                  {settings.primaryPhone || (settings as any).phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-500 text-xs">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href={`mailto:${settings.officeEmail || (settings as any).email}`} className="hover:text-primary transition-colors">
                  {settings.officeEmail || (settings as any).email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-500 text-xs">
                <Globe className="w-4 h-4 text-primary shrink-0" />
                <a href={settings.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  {settings.website}
                </a>
              </li>
            </ul>
          </div>
          
        </div>

        {/* Separator */}
        <div className="border-t border-slate-100 my-10" />

        {/* Footer Bottom area */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          
          {/* Social Media icons */}
          <div className="flex items-center gap-3">
            {[
              { name: 'Facebook', url: settings.facebook },
              { name: 'Instagram', url: settings.instagram },
              { name: 'LinkedIn', url: settings.linkedin },
              { name: 'YouTube', url: settings.youtube }
            ].map((network) => {
              if (!network.url) return null;
              return (
                <a
                  key={network.name}
                  href={network.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-50 hover:bg-primary hover:text-white text-slate-400 flex items-center justify-center border border-slate-100 transition-all text-xs font-semibold"
                  title={`Follow us on ${network.name}`}
                >
                  {network.name[0]}
                </a>
              );
            })}
            <Link to="/admin/login" className="text-slate-300 hover:text-primary text-[10px] uppercase font-bold ml-2 transition-colors">
              Admin
            </Link>
          </div>

          {/* Legal / Copyrights */}
          <div className="text-slate-400 text-xs space-y-1">
            <p>
              {settings.copyrightText || `© ${currentYear} All Rights Reserved by ${settings.collegeName}`}
            </p>
            {settings.designedBy && (
              <p className="text-[10px] opacity-75">
                {settings.designedBy}
              </p>
            )}
          </div>

        </div>
      </div>
    </footer>
  );
};
