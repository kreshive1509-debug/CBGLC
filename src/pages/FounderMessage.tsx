import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Award, BookOpen, Quote, Shield, Calendar, Lightbulb, GraduationCap } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAdmissionModal } from '../context/AdmissionContext';
import { FOUNDER_INFO } from '../constants/data';

export const FounderMessage: React.FC = () => {
  const { openModal } = useAdmissionModal();
  const { settings, founder } = useData();

  const milestones = [
    {
      year: "1960s - 1980s",
      title: "Championing Public Service",
      desc: "Dr. Chandra Bhanu Gupta dedicated decades to shaping academic policy, legal reforms, and educational empowerment structures across North India."
    },
    {
      year: "2005",
      title: "Founding CBGLC",
      desc: `Envisioned and established ${settings.collegeName} in Aliganj, Lucknow, with the noble goal of making elite professional legal education accessible.`
    },
    {
      year: "2012",
      title: "Moot Courtroom & Infrastructure Launch",
      desc: "Supervised the creation of our modern wood-paneled championship Moot Courtroom and digital law library wings to ensure practical exposure."
    },
    {
      year: "Legacy & Beyond",
      title: "Upholding Justice and Ethics",
      desc: "Our alumni community now spans judicial magistrates, high court advocates, corporate counsel leaders, and public interest litigants."
    }
  ];

  const visionPillars = [
    {
      title: "Analytical Jurisprudence",
      desc: "Enabling students to dissect statutory language and comprehend policy intentions rather than memorizing laws.",
      icon: <Scale className="w-6 h-6 text-primary" />
    },
    {
      title: "Compulsory Ethics & Integrity",
      desc: "Ensuring that professional success is anchored on unwavering moral values, community service, and legal aid.",
      icon: <Shield className="w-6 h-6 text-primary" />
    },
    {
      title: "Inclusive Empowerment",
      desc: "Creating extensive scholarship frameworks and counseling desks to assist students from all socio-economic backgrounds.",
      icon: <GraduationCap className="w-6 h-6 text-primary" />
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Page Header Banner */}
      <section className="relative py-20 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 select-none pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1920&q=80"
            alt="Founder Vision"
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
            <Award className="w-3.5 h-3.5 text-gold" /> OUR FOUNDING LEGACY
          </motion.span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight mt-4">
            Founder's Message
          </h1>
          <div className="h-[3px] bg-gold mx-auto mt-4 w-16" />
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mt-4">
            Intellectual integrity, absolute pursuit of excellence, and public interest advocacy.
          </p>
        </div>
      </section>

      {/* Message and Image Block */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Photo & Card Column */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative group w-full max-w-[320px]">
                <div className="absolute -inset-4 border-2 border-dashed border-gold/30 rounded-3xl transform -rotate-2 group-hover:rotate-0 transition-transform duration-500 pointer-events-none" />
                <div className="relative overflow-hidden rounded-2xl shadow-xl aspect-3/4 bg-slate-100">
                  <img
                    src={founder.googleDrivePhotoUrl || FOUNDER_INFO.image}
                    alt={founder.name}
                    className="w-full h-full object-cover filter contrast-102 hover:scale-103 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
                </div>
              </div>

              {/* Founder Information Details */}
              <div className="text-center mt-6 space-y-1">
                <h2 className="font-serif font-extrabold text-slate-900 text-2xl">{founder.name}</h2>
                <p className="text-xs text-gold font-bold uppercase tracking-widest">{founder.designation}</p>
                <p className="text-xs text-slate-400 font-semibold">{settings.collegeName}</p>
              </div>

              {/* Advisory Quote Box */}
              <div className="mt-8 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-3 max-w-[320px]">
                <Quote className="w-6 h-6 text-gold mx-auto opacity-60" />
                <p className="text-xs text-slate-600 font-semibold italic leading-relaxed">
                  "Advocates carry legal precision in their minds and human values in their hearts."
                </p>
              </div>
            </div>

            {/* Right Message Content Column */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Message Introduction */}
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                  EDITORIAL DESPATCH
                </span>
                <h3 className="font-serif text-2xl sm:text-3.5xl font-extrabold text-slate-800 leading-tight">
                  Legal Education as an Instrument of Ethical Leadership
                </h3>
                <div className="h-[2px] bg-gold w-16" />
              </div>

              {/* Long Professional Message Paragraphs */}
              <div className="prose prose-slate text-sm sm:text-base text-slate-600 leading-relaxed space-y-6">
                <p className="font-semibold text-slate-800 text-base sm:text-lg">
                  {founder.message.substring(0, 180)}...
                </p>
                <p className="whitespace-pre-line">
                  {founder.message}
                </p>
                <p>
                  At {settings.collegeName}, we understand that a lawyer's responsibility goes beyond defending corporate clients or winning technical briefs. A true legal professional serves as a guardian of civic freedoms, a policymaker, and a voice for those seeking equity. For this reason, we have designed our training models to emphasize active social outreach, judicial preparation, and hands-on legal aid.
                </p>
                <p>
                  I invite every young aspirant to step into our campus and join us in building an illustrious professional pathway. We provide the finest textbooks, digital search databases, and clinical courtroom environments required to transition your dedication into world-class legal advocacy.
                </p>
              </div>

              {/* Vision for the Institution Grid */}
              <div className="pt-6 border-t border-slate-100 space-y-6">
                <h4 className="font-serif font-extrabold text-slate-800 text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-gold" /> Institutional Vision & Commitments
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {visionPillars.map((pillar, idx) => (
                    <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100/80 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs border border-slate-100 shrink-0">
                        {pillar.icon}
                      </div>
                      <h5 className="font-serif font-bold text-slate-800 text-sm leading-tight">{pillar.title}</h5>
                      <p className="text-slate-500 text-[11px] leading-relaxed">{pillar.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Milestones & Timeline Section */}
      <section className="py-20 bg-slate-50 border-t border-b border-slate-100 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-gold bg-primary px-3.5 py-1 rounded-full">
              CHRONICLE OF EXCELLENCE
            </span>
            <h3 className="font-serif text-2xl sm:text-3.5xl font-extrabold text-slate-900">
              Founder's Historical Milestone
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              A chronological overview representing the foundation, updates, and milestones guided by our visionary leadership.
            </p>
          </div>

          {/* Timeline UI */}
          <div className="relative border-l-2 border-slate-200 ml-4 md:ml-32 space-y-12">
            {milestones.map((milestone, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative pl-6 md:pl-10"
              >
                {/* Year tag positioned on left for wider screens */}
                <div className="hidden md:block absolute right-full mr-10 top-0 text-right">
                  <span className="font-serif font-extrabold text-primary text-lg">{milestone.year}</span>
                </div>
                
                {/* Timeline Circle Bullet */}
                <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full border-4 border-white bg-gold shadow-sm" />

                {/* Content Box */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-2">
                  <span className="inline-block md:hidden font-serif font-extrabold text-primary text-sm mb-1">
                    {milestone.year}
                  </span>
                  <h4 className="font-serif font-bold text-slate-800 text-base leading-tight">
                    {milestone.title}
                  </h4>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    {milestone.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call To Action Banner */}
      <section className="py-20 bg-white px-4 text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-800">
            Join the {settings.collegeName.split(' ')[0]} Law Family
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Take the first step toward a prestigious legal career guided by our founder's core principles. Connect with our administrative desk today.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => openModal()}
              className="px-8 py-3.5 bg-primary hover:bg-primary-light text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all cursor-pointer"
            >
              Initiate Enquiry
            </button>
            <a
              href={`tel:${settings.primaryPhone}`}
              className="px-8 py-3.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
            >
              Call Admissions Desk
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
