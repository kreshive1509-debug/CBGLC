import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldAlert, Cpu, Sparkles, BookOpen, GraduationCap, Users, BookmarkCheck } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAdmissionModal } from '../context/AdmissionContext';
import { MANAGER_INFO } from '../constants/data';

export const ManagerMessage: React.FC = () => {
  const { openModal } = useAdmissionModal();
  const { settings, manager } = useData();

  const leadershipFrameworks = [
    {
      title: "Digital Infrastructure Expansion",
      desc: "Introducing computerized e-libraries running 24/7 SSC Online, LexisNexis search desks, and fully air-conditioned smart lecture screens.",
      icon: <Cpu className="w-6 h-6 text-primary" />
    },
    {
      title: "High-End Corporate Connections",
      desc: "Establishing academic collaborations and internships with Tier-1 law corporations and high court panels for early practical experience.",
      icon: <Users className="w-6 h-6 text-primary" />
    },
    {
      title: "Judicial Coaching Programs",
      desc: "Running targeted judicial training assemblies and civil services preparations (PCS-J) directed by senior guest jurists.",
      icon: <GraduationCap className="w-6 h-6 text-primary" />
    }
  ];

  const collegeVisions = [
    "Integrating emerging legal topics such as Cyber Statutes, Intellectual Property, and Environmental Guidelines.",
    "Upgrading physical campuses with championship arenas, research cells, and high-speed Wi-Fi infrastructures.",
    "Maintaining highly student-friendly feedback desks, counselors, and separate boarding houses.",
    "Promoting regional student publications and national moot tournament registrations."
  ];

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Page Header Banner */}
      <section className="relative py-20 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 select-none pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80"
            alt="Manager Guidance"
            className="w-full h-full object-cover opacity-15 filter brightness-75"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-950/80" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold uppercase tracking-widest text-gold bg-white/5 border border-white/10 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold" /> ACADEMIC OPERATIONS
          </motion.span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight mt-4">
            Manager's Message
          </h1>
          <div className="h-[3px] bg-gold mx-auto mt-4 w-16" />
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mt-4">
            Fusing traditional legal values with modern tech-driven legal research.
          </p>
        </div>
      </section>

      {/* Message and Image Block */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Photo Column */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative group w-full max-w-[320px]">
                <div className="absolute -inset-4 border-2 border-dashed border-gold/30 rounded-3xl transform rotate-2 group-hover:rotate-0 transition-transform duration-500 pointer-events-none" />
                <div className="relative overflow-hidden rounded-2xl shadow-xl aspect-3/4 bg-slate-100">
                  <img
                    src={manager.googleDrivePhotoUrl || MANAGER_INFO.image}
                    alt={manager.name}
                    className="w-full h-full object-cover filter contrast-102 hover:scale-103 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
                </div>
              </div>

              {/* Manager Info Details */}
              <div className="text-center mt-6 space-y-1">
                <h2 className="font-serif font-extrabold text-slate-900 text-2xl">{manager.name}</h2>
                <p className="text-xs text-gold font-bold uppercase tracking-widest">{manager.designation}</p>
                <p className="text-xs text-slate-400 font-semibold">Governing Council, Lucknow</p>
              </div>

              {/* Support Hotline Widget */}
              <div className="mt-8 p-6 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-3 max-w-[320px] w-full">
                <BookOpen className="w-5 h-5 text-primary mx-auto" />
                <h4 className="font-serif font-bold text-slate-800 text-xs uppercase tracking-wider">Dean Office Helplines</h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Connect with our counselors to resolve queries on course details, eligibility, or fee frameworks.
                </p>
                <p className="text-xs font-bold text-primary">{settings.primaryPhone}</p>
              </div>
            </div>

            {/* Right Message Content Column */}
            <div className="lg:col-span-8 space-y-8">
              
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                  EXECUTIVE BRIEFING
                </span>
                <h3 className="font-serif text-2xl sm:text-3.5xl font-extrabold text-slate-800 leading-tight">
                  Bridging the Gap Between Classroom Theory and Courtroom Practice
                </h3>
                <div className="h-[2px] bg-gold w-16" />
              </div>

              {/* Long Message paragraphs */}
              <div className="prose prose-slate text-sm sm:text-base text-slate-600 leading-relaxed space-y-6">
                <p className="font-semibold text-slate-800 text-base sm:text-lg">
                  {manager.message.substring(0, 180)}...
                </p>
                <p className="whitespace-pre-line">
                  {manager.message}
                </p>
                <p>
                  As the manager, my focus is to provide students with the absolute best infrastructure possible. {settings.collegeName} has consistently invested in advanced classrooms, high-speed Wi-Fi, air-conditioned lecture spaces, and separate student hostels. We believe that an excellent educational experience is supported by comfortable boarding facilities and state-of-the-art research zones.
                </p>
                <p>
                  We are extremely proud of our judicial advisors and professors who bring years of classroom and courtroom experience to our students. By conducting regular championship mock trials, legal seminars, and public aid exercises, we ensure that you develop deep legal precision, high eloquence, and analytical power.
                </p>
              </div>

              {/* Academic Leadership Section */}
              <div className="pt-6 border-t border-slate-100 space-y-6">
                <h4 className="font-serif font-extrabold text-slate-800 text-lg">
                  Academic Leadership Initiatives
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {leadershipFrameworks.map((framework, idx) => (
                    <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100/80 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs border border-slate-100 shrink-0">
                        {framework.icon}
                      </div>
                      <h5 className="font-serif font-bold text-slate-800 text-sm leading-tight">{framework.title}</h5>
                      <p className="text-slate-500 text-[11px] leading-relaxed">{framework.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Future Vision Points Section */}
      <section className="py-20 bg-slate-50 border-t border-b border-slate-100 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          
          <div className="md:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-gold bg-primary px-3 py-1 rounded-full">
              OPERATIONAL ROADMAP
            </span>
            <h3 className="font-serif text-2xl sm:text-3.5xl font-extrabold text-slate-900 leading-tight">
              Our Vision for the Next Academic Decade
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Supervising updates to ensure our academic procedures match global standards of corporate litigation and legal wisdom.
            </p>
          </div>

          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
            {collegeVisions.map((vision, index) => (
              <div key={index} className="flex items-start gap-3">
                <BookmarkCheck className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-normal">{vision}</p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};
