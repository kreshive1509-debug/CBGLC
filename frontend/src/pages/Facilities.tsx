import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Scale, Award, Home as House, Trophy, Tv, CheckCircle2, Sparkles } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { FACILITIES, COLLEGE_INFO } from '../constants/data';
import { useData } from '../context/DataContext';

export const Facilities: React.FC = () => {
  const { settings } = useData();

  const facilities = Array.isArray(settings.facilities) && settings.facilities.length
    ? settings.facilities
    : FACILITIES;

  const getFacilityIcon = (id: string) => {
    switch (id) {
      case 'fac-library':
      case 'library':
        return <BookOpen className="w-5 h-5 text-primary" />;
      case 'fac-mootcourt':
      case 'mootcourt':
        return <Scale className="w-5 h-5 text-primary" />;
      case 'fac-computerlab':
      case 'computerlab':
        return <Tv className="w-5 h-5 text-primary" />;
      case 'fac-seminarhall':
      case 'seminarhall':
        return <Award className="w-5 h-5 text-primary" />;
      case 'fac-hostel':
      case 'hostel':
        return <House className="w-5 h-5 text-primary" />;
      case 'fac-sports':
      case 'sports':
        return <Trophy className="w-5 h-5 text-primary" />;
      default:
        return <Sparkles className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="relative overflow-hidden py-20 bg-slate-950 text-white">
        <div className="absolute inset-0 select-none pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.22),transparent_35%),linear-gradient(180deg,rgba(15,23,42,0.92),rgba(15,23,42,0.82))]" />
          <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold uppercase tracking-[0.35em] text-gold bg-white/5 border border-white/10 px-4 py-1.5 rounded-full"
          >
            Campus Resources
          </motion.span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight mt-4">
            World-Class Infrastructure
          </h1>
          <div className="h-[3px] bg-gold mx-auto mt-4 w-20" />
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mt-4 leading-relaxed">
            {settings.collegeName} is designed as a polished academic journey where every facility supports litigation training, focused study, and student well-being.
          </p>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            badge="Infrastructure Roadmap"
            title="A Premium Campus Journey"
            subtitle="Each stop represents a carefully designed student experience, arranged on a visual roadmap to feel intentional and elevated."
          />

          <div className="relative mt-16">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent md:-translate-x-px" />

            <div className="space-y-10 md:space-y-14">
              {facilities.map((fac: any, index: number) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    key={fac.id || index}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.55, delay: index * 0.04 }}
                    className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8"
                  >
                    <div className={`hidden md:block ${isEven ? 'md:order-1' : 'md:order-3'}`} />

                    <div className="relative z-10 md:order-2 flex items-center justify-start md:justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-200/60">
                        <div className="h-3 w-3 rounded-full bg-gold" />
                      </div>
                    </div>

                    <div className={`${isEven ? 'md:order-3 md:pl-8' : 'md:order-1 md:pr-8'} relative`}>
                      <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(212,175,55,0.06),transparent_40%)]" />
                        <div className="relative z-10">
                          <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/5 border border-primary/10">
                              {getFacilityIcon(fac.id || fac.icon || fac.iconName || '')}
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                                Roadmap Stop {String(index + 1).padStart(2, '0')}
                              </p>
                              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">
                                {fac.title || fac.name}
                              </h2>
                            </div>
                          </div>

                          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
                            {fac.description || fac.shortDescription}
                          </p>

                          <p className="mt-4 text-slate-500 text-xs sm:text-sm leading-relaxed bg-slate-50/90 p-4 rounded-2xl border border-slate-100">
                            {fac.details || fac.longDescription}
                          </p>

                          <div className="mt-5 grid grid-cols-2 gap-3">
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
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
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
            There is no substitute for experiencing our state-of-the-art facilities firsthand. Bring your family and academic documents to our Chandrawal, Lucknow location for physical validation, counseling, and campus tour with our coordinators.
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
