import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, Scale, Award, MessageSquare } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { COLLEGE_INFO } from '../constants/data';
import { useAdmissionModal } from '../context/AdmissionContext';

export const FAQ: React.FC = () => {
  const { openModal } = useAdmissionModal();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is the affiliation and approval status of Chandra Bhanu Gupta Law College?",
      a: `Our college is proudly affiliated with the University of Lucknow and approved under the strict academic mandates of the Bar Council of India (BCI), New Delhi. This ensures that your law degree is fully accredited and eligible for registration with all state bar councils to practice as an advocate.`,
      category: "Affiliation"
    },
    {
      q: "How can I apply for admission to the LL.B or Integrated B.A. LL.B programs?",
      a: "The application process is simple. First, submit an online Admission Enquiry on this website. Our dedicated advisory team will contact you to explain eligibility and seat availability. Afterward, you must bring your academic transcripts, caste certificates (if applicable), and passport-size photographs to our Aliganj campus for counseling, document verification, and admission confirmation.",
      category: "Admission"
    },
    {
      q: "What are the eligibility criteria for the 3-Year LL.B course?",
      a: "For the 3-Year LL.B program, you must have completed Graduation in any discipline from a recognized University with at least 45% marks in aggregate for General and OBC categories, and 40% marks for SC/ST candidates as per BCI regulations.",
      category: "Eligibility"
    },
    {
      q: "What are the eligibility criteria for the 5-Year Integrated B.A. LL.B course?",
      a: "For the 5-Year B.A. LL.B program, you must have cleared the 10+2 (Intermediate) or equivalent examination from a recognized Board with a minimum of 45% marks in aggregate for General and OBC, and 40% marks for SC/ST candidates.",
      category: "Eligibility"
    },
    {
      q: "Which documents do I need to prepare for counseling verification?",
      a: `Please prepare:
1. Class 10th & 12th passing marksheets and certificates.
2. Graduation degree marksheets (only for the 3-Year LL.B program).
3. Transfer Certificate (TC) & Migration Certificate in original.
4. Character Certificate from your last attended institution.
5. Valid Caste/Category certificate (for OBC/SC/ST benefits if applicable).
6. Copy of Aadhar Card.
7. 4 high-resolution passport-size color photographs.`,
      category: "Documents"
    },
    {
      q: "Are separate hostel facilities available for boys and girls?",
      a: "Yes, we provide comfortable, secure, separate boarding houses for boys and girls on or near the campus. Our hostels are equipped with 24/7 security, high-speed Wi-Fi, purified drinking water, recreational common rooms, and a modern dining mess serving fresh, strictly hygienic meals.",
      category: "Facilities"
    },
    {
      q: "Does the college offer scholarships or financial tuition waivers?",
      a: "Yes. In accordance with government regulations and college policies, we provide merit-based scholarships and fee concessions to academic toppers, outstanding moot-court performers, and financially disadvantaged or reserved-category students (SC/ST/OBC as per UP Government rules).",
      category: "Fees"
    },
    {
      q: "Can I pay the college tuition fees in installments?",
      a: "Yes, the college allows students to pay tuition fees in structured semester-wise installments. You can connect with our accounts desk during counseling to formulate a comfortable payment schedule.",
      category: "Fees"
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <section className="relative py-20 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 select-none pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1920&q=80"
            alt="FAQ Help"
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
            <HelpCircle className="w-3.5 h-3.5 text-gold" /> ACADEMIC ENQUIRIES
          </motion.span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight mt-4">
            Frequently Asked Questions
          </h1>
          <div className="h-[3px] bg-gold mx-auto mt-4 w-16" />
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mt-4">
            Find answers to common questions about eligibility, admissions, document counseling, hostels, and financial aid.
          </p>
        </div>
      </section>

      {/* Accordion List block */}
      <section className="py-20 px-4 bg-slate-50/50">
        <div className="max-w-3xl mx-auto">
          
          <SectionHeading
            badge="Common Queries"
            title="Resolving Your Legal Education Doubts"
            subtitle="If your question is not listed here, please feel free to drop a query using our Contact page or connect with our office deans."
          />

          {/* Accordion Wrapper */}
          <div className="space-y-4 mt-12">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-100 rounded-2xl shadow-2xs overflow-hidden"
                >
                  {/* Question Header */}
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full text-left p-6 flex justify-between items-center gap-4 hover:bg-slate-50/30 transition-colors cursor-pointer"
                  >
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2.5 py-1 rounded-md">
                        {faq.category}
                      </span>
                      <h4 className="font-serif font-bold text-slate-800 text-sm sm:text-base leading-tight">
                        {faq.q}
                      </h4>
                    </div>
                    
                    <div className="p-1.5 bg-slate-50 text-slate-400 rounded-full shrink-0">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {/* Accordion Body details */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-slate-50 bg-slate-50/20"
                      >
                        <div className="p-6 sm:p-8 text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Help Desk Block */}
      <section className="py-20 bg-white px-4 text-center border-t border-slate-100">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="w-12 h-12 rounded-full bg-primary/5 text-primary flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">
            Have Personal Legal Counseling Questions?
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Our admissions office is fully staffed with coordinators who can explain our curriculum structures, host campus tours, or help finalize your paperwork.
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
              className="px-8 py-3.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
            >
              Call Admissions Office
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
