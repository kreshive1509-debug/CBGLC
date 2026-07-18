import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Scale,
  Building,
  Award,
  Briefcase,
  GraduationCap,
  BookOpen,
  Tv,
  Search,
  TrendingUp,
  Users,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  ArrowDown,
  Clock,
  ShieldAlert,
  Download,
  Calendar
} from 'lucide-react';
import { useAdmissionModal } from '../context/AdmissionContext';
import { useData } from '../context/DataContext';
import { SEOHelper } from '../components/SEOHelper';
import { BreakingNewsTicker } from '../components/BreakingNewsTicker';
import { SectionHeading } from '../components/SectionHeading';
import { Counter } from '../components/Counter';
import {
  COLLEGE_INFO,
  HIGHLIGHTS,
  VISION_MISSION,
  COURSES,
  WHY_CHOOSE_US,
  FACILITIES,
  FOUNDER_INFO,
  MANAGER_INFO,
  GALLERY_IMAGES,
  NOTICES,
  STATS
} from '../constants/data';

// Helper to map string icon names to Lucide elements
const IconMap: Record<string, React.ComponentType<any>> = {
  Scale,
  Building,
  Award,
  Briefcase,
  GraduationCap,
  BookOpen,
  Tv,
  Search,
  TrendingUp,
  Users
};

export const Home: React.FC = () => {
  const { openModal } = useAdmissionModal();
  const { settings, founder, manager, notices, admissionSettings } = useData();

  // Use admissionSettings if available, otherwise fallback to settings
  const currentAdmissionStatus = admissionSettings?.admissionStatus || settings.admissionStatus;
  const currentAcademicSession = admissionSettings?.academicSession || settings.academicSession;
  const currentAdmissionMessage = admissionSettings?.admissionMessage || settings.admissionMessage;

  // Handle brochure downloading helper (triggers standard alert/guidelines gracefully)
  const handleDownloadBrochure = () => {
    if (settings.brochureUrl && settings.brochureUrl.startsWith('http')) {
      window.open(settings.brochureUrl, '_blank');
    } else {
      alert('The Admissions Brochure is currently being updated by the college. For immediate support, please contact the admission helpdesk.');
    }
  };

  return (
    <div className="overflow-hidden">
      <SEOHelper
        title={settings.metaTitle || `${settings.collegeName} | Top BCI Approved Law College in Lucknow`}
        description={settings.metaDescription || `${settings.collegeName} is a premier law college affiliated with Lucknow University, offering B.A. LL.B (5-year integrated) and LL.B (3-year) programs with state-of-the-art facilities in Aliganj, Lucknow.`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollegeOrUniversity",
          "name": settings.collegeName,
          "alternateName": "CBGLC",
          "url": settings.website,
          "logo": settings.logoUrl,
          "description": settings.metaDescription,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": settings.address,
            "addressLocality": settings.city,
            "addressRegion": settings.state,
            "postalCode": settings.pincode,
            "addressCountry": "IN"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": settings.primaryPhone,
            "contactType": "Admissions",
            "email": settings.officeEmail
          }
        }}
      />
      
      {/* ================================================== */}
      {/* HERO SECTION */}
      {/* ================================================== */}
      <section className="relative h-screen flex items-center justify-center bg-slate-950 text-white overflow-hidden">
        {/* Background Image with elegant slow-zoom effect */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 10, ease: 'easeOut' }}
            src={settings.heroBackgroundUrl || "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=80"}
            alt={`${settings.collegeName} Campus`}
            className="w-full h-full object-cover opacity-35 filter brightness-95"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/60 to-slate-950" />
        </div>

        {/* Content Container */}
        <div className="max-w-5xl mx-auto px-4 z-10 text-center relative flex flex-col items-center justify-center h-full pt-16">
          
          {/* Logo Crest Emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 shadow-xl"
          >
            <img
              src={settings.logoUrl}
              alt={`${settings.collegeName} logo`}
              className="w-14 h-14 object-contain"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Subtitle / Accreditations */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-gold drop-shadow-md flex items-center justify-center gap-1.5 flex-wrap"
          >
            <span>Approved by BCI (Bar Council of India)</span>
            <span className="text-white/40">•</span>
            <span>Affiliated to University of Lucknow</span>
          </motion.p>

          {/* College Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mt-4 leading-tight uppercase"
          >
            {settings.collegeName}
          </motion.h1>

          {/* Taglines */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm sm:text-lg md:text-xl text-slate-300 font-sans tracking-wide mt-4 max-w-2xl font-light"
          >
            {settings.tagline} •{' '}
            {currentAdmissionStatus === 'Open' && (
              <span className="text-white font-semibold underline decoration-gold underline-offset-4">
                {currentAdmissionMessage} {currentAcademicSession}
              </span>
            )}
          </motion.p>

          {/* Buttons Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 w-full max-w-md"
          >
            <button
              onClick={() => openModal()}
              className="w-full sm:w-auto bg-gold hover:bg-gold-light text-primary-dark font-bold text-xs uppercase tracking-widest py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-gold/20 hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
            >
              Admission Enquiry
            </button>
            <button
              onClick={handleDownloadBrochure}
              className="w-full sm:w-auto bg-transparent border-2 border-white/80 hover:bg-white hover:text-slate-900 text-white font-bold text-xs uppercase tracking-widest py-3.5 px-8 rounded-xl transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              {settings.brochureButtonText}
            </button>
          </motion.div>

          {/* Bottom badges/attributes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-6 sm:gap-10 border-t border-white/10 pt-8 mt-12 w-full max-w-xl text-center"
          >
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-2xl text-gold">📍</span>
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest mt-1 text-slate-300">
                Lucknow Campus
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-2xl text-gold">🎓</span>
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest mt-1 text-slate-300">
                Law Programs
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-2xl text-gold">⚖️</span>
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest mt-1 text-slate-300">
                BCI Approved
              </span>
            </div>
          </motion.div>

          {/* Scroll Down Indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white flex flex-col items-center gap-1.5 cursor-pointer text-xs uppercase tracking-widest font-semibold"
            onClick={() => window.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' })}
          >
            <span className="text-[10px]">Scroll Down</span>
            <ArrowDown className="w-4 h-4 text-gold" />
          </motion.div>

        </div>
      </section>
      
      <BreakingNewsTicker />

      {/* ================================================== */}
      {/* QUICK HIGHLIGHTS CARD ROW */}
      {/* ================================================== */}
      <section className="relative z-20 py-12 bg-slate-50 -mt-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HIGHLIGHTS.map((hl, i) => {
              const IconComp = IconMap[hl.iconName] || Scale;
              return (
                <motion.div
                  key={hl.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-slate-100/80 transition-all flex flex-col gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary border border-primary/10 flex items-center justify-center shrink-0">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-extrabold text-slate-800 text-lg">
                      {hl.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                      {hl.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* ABOUT COLLEGE PREVIEW */}
      {/* ================================================== */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Image Column */}
            <div className="lg:col-span-5 relative">
              {/* Elegant dual border decorative layer */}
              <div className="absolute -inset-3 border border-gold/30 rounded-2xl transform rotate-1 translate-x-2 translate-y-2 pointer-events-none" />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-2xl shadow-xl aspect-4/3 lg:aspect-square bg-slate-100"
              >
                <img
                  src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80"
                  alt="Students at Law Library"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>

            {/* Right Information Column */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <SectionHeading
                badge="About Chandra Bhanu Gupta College"
                title="A Legacy Of Academic Jurisprudence"
                align="left"
              />

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 -mt-6">
                Chandra Bhanu Gupta Law College, Lucknow is an institution established to pioneer legal education, foster professional accountability, and instil public responsibility among legal aspirants. Rooted in the noble ideals of Dr. Chandra Bhanu Gupta, the college provides comprehensive legal pathways and advanced research domains affiliated with the <strong>University of Lucknow</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
                <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-gold text-lg shrink-0">🏛️</span>
                  <div>
                    <h4 className="font-serif font-bold text-slate-800 text-sm">Lucknow Affiliated</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Rigorous coursework matching Lucknow University curricula.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-gold text-lg shrink-0">🛡️</span>
                  <div>
                    <h4 className="font-serif font-bold text-slate-800 text-sm">BCI Approved</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Approved under Section 7(1)(i) of the Advocates Act.</p>
                  </div>
                </div>
              </div>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white text-xs font-bold uppercase tracking-widest py-3.5 px-7 rounded-xl shadow-md transition-all group"
              >
                <span>Read More About Us</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* VISION & MISSION SECTION */}
      {/* ================================================== */}
      <section className="py-20 bg-[#F8FAFC] px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            badge="Inspirational Pillars"
            title="The Vision & Mission"
            subtitle="Guiding our academic pathways and shaping the future of global law practice."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            
            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl border border-slate-100 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10">
                  <Award className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-extrabold text-slate-800">{VISION_MISSION.vision.title}</h3>
                <p className="text-gold font-serif italic text-sm leading-relaxed border-l-2 border-gold/40 pl-3">
                  "{VISION_MISSION.vision.quote}"
                </p>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  {VISION_MISSION.vision.description}
                </p>
                <ul className="space-y-2.5 pt-2">
                  {VISION_MISSION.vision.points.map((pt, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-xs text-slate-600 font-semibold">
                      <ChevronRight className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 border-t border-slate-50 pt-4 flex items-center gap-2 text-[10px] uppercase font-bold text-primary tracking-wider">
                <span>Pursuing Academic Integrity</span>
              </div>
            </motion.div>

            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl border border-slate-100 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10">
                  <Scale className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-extrabold text-slate-800">{VISION_MISSION.mission.title}</h3>
                <p className="text-gold font-serif italic text-sm leading-relaxed border-l-2 border-gold/40 pl-3">
                  "{VISION_MISSION.mission.quote}"
                </p>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  {VISION_MISSION.mission.description}
                </p>
                <ul className="space-y-2.5 pt-2">
                  {VISION_MISSION.mission.points.map((pt, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-xs text-slate-600 font-semibold">
                      <ChevronRight className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 border-t border-slate-50 pt-4 flex items-center gap-2 text-[10px] uppercase font-bold text-primary tracking-wider">
                <span>Bridging Theory with Practice</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* COURSES SECTION */}
      {/* ================================================== */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            badge="Professional Programs"
            title="Elite Law Degrees"
            subtitle="Curriculum structured under the dual supervision of the University of Lucknow and the Bar Council of India."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            {COURSES.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white border border-slate-100 rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <span className="bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-primary/10">
                      {course.type}
                    </span>
                    <span className="bg-amber-50 text-amber-800 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-amber-100">
                      Seats: {course.seats}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-extrabold text-slate-900 mt-5">
                    {course.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mt-2.5 text-xs font-bold text-gold uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>Duration: {course.duration}</span>
                  </div>

                  <p className="text-slate-500 text-xs sm:text-sm mt-4 leading-relaxed">
                    {course.shortDesc}
                  </p>

                  <div className="border-t border-slate-50 my-5 pt-5 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-700">Admission Criteria</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      {course.eligibility}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-slate-50 mt-6">
                  <button
                    onClick={() => openModal(course.id)}
                    className="w-full sm:w-1/2 bg-primary hover:bg-primary-light text-white font-bold text-xs uppercase tracking-widest py-3.5 px-5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Apply Now
                  </button>
                  <Link
                    to="/courses"
                    className="w-full sm:w-1/2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-widest py-3.5 px-5 rounded-xl transition-all border border-slate-200 flex items-center justify-center gap-1.5"
                  >
                    <span>View Curriculum</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* WHY CHOOSE US GRID */}
      {/* ================================================== */}
      <section className="py-20 bg-[#F8FAFC] px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            badge="The Excellence Factor"
            title="Why Choose Chandra Bhanu Gupta Law?"
            subtitle="We provide a rigorous ecosystem built with smart technologies and traditional advocacy training."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {WHY_CHOOSE_US.map((item, i) => {
              const IconComp = IconMap[item.icon] || GraduationCap;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/5 text-primary border border-primary/10 flex items-center justify-center mb-4 shrink-0">
                    <IconComp className="w-5.5 h-5.5" />
                  </div>
                  <h4 className="font-serif font-extrabold text-slate-800 text-base">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* FOUNDER & MANAGER MESSAGES */}
      {/* ================================================== */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            badge="Words Of Guidance"
            title="Leadership Messages"
            subtitle="Meet the visionary leaders driving our academic roadmap."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
            
            {/* Founder Message Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl border border-slate-100 flex flex-col md:flex-row gap-6 relative overflow-hidden"
            >
              <div className="w-full md:w-1/3 shrink-0">
                <div className="relative overflow-hidden rounded-2xl border border-slate-100 aspect-square md:aspect-3/4">
                  <img
                    src={founder.googleDrivePhotoUrl || FOUNDER_INFO.image}
                    alt={founder.name}
                    className="w-full h-full object-cover filter contrast-102"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-center md:text-left mt-3.5">
                  <h4 className="font-serif font-bold text-slate-800 text-base">{founder.name}</h4>
                  <p className="text-[10px] text-gold font-bold uppercase tracking-widest mt-0.5">
                    {founder.designation || 'Visionary Founder'}
                  </p>
                </div>
              </div>
              <div className="w-full md:w-2/3 flex flex-col justify-between items-start">
                <div>
                  <span className="text-4xl font-serif text-gold/30 leading-none">“</span>
                  <p className="font-serif italic text-slate-700 text-xs sm:text-sm leading-relaxed -mt-3.5 mb-4 line-clamp-3">
                    {founder.message.substring(0, 120)}...
                  </p>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-5">
                    {founder.message}
                  </p>
                </div>
                <Link
                  to="/founder"
                  className="mt-6 text-xs text-primary hover:text-primary-dark font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors group"
                >
                  <span>Read Full History</span>
                  <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Manager Message Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl border border-slate-100 flex flex-col md:flex-row gap-6 relative overflow-hidden"
            >
              <div className="w-full md:w-1/3 shrink-0">
                <div className="relative overflow-hidden rounded-2xl border border-slate-100 aspect-square md:aspect-3/4">
                  <img
                    src={manager.googleDrivePhotoUrl || MANAGER_INFO.image}
                    alt={manager.name}
                    className="w-full h-full object-cover filter contrast-102"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-center md:text-left mt-3.5">
                  <h4 className="font-serif font-bold text-slate-800 text-base">{manager.name}</h4>
                  <p className="text-[10px] text-gold font-bold uppercase tracking-widest mt-0.5">
                    {manager.designation || 'Manager & Chairperson'}
                  </p>
                </div>
              </div>
              <div className="w-full md:w-2/3 flex flex-col justify-between items-start">
                <div>
                  <span className="text-4xl font-serif text-gold/30 leading-none">“</span>
                  <p className="font-serif italic text-slate-700 text-xs sm:text-sm leading-relaxed -mt-3.5 mb-4 line-clamp-3">
                    {manager.message.substring(0, 120)}...
                  </p>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-5">
                    {manager.message}
                  </p>
                </div>
                <Link
                  to="/manager"
                  className="mt-6 text-xs text-primary hover:text-primary-dark font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors group"
                >
                  <span>Read Full Message</span>
                  <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* FACILITIES PREVIEW */}
      {/* ================================================== */}
      <section className="py-20 bg-[#F8FAFC] px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <SectionHeading
              badge="Campus Infrastructure"
              title="Modern Student Facilities"
              align="left"
            />
            <Link
              to="/facilities"
              className="bg-primary hover:bg-primary-light text-white font-bold text-xs uppercase tracking-widest py-3.5 px-6 rounded-xl shadow-xs transition-all flex items-center gap-2 mt-4 md:mt-0 shrink-0"
            >
              <span>Explore All Facilities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FACILITIES.slice(0, 3).map((fac, i) => (
              <motion.div
                key={fac.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 flex flex-col justify-between"
              >
                <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-200 shrink-0">
                  <img
                    src={fac.image}
                    alt={fac.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-extrabold text-slate-800 text-lg">{fac.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-3">
                      {fac.description}
                    </p>
                  </div>
                  <Link
                    to="/facilities"
                    className="mt-4 text-xs font-bold text-primary hover:text-primary-dark uppercase tracking-widest inline-flex items-center gap-1 group"
                  >
                    <span>Learn details</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* LATEST NOTICES SECTION */}
      {/* ================================================== */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <SectionHeading
              badge="Academic Bulletin"
              title="Latest College Notices"
              align="left"
            />
            <Link
              to="/notices"
              className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-widest py-3 px-6 rounded-xl transition-all shrink-0 mt-4 md:mt-0 flex items-center gap-2"
            >
              <span>View Notices Archive</span>
              <Calendar className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {notices
              .filter((n: any) => n.published !== false)
              .sort((a: any, b: any) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                return new Date(b.publishDate || b.createdAt).getTime() - new Date(a.publishDate || a.createdAt).getTime();
              })
              .slice(0, 4)
              .map((notice, i) => (
                <motion.div
                  key={notice._id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                    notice.pinned
                      ? 'bg-amber-50/50 border-amber-200 shadow-sm shadow-amber-100'
                      : 'bg-white border-slate-100 shadow-xs hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 uppercase">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(notice.publishDate || notice.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          notice.category === 'Admission'
                            ? 'bg-blue-100 text-blue-800'
                            : notice.category === 'Exam'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {notice.category}
                      </span>
                      {notice.pinned && (
                        <span className="bg-red-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md animate-pulse">
                          CRITICAL
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-bold text-slate-800 mt-3.5">
                      {notice.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {notice.description}
                    </p>
                  </div>

                  <Link
                    to={`/notices`}
                    className="mt-4 text-xs font-bold text-primary hover:text-primary-dark uppercase tracking-widest inline-flex items-center gap-1 group"
                  >
                    <span>View Full Announcement</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* STATISTICS AREA */}
      {/* ================================================== */}
      <section className="relative py-16 bg-primary text-white overflow-hidden">
        {/* Background Overlay pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-95" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <span className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-gold tracking-tight">
                  <Counter end={stat.value} />
                </span>
                <span className="text-[10px] sm:text-xs uppercase font-semibold text-slate-200 tracking-wider mt-2.5 max-w-[150px]">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* GALLERY PREVIEW SECTION */}
      {/* ================================================== */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            badge="Campus Life"
            title="Gallery Showcase"
            subtitle="Catch a visual glimpse of our high-tech campus, seminars, and court arguments."
          />

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-12">
            {GALLERY_IMAGES.slice(0, 6).map((img, index) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="relative group overflow-hidden rounded-2xl shadow-sm aspect-4/3 bg-slate-100 border border-slate-100"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                {/* Light hover overlay with descriptions */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                  <span className="text-[10px] uppercase text-gold font-bold tracking-widest">{img.category}</span>
                  <h4 className="text-xs sm:text-sm font-bold truncate mt-1">{img.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-widest py-3.5 px-8 rounded-xl transition-all"
            >
              <span>Explore Full Media Gallery</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* ADMISSION ENQUIRY SECTION */}
      {/* ================================================== */}
      <section id="admission-enquiry-box" className="py-20 bg-slate-50 border-t border-b border-slate-100 px-4">
        <div className="max-w-4xl mx-auto text-center bg-white rounded-3xl p-8 sm:p-12 shadow-md border border-slate-100/80 relative overflow-hidden">
          {/* Subtle gold ribbon style bg decor */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl transform -translate-x-10 translate-y-10" />

          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/5 text-primary rounded-full mb-5">
            <ShieldAlert className="w-6 h-6 text-primary" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3.5xl font-extrabold text-slate-800">
            Admissions Process & Advisory Guide
          </h2>
          <p className="text-xs font-bold uppercase tracking-widest text-gold mt-2">
            Session Academic Year: {COLLEGE_INFO.admissionYear}
          </p>

          {/* Premium Advisory content layout */}
          <div className="max-w-2xl mx-auto bg-slate-50/80 border border-slate-100 p-6 rounded-2xl text-left space-y-4 mt-8 mb-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              🎓 <strong>Admissions Interest:</strong> Interested legal students should first submit an <strong>Admission Enquiry</strong> via the online button or phone line.
            </p>
            <p>
              📞 <strong>Personal Callback:</strong> After reviewing details, the college dean admission counseling panel will personally call eligible candidates for guidance.
            </p>
            <p>
              🏫 <strong>Physical Verification:</strong> Final admissions will be completed <em>strictly</em> after visiting the college campus in Aliganj, Lucknow, undergoing counseling, and checking original documents.
            </p>
          </div>

          {/* Call to actions */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => openModal()}
              className="w-full sm:w-1/2 bg-primary hover:bg-primary-light text-white font-bold text-xs uppercase tracking-widest py-4 px-6 rounded-xl shadow-md shadow-primary/15 hover:shadow-lg transition-all cursor-pointer"
            >
              Admission Enquiry
            </button>
            <a
              href={`tel:${COLLEGE_INFO.phone}`}
              className="w-full sm:w-1/2 bg-transparent border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-widest py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-primary shrink-0" />
              Call Admission Office
            </a>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* CONTACT & MAP PREVIEW */}
      {/* ================================================== */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            badge="Reach Us"
            title="Contact & Location"
            subtitle="Visit our campus located in Lucknow's premium administrative district or connect with us instantly."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12">
            
            {/* Contact Details Cards */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary border border-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-extrabold text-slate-800 text-sm">College Location</h4>
                  <p className="text-slate-500 text-xs leading-relaxed mt-1">{settings.address || COLLEGE_INFO.address}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary border border-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-extrabold text-slate-800 text-sm">Helpline Numbers</h4>
                  <p className="text-slate-500 text-xs leading-relaxed mt-1">
                    Landline: <a href={`tel:${settings.primaryPhone || COLLEGE_INFO.phone}`} className="hover:text-primary transition-colors font-semibold">{settings.primaryPhone || COLLEGE_INFO.phone}</a>
                    {settings.secondaryPhone || COLLEGE_INFO.mobile ? <> <br /> Secondary: <span className="font-semibold">{settings.secondaryPhone || COLLEGE_INFO.mobile}</span></> : null}
                    {settings.whatsAppNumber ? <> <br /> WhatsApp: <span className="font-semibold">{settings.whatsAppNumber}</span></> : null}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary border border-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-extrabold text-slate-800 text-sm">Official Email</h4>
                  <p className="text-slate-500 text-xs leading-relaxed mt-1">
                    <a href={`mailto:${settings.officeEmail || COLLEGE_INFO.email}`} className="hover:text-primary transition-colors font-semibold">{settings.officeEmail || COLLEGE_INFO.email}</a>
                  </p>
                </div>
              </div>

              <Link
                to="/contact"
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-widest py-3.5 px-6 rounded-xl transition-all border border-slate-200"
              >
                <span>Full Contact Options</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </Link>

            </div>

            {/* Map Placeholder Container */}
            <div className="lg:col-span-7">
              <div className="bg-slate-100 rounded-2xl h-[340px] overflow-hidden border border-slate-200 relative flex flex-col items-center justify-center text-center p-6 shadow-xs">
                {/* Background layout decor representing abstract map lines */}
                <div className="absolute inset-0 bg-slate-200/50 flex flex-wrap gap-1 items-center justify-center overflow-hidden opacity-30 select-none pointer-events-none">
                  {Array.from({ length: 120 }).map((_, idx) => (
                    <div key={idx} className="w-8 h-8 border border-slate-300 rounded-xs" />
                  ))}
                </div>

                <div className="z-10 bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-sm border border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-primary/5 text-primary flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-serif font-bold text-slate-800 text-base">Google Maps Location</h4>
                  <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                    Interactive maps and directions will load in this production frame. You can open direct maps using the link below.
                  </p>
                  <a
                    href="https://maps.google.com/?q=Chandra+Bhanu+Gupta+Law+College+Lucknow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 bg-primary hover:bg-primary-light text-white text-[11px] font-bold uppercase tracking-wider py-2 px-4 rounded-lg shadow-sm"
                  >
                    <span>Open in Google Maps</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
