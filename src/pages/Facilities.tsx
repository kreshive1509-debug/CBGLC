import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Scale, Award, Home as House, Trophy, Tv, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { FACILITIES, COLLEGE_INFO } from '../constants/data';

export const Facilities: React.FC = () => {
  // Map icons to facility IDs or titles
  const getFacilityIcon = (id: string) => {
    switch (id) {
      case 'fac-library':
        return <BookOpen className="w-6 h-6 text-primary" />;
      case 'fac-mootcourt':
        return <Scale className="w-6 h-6 text-primary" />;
      case 'fac-computerlab':
        return <Tv className="w-6 h-6 text-primary" />;
      case 'fac-seminarhall':
        return <Award className="w-6 h-6 text-primary" />;
      case 'fac-hostel':
        return <House className="w-6 h-6 text-primary" />;
      case 'fac-sports':
        return <Trophy className="w-6 h-6 text-primary" />;
      default:
        return <BookOpen className="w-6 h-6 text-primary" />;
    }
  };

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="relative py-20 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 select-none pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1920&q=80"
            alt="Facilities Arena"
            className="w-full h-full object-cover opacity-20 filter brightness-75"
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
            CAMPUS RESOURCES
          </motion.span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight mt-4">
            World-Class Infrastructure
          </h1>
          <div className="h-[3px] bg-gold mx-auto mt-4 w-16" />
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mt-4">
            An environment meticulously engineered to support rich academic litigation, active peer debates, and athletic wellness.
          </p>
        </div>
      </section>

      {/* Facilities Detailed Listing Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          
          <div className="space-y-16">
            {FACILITIES.map((fac, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={fac.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col lg:flex-row gap-10 items-center justify-between ${
                    isEven ? '' : 'lg:flex-row-reverse'
                  }`}
                >
                  
                  {/* Image Block */}
                  <div className="w-full lg:w-1/2 relative shrink-0">
                    <div className="absolute -inset-3 border border-gold/20 rounded-2xl transform rotate-1 translate-x-1 translate-y-1 pointer-events-none" />
                    <div className="relative overflow-hidden rounded-2xl shadow-lg aspect-16/10 sm:aspect-16/9 lg:aspect-4/3 bg-slate-100">
                      <img
                        src={fac.image}
                        alt={fac.title}
                        className="w-full h-full object-cover hover:scale-103 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Content Block */}
                  <div className="w-full lg:w-1/2 space-y-5">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/5 border border-primary/10">
                      {getFacilityIcon(fac.id)}
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">
                      {fac.title}
                    </h2>

                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                      {fac.description}
                    </p>

                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100/80">
                      {fac.details}
                    </p>

                    {/* Facility Bullet point details for added depth */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Air-conditioned
                      </span>
                      <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> High-speed Wi-Fi
                      </span>
                      <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> CCTV Secured
                      </span>
                      <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Student Counselors
                      </span>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Advisory Visit Section */}
      <section className="py-20 bg-slate-50 border-t border-b border-slate-100 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/5 text-primary">
            <Scale className="w-6 h-6 text-primary" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">
            Schedule A Physical Campus Tour
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            There is no substitute for experiencing our state-of-the-art facilities firsthand. Bring your family and academic documents to our Aliganj, Lucknow location for physical validation, counseling, and campus tour with our coordinators.
          </p>
          <div className="pt-2">
            <a
              href="https://maps.google.com/?q=Chandra+Bhanu+Gupta+Law+College+Lucknow"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white text-xs font-bold uppercase tracking-widest py-3.5 px-8 rounded-xl shadow-md transition-all"
            >
              Get Directions to Campus
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
