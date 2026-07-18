import React from 'react';
import { motion } from 'framer-motion';
import { Award, FileText, PhoneCall, ArrowDown, CheckCircle2, Navigation, MessageCircle } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { COLLEGE_INFO } from '../constants/data';
import { useAdmissionModal } from '../context/AdmissionContext';

export const AdmissionEnquiry: React.FC = () => {
  const { openModal } = useAdmissionModal();

  const steps = [
    {
      num: "01",
      title: "Submit Admission Enquiry",
      desc: "Fill out our brief online enquiry form with your contact info, academic record, and desired program.",
      icon: <FileText className="w-6 h-6 text-primary" />
    },
    {
      num: "02",
      title: "Advisory Team Connection",
      desc: "Our admissions counselor contacts you via call or email to clarify program details, fees, and eligibility.",
      icon: <PhoneCall className="w-6 h-6 text-primary" />
    },
    {
      num: "03",
      title: "Document Verification",
      desc: "Submit your academic transcripts, certificates, caste forms, and photos for university rule validation.",
      icon: <CheckCircle2 className="w-6 h-6 text-primary" />
    },
    {
      num: "04",
      title: "Visit College Campus",
      desc: "Plan a driving tour to Aliganj, Lucknow, to check classrooms, central library, hostels, and meet the faculty.",
      icon: <Navigation className="w-6 h-6 text-primary" />
    },
    {
      num: "05",
      title: "Admission Confirmation",
      desc: "Secure your enrollment under Bar Council limits, settle the baseline semester fee, and attend the orientation.",
      icon: <Award className="w-6 h-6 text-emerald-500" />
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <section className="relative py-20 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 select-none pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1920&q=80"
            alt="Admission Process"
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
            BATCH {COLLEGE_INFO.admissionYear} ADMISSIONS
          </motion.span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight mt-4">
            Admissions Process & Enquiry
          </h1>
          <div className="h-[3px] bg-gold mx-auto mt-4 w-16" />
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mt-4">
            We operate a streamlined, highly transparent 5-step admission pipeline for our law degree programs.
          </p>
        </div>
      </section>

      {/* Pipeline Section */}
      <section className="py-20 px-4 bg-slate-50/50">
        <div className="max-w-4xl mx-auto">
          
          <SectionHeading
            badge="Admission Pipeline"
            title="Step-by-Step Enrollment Journey"
            subtitle="Understand how you can transition from high school or graduation into our professional LL.B classrooms."
          />

          {/* Stepper Pipeline UI */}
          <div className="mt-16 space-y-6">
            {steps.map((step, idx) => {
              const isLast = idx === steps.length - 1;
              return (
                <div key={idx} className="flex flex-col items-center">
                  
                  {/* Step Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.4 }}
                    className="w-full bg-white border border-slate-100 shadow-2xs rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between hover:shadow-md transition-all"
                  >
                    {/* Left: Number and Title */}
                    <div className="flex items-center gap-4">
                      <span className="text-4xl sm:text-5xl font-serif font-black text-slate-200/80 shrink-0 select-none">
                        {step.num}
                      </span>
                      <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10 shrink-0">
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-slate-800 text-base sm:text-lg leading-snug">
                          {step.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    {/* Right action tag */}
                    <div className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">
                      {isLast ? "COMPLETED" : `STEP ${idx + 1}`}
                    </div>

                  </motion.div>

                  {/* Connective Arrow */}
                  {!isLast && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      className="py-4 text-slate-300"
                    >
                      <ArrowDown className="w-6 h-6 animate-bounce" />
                    </motion.div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Main Premium CTA Section */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-4xl mx-auto bg-primary text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl text-center space-y-6">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-gold bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10">
              FAST-TRACK REGISTRATION
            </span>
            <h3 className="font-serif text-2xl sm:text-3.5xl font-extrabold text-white leading-tight">
              Ready to Lock Your Seat under Bar Council Guidelines?
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              We have limited seat approvals from Lucknow University (120 per course). Speak with our coordinators via phone, WhatsApp, or initialize your digital counseling ticket directly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 relative z-10">
            {/* Primary Admission modal CTA */}
            <button
              onClick={() => openModal()}
              className="w-full sm:w-auto px-8 py-4 bg-gold hover:bg-gold-light text-primary-dark font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
            >
              Initialize Enquiry
            </button>

            {/* Direct Phone Call */}
            <a
              href={`tel:${COLLEGE_INFO.mobile.split(',')[0]}`}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex justify-center items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-gold" />
              <span>Call Counselor</span>
            </a>

            {/* WhatsApp Integration */}
            <a
              href={`https://wa.me/919415012345?text=Hello%20CBG%20Law%20Admissions%20Office,%20I%20am%20interested%20in%20seeking%20admission%20details%20for%20the%202026-27%20session.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex justify-center items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-white fill-white" />
              <span>WhatsApp Us</span>
            </a>
          </div>

        </div>
      </section>
    </div>
  );
};
