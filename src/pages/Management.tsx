import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Landmark, Users, Briefcase, GraduationCap, PhoneCall } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { COLLEGE_INFO } from '../constants/data';
import { useAdmissionModal } from '../context/AdmissionContext';
import { useData } from '../context/DataContext';

export const Management: React.FC = () => {
  const { openModal } = useAdmissionModal();
  const { leaders } = useData();

  const boardMembers = [
    {
      name: "Hon'ble Justice (Retd.) S.K. Sen",
      designation: "President, Governing Board",
      role: "President",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      desc: "Former Hon'ble Judge of the Allahabad High Court, providing supreme judicial oversight, constitutional values, and academic integrity guidance to the Governing Council.",
      icon: <Landmark className="w-5 h-5 text-gold" />
    },
    {
      name: "Dr. Ananya Gupta",
      designation: "Vice President, Governing Board",
      role: "Vice President",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      desc: "Prominent educator and legal sociologist with 18+ years of experience, steering administrative protocols, university affiliations, and inclusive scholarship campaigns.",
      icon: <Award className="w-5 h-5 text-gold" />
    },
    {
      name: "Dr. Chandra Bhanu Gupta",
      designation: "Founder & Secretary",
      role: "Secretary",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      desc: "Visionary founder of the law college, directing statutory approvals under BCI rules, strategic growth initiatives, and core public-interest legal clinics.",
      icon: <Shield className="w-5 h-5 text-gold" />
    },
    {
      name: "Shri Aditya K. Gupta",
      designation: "Manager & Governing Council Chairperson",
      role: "Manager",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
      desc: "Directing campus modernizations, corporate litigation tie-ups, placement drives, e-libraries, and air-conditioned lecture hall infrastructure implementations.",
      icon: <Briefcase className="w-5 h-5 text-gold" />
    },
    {
      name: "Shri Ramesh K. Srivastava",
      designation: "Treasurer & Financial Advisor",
      role: "Treasurer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      desc: "Managing university budget structures, institutional audits, scholarship allocations, and infrastructural investments to ensure operational health.",
      icon: <Users className="w-5 h-5 text-gold" />
    },
    {
      name: "Prof. (Dr.) S. C. Mishra",
      designation: "Principal & Dean of Law",
      role: "Principal",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
      desc: "Leading active academics, research journal publications, student disciplinary guidelines, and moot court societies under strict Lucknow University norms.",
      icon: <GraduationCap className="w-5 h-5 text-gold" />
    },
    {
      name: "Prof. (Dr.) Ramesh Chandra",
      designation: "Academic Director",
      role: "Director",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      desc: "Former Vice-Chancellor of Lucknow University, monitoring curriculum upgrades, faculty selections, and regional judicial services prep cells.",
      icon: <GraduationCap className="w-5 h-5 text-gold" />
    }
  ];

  const displayedLeaders = leaders && leaders.length > 0
    ? leaders.filter((leader: any) => leader.published !== false)
    : boardMembers;

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <section className="relative py-20 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 select-none pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
            alt="Management Board"
            className="w-full h-full object-cover opacity-15 filter brightness-75"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-950/80" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold uppercase tracking-widest text-gold bg-white/5 border border-white/10 px-4 py-1.5 rounded-full"
          >
            ADMINISTRATIVE DESK
          </motion.span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight mt-4">
            Governing Council & Management
          </h1>
          <div className="h-[3px] bg-gold mx-auto mt-4 w-16" />
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mt-4">
            Meet the distinguished administrative leaders, advisors, and jurists steering our law programs to global excellence.
          </p>
        </div>
      </section>

      {/* Management Grid Listing */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          
          <SectionHeading
            badge="Institutional Board"
            title="Our Executive Advisors"
            subtitle="Providing structural support, quality control, and ethical directions for future advocacy champions."
          />

          {/* Cards Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {displayedLeaders.map((member: any, index: number) => {
              const image = member.photoUrl || member.image;
              const name = member.fullName || member.name;
              const designation = member.designation;
              const desc = member.editorialMessage || member.desc;
              const icon = member.icon || <Users className="w-5 h-5 text-gold" />;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  
                  {/* Visual Top block */}
                  <div>
                    {/* Photo with overlay banner */}
                    <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                      <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover filter contrast-102 hover:scale-103 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md flex items-center gap-1.5 shadow-md">
                        {icon}
                        <span>{member.role}</span>
                      </div>
                    </div>

                    {/* Header Title Information */}
                    <div className="p-6 pb-2">
                      <h3 className="font-serif text-lg sm:text-xl font-extrabold text-slate-800 leading-snug">
                        {name}
                      </h3>
                      <p className="text-xs text-gold font-bold uppercase tracking-wider mt-1">
                        {designation}
                      </p>
                    </div>
                  </div>

                {/* Description and Footer text */}
                <div className="p-6 pt-0 space-y-4">
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                    {desc}
                  </p>
                  <div className="h-[1px] bg-slate-100 w-full" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Chandra Bhanu Gupta Law College
                  </p>
                </div>

              </motion.div>
            );
          })}
          </div>

        </div>
      </section>

      {/* Advisory Call-out section */}
      <section className="py-20 bg-slate-50 border-t border-b border-slate-100 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="w-12 h-12 rounded-full bg-primary/5 text-primary flex items-center justify-center mx-auto">
            <PhoneCall className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">
            Connect With Our Administrative Desk
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Need details on college operations, university regulations, hostel reservations, or financial aid programs? Speak directly to our administration during academic business hours.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => openModal()}
              className="px-8 py-3.5 bg-primary hover:bg-primary-light text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all cursor-pointer"
            >
              Initiate Enquiry
            </button>
            <a
              href={`tel:${COLLEGE_INFO.phone}`}
              className="px-8 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
            >
              Call Registrar Office
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
