import React from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, ArrowRight } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { CmsImage } from '../components/CmsImage';
import { COLLEGE_INFO, FOUNDER_INFO, MANAGER_INFO } from '../constants/data';
import { useAdmissionModal } from '../context/AdmissionContext';
import { useData } from '../context/DataContext';

export const Management: React.FC = () => {
  const { openModal } = useAdmissionModal();
  const { leaders, founder, manager, backendOffline } = useData();

  const coreLeaderNames = [
    founder?.name || FOUNDER_INFO.name,
    manager?.name || MANAGER_INFO.name,
  ].map((value) => value.trim().toLowerCase());

  const resolveMembership = (leader: any) => {
    const explicitMembership = String(leader?.membership || '').trim();
    if (explicitMembership) return explicitMembership;

    const message = String(leader?.editorialMessage || '').trim();
    const match = message.match(/\(([^()]+)\)\s*$/);
    if (match?.[1]) return match[1].trim();

    const designation = String(leader?.designation || '').trim().toLowerCase();
    if (designation.includes('founder')) return 'Founder';
    if (designation.includes('manager')) return 'Manager';
    return 'Member';
  };

  const councilFallback = [
    { name: "Hon'ble Justice (Retd.) S.K. Sen", designation: 'President, Governing Board', membership: 'Chairperson' },
    { name: 'Dr. Ananya Gupta', designation: 'Vice President, Governing Board', membership: 'Vice Chair' },
    { name: 'Dr. Chandra Bhanu Gupta', designation: 'Founder & Secretary', membership: 'Founder' },
    { name: 'Shri Aditya K. Gupta', designation: 'Manager & Governing Council Chairperson', membership: 'Manager' },
    { name: 'Shri Ramesh K. Srivastava', designation: 'Treasurer & Financial Advisor', membership: 'Member' },
    { name: 'Prof. (Dr.) S. C. Mishra', designation: 'Principal & Dean of Law', membership: 'Member' },
    { name: 'Prof. (Dr.) Ramesh Chandra', designation: 'Academic Director', membership: 'Member' },
  ];

  const councilMembers = (leaders && leaders.length > 0 ? leaders.filter((leader: any) => leader.published !== false) : councilFallback)
    .filter((leader: any) => {
      const name = String(leader.fullName || leader.name || '').trim().toLowerCase();
      const membership = resolveMembership(leader).toLowerCase();
      const designation = String(leader.designation || '').trim().toLowerCase();
      return !coreLeaderNames.includes(name) && membership !== 'founder' && membership !== 'manager' && !designation.includes('founder') && !designation.includes('manager');
    })
    .sort((a: any, b: any) => {
      const aCreated = new Date(a.createdAt || 0).getTime();
      const bCreated = new Date(b.createdAt || 0).getTime();
      return aCreated - bCreated || (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
    });

  return (
    <div className="bg-white min-h-screen">
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
            Administrative Desk
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

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-16">
          <SectionHeading
            badge="Leadership Messages"
            title="Founder and Manager"
            subtitle="The founder and manager keep their photo-based leadership cards. The rest of the council is listed in a table for clarity."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl border border-slate-100 flex flex-col md:flex-row gap-6 relative overflow-hidden"
            >
              <div className="w-full md:w-1/3 shrink-0">
                <div className="relative overflow-hidden rounded-2xl border border-slate-100 aspect-square md:aspect-3/4 bg-slate-100">
                  <CmsImage
                    src={founder?.googleDrivePhotoUrl || ''}
                    alt={founder?.name || FOUNDER_INFO.name}
                    className="w-full h-full object-cover"
                    containerClassName="relative overflow-hidden w-full h-full bg-slate-100"
                    placeholderText="Image unavailable"
                    isOffline={backendOffline}
                  />
                </div>
                <div className="text-center md:text-left mt-3.5">
                  <h4 className="font-serif font-bold text-slate-800 text-base">{founder?.name || FOUNDER_INFO.name}</h4>
                  <p className="text-[10px] text-gold font-bold uppercase tracking-widest mt-0.5">
                    {founder?.designation || FOUNDER_INFO.title}
                  </p>
                </div>
              </div>
              <div className="w-full md:w-2/3 flex flex-col justify-between items-start">
                <div>
                  <span className="text-4xl font-serif text-gold/30 leading-none">"</span>
                  <p className="font-serif italic text-slate-700 text-xs sm:text-sm leading-relaxed -mt-3.5 mb-4 line-clamp-3">
                    {founder?.message?.substring(0, 120) || FOUNDER_INFO.message.substring(0, 120)}...
                  </p>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-5">
                    {founder?.message || FOUNDER_INFO.message}
                  </p>
                </div>
                <a
                  href="/founder"
                  className="mt-6 text-xs text-primary hover:text-primary-dark font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors group"
                >
                  <span>Read Full History</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl border border-slate-100 flex flex-col md:flex-row gap-6 relative overflow-hidden"
            >
              <div className="w-full md:w-1/3 shrink-0">
                <div className="relative overflow-hidden rounded-2xl border border-slate-100 aspect-square md:aspect-3/4 bg-slate-100">
                  <CmsImage
                    src={manager?.googleDrivePhotoUrl || ''}
                    alt={manager?.name || MANAGER_INFO.name}
                    className="w-full h-full object-cover"
                    containerClassName="relative overflow-hidden w-full h-full bg-slate-100"
                    placeholderText="Image unavailable"
                    isOffline={backendOffline}
                  />
                </div>
                <div className="text-center md:text-left mt-3.5">
                  <h4 className="font-serif font-bold text-slate-800 text-base">{manager?.name || MANAGER_INFO.name}</h4>
                  <p className="text-[10px] text-gold font-bold uppercase tracking-widest mt-0.5">
                    {manager?.designation || MANAGER_INFO.title}
                  </p>
                </div>
              </div>
              <div className="w-full md:w-2/3 flex flex-col justify-between items-start">
                <div>
                  <span className="text-4xl font-serif text-gold/30 leading-none">"</span>
                  <p className="font-serif italic text-slate-700 text-xs sm:text-sm leading-relaxed -mt-3.5 mb-4 line-clamp-3">
                    {manager?.message?.substring(0, 120) || MANAGER_INFO.message.substring(0, 120)}...
                  </p>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-5">
                    {manager?.message || MANAGER_INFO.message}
                  </p>
                </div>
                <a
                  href="/manager"
                  className="mt-6 text-xs text-primary hover:text-primary-dark font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors group"
                >
                  <span>Read Full Message</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-slate-100">
              <h3 className="font-serif text-2xl font-extrabold text-slate-900">
                Member of Governing Council Of Bharat Sewa Sansthan
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                S.No, Name, Occupation / Designation, and Membership are displayed in a table format.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-4">S.No</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Occupation / Designation</th>
                    <th className="px-6 py-4">Membership</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {councilMembers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400">
                        No governing council members found.
                      </td>
                    </tr>
                  ) : (
                    councilMembers.map((member: any, index: number) => (
                      <tr key={member._id || `${member.name}-${index}`} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 align-top font-semibold text-slate-700">{index + 1}</td>
                        <td className="px-6 py-4 align-top font-semibold text-slate-900">
                          {member.fullName || member.name}
                        </td>
                        <td className="px-6 py-4 align-top">
                          <span className="inline-flex px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] uppercase tracking-wider">
                            {member.designation}
                          </span>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <span className="inline-flex px-2 py-1 rounded-full bg-primary/5 text-primary text-[10px] uppercase tracking-wider">
                            {resolveMembership(member)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

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
