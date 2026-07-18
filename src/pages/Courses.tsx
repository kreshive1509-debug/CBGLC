import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, BookOpen, Clock, Users, ArrowRight, CheckCircle, FileText, Download, BookmarkCheck } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { useAdmissionModal } from '../context/AdmissionContext';
import { useData } from '../context/DataContext';
import { SEOHelper } from '../components/SEOHelper';
import { COURSES, COLLEGE_INFO } from '../constants/data';

export const Courses: React.FC = () => {
  const { openModal } = useAdmissionModal();
  const { settings } = useData();
  const [activeCourseId, setActiveCourseId] = useState(COURSES[0].id);

  const selectedCourse = COURSES.find(c => c.id === activeCourseId) || COURSES[0];

  const requiredDocuments = [
    "High School (Class 10th) Marksheet and Passing Certificate",
    "Intermediate (Class 12th) Marksheet and Passing Certificate",
    "Graduation Degree Marksheets & Certificate (Mandatory only for LL.B 3-Year Program)",
    "Transfer Certificate (TC) and Migration Certificate in original",
    "Character Certificate from the Principal of the institution last attended",
    "Valid Caste / Category Certificate (for SC/ST/OBC benefit claims if applicable)",
    "Aadhar Card copy for identification verification",
    "4 Passport size high-resolution color photographs"
  ];

  return (
    <div className="bg-white">
      <SEOHelper
        title={`Academic Law Courses & Eligibility | ${settings.collegeName}`}
        description={`Explore premium law courses offered at ${settings.collegeName}, Aliganj, Lucknow. Includes detailed structure for LL.B (3-Year Program) and B.A. LL.B (5-Year Integrated Program).`}
      />
      {/* Page Header banner */}
      <section className="relative py-20 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 select-none pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80"
            alt="Courses at CBG Law"
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
            ACADEMIC YEAR {COLLEGE_INFO.admissionYear}
          </motion.span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight mt-4">
            Our Academic Law Programs
          </h1>
          <div className="h-[3px] bg-gold mx-auto mt-4 w-16" />
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mt-4">
            Explore our professional LL.B and Integrated B.A. LL.B coursework approved under the strict mandates of the Bar Council of India.
          </p>
        </div>
      </section>

      {/* Course Selection Tabs & Detail Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Tabs Navigation */}
          <div className="flex justify-center border-b border-slate-100 max-w-md mx-auto mb-12">
            {COURSES.map(course => (
              <button
                key={course.id}
                onClick={() => setActiveCourseId(course.id)}
                className={`w-1/2 text-center py-4 text-sm font-bold uppercase tracking-wider relative transition-colors cursor-pointer ${
                  activeCourseId === course.id ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span>{course.id === 'llb-3yrs' ? 'LL.B 3 Years' : 'B.A. LL.B 5 Years'}</span>
                {activeCourseId === course.id && (
                  <motion.div
                    layoutId="activeCourseTab"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gold"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Active Course Detail block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-8 bg-slate-50/50 p-6 sm:p-10 rounded-3xl border border-slate-100">
              
              <div className="space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <span className="bg-primary/5 text-primary border border-primary/10 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                    {selectedCourse.type}
                  </span>
                  <span className="bg-amber-50 text-amber-800 border border-amber-100 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                    BCI Approved • {selectedCourse.seats}
                  </span>
                </div>
                <h2 className="font-serif text-3xl font-extrabold text-slate-900">{selectedCourse.name}</h2>
                <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> {selectedCourse.duration}</span>
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-primary" /> Approved Intake: {selectedCourse.seats}</span>
                </div>
              </div>

              {/* Course Long Description */}
              <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-600 leading-relaxed space-y-4">
                <p>{selectedCourse.longDesc}</p>
              </div>

              {/* Course Curriculum Grid */}
              <div className="space-y-4">
                <h3 className="font-serif font-extrabold text-slate-800 text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Core Subjects & Syllabus Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedCourse.subjects.map((sub, index) => (
                    <div key={index} className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-2xs flex items-start gap-2.5">
                      <span className="text-[11px] text-primary bg-primary/5 w-6 h-6 rounded-md flex items-center justify-center font-bold shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-700 leading-tight">{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Opportunities */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="font-serif font-extrabold text-slate-800 text-lg flex items-center gap-2">
                  <Scale className="w-5 h-5 text-primary" /> Elite Career Pathways
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedCourse.careerOpportunities.map((opportunity, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 leading-normal font-medium">
                      <BookmarkCheck className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                      <span>{opportunity}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Summary and Requirements sidebar */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Eligibility Parameters Card */}
              <div className="bg-primary text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
                
                <h3 className="font-serif font-bold text-lg text-gold uppercase tracking-wider border-b border-white/10 pb-3">
                  Eligibility & Intake
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-slate-300 tracking-widest">Acreddited Board</h4>
                    <p className="text-sm font-semibold mt-1">Lucknow University & BCI parameters mandatory</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-slate-300 tracking-widest">Required Percentage</h4>
                    <p className="text-sm font-semibold mt-1">Minimum 45% marks for General/OBC, 40% for SC/ST in graduation/intermediate</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-slate-300 tracking-widest">Counseling Process</h4>
                    <p className="text-sm font-semibold mt-1">Admissions based strictly on merit index and direct campus document counseling deans</p>
                  </div>
                </div>

                <button
                  onClick={() => openModal(selectedCourse.id)}
                  className="w-full py-3.5 bg-gold hover:bg-gold-light text-primary-dark font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md mt-4 cursor-pointer"
                >
                  Initiate Enquiry
                </button>
              </div>

              {/* Help Call Desk */}
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-center space-y-4">
                <h4 className="font-serif font-bold text-slate-800 text-sm">Need Counseling Assistance?</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Connect with our Dean of admissions directly to clarify eligibility, course structure, fee frameworks or hostel reservations.
                </p>
                <div className="text-xs space-y-1 bg-white p-3 rounded-xl border border-slate-100">
                  <p className="font-bold text-primary">Helpline: {COLLEGE_INFO.phone}</p>
                  <p className="text-[11px] text-slate-400">Timing: 10:00 AM to 4:00 PM</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Mandatory Documents Checklist */}
      <section className="py-20 bg-slate-50 border-t border-b border-slate-100 px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-100">
          <SectionHeading
            badge="Admission Preparations"
            title="Required Documents For Verification"
            subtitle="Please prepare the following certificates in original along with three self-attested photocopies for validation during physical campus counseling."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {requiredDocuments.map((doc, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-600 font-semibold leading-snug">{doc}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 pt-6 border-t border-slate-100">
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white text-xs font-bold uppercase tracking-widest py-3.5 px-8 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Submit Admission Enquiry Now</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
