import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, BookOpen, Clock, Users, ArrowRight, CheckCircle, FileText, Download } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { useAdmissionModal } from '../context/AdmissionContext';
import { useData } from '../context/DataContext';
import { SEOHelper } from '../components/SEOHelper';
import { COURSES, COLLEGE_INFO } from '../constants/data';

const toTextArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === 'string') return item.trim();
        if (item && typeof item === 'object') {
          const candidate = (item as any).name ?? (item as any).text ?? '';
          return typeof candidate === 'string' ? candidate.trim() : '';
        }
        return '';
      })
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/\r?\n|•/g)
      .map((line) => line.replace(/^[-\s]+/, '').trim())
      .filter(Boolean);
  }

  return [];
};

const renderBullets = (items: string[], emptyLabel: string, tone: 'dark' | 'light' = 'dark') => {
  if (!items.length) {
    return <p className={tone === 'light' ? 'text-xs text-white/70' : 'text-xs text-slate-400'}>{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className={`flex items-start gap-2 text-xs sm:text-sm leading-normal font-medium ${
            tone === 'light' ? 'text-white/90' : 'text-slate-600'
          }`}
        >
          <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${tone === 'light' ? 'bg-gold' : 'bg-gold'}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

export const Courses: React.FC = () => {
  const { openModal } = useAdmissionModal();
  const { settings } = useData();
  const [activeCourseId, setActiveCourseId] = useState<string>('');

  const defaultCourseMap = new Map(COURSES.map((course) => [course.id, course]));
  const resolveDefaultCourse = (course: any, index: number) => {
    const byId = course?.id ? defaultCourseMap.get(course.id) : null;
    if (byId) return byId;

    const courseName = typeof course?.name === 'string' ? course.name.trim().toLowerCase() : '';
    if (courseName) {
      const byName = COURSES.find((item) => item.name.trim().toLowerCase() === courseName);
      if (byName) return byName;
    }

    return COURSES[index] || COURSES[0];
  };
  const cmsCourses = Array.isArray(settings.courses) && settings.courses.length ? settings.courses : COURSES;
  const courses = cmsCourses.map((course: any, index: number) => ({
    id: course.id || `course-${index}`,
    name: course.name || course.title || 'Course',
    shortDescription: course.shortDescription || course.description || '',
    longDescription: course.longDescription || course.description || '',
    seats: course.seats || 'TBA',
    duration: course.duration || 'TBA',
    type: course.type || course.programBadge || 'Program',
    imageUrl: course.imageUrl || '',
    bannerImageUrl: course.bannerImageUrl || '',
    coverImageUrl: course.coverImageUrl || '',
    careerOpportunities: toTextArray(course.careerOpportunities).length
      ? toTextArray(course.careerOpportunities)
      : toTextArray(resolveDefaultCourse(course, index)?.careerOpportunities),
    admissionCriteria: course.admissionCriteria || 'Merit-based admission',
    eligibility: course.eligibility || 'Minimum qualifying marks as per regulatory norms',
    minimumPercentage: course.minimumPercentage || '45%',
    semester: course.semester || 'Semester-wise',
    curriculumPdf: course.curriculumPdf || '',
    applyButtonText: course.applyButtonText || 'Initiate Enquiry',
    status: course.status || 'Published',
    displayOrder: course.displayOrder ?? index,
    published: course.published !== false,
  })).sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  useEffect(() => {
    if (!courses.length) return;
    setActiveCourseId((current) => current && courses.some((course: any) => course.id === current) ? current : courses[0].id);
  }, [courses]);

  const selectedCourse = courses.find((course: any) => course.id === activeCourseId) || courses[0];
  const courseImageUrl =
    selectedCourse?.imageUrl ||
    selectedCourse?.bannerImageUrl ||
    selectedCourse?.coverImageUrl ||
    'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1600&q=80';

  const requiredDocuments = Array.isArray((settings.eligibility as any)?.documentsRequired) && (settings.eligibility as any).documentsRequired.length
    ? (settings.eligibility as any).documentsRequired
    : [
        'High School (Class 10th) Marksheet and Passing Certificate',
        'Intermediate (Class 12th) Marksheet and Passing Certificate',
        'Graduation Degree Marksheets & Certificate (Mandatory only for LL.B 3-Year Program)',
        'Transfer Certificate (TC) and Migration Certificate in original',
        'Character Certificate from the Principal of the institution last attended',
        'Valid Caste / Category Certificate (for SC/ST/OBC benefit claims if applicable)',
        'Aadhar Card copy for identification verification',
        '4 Passport size high-resolution color photographs'
      ];

  return (
    <div className="bg-white">
      <SEOHelper
        title={`Academic Law Courses & Eligibility | ${settings.collegeName}`}
        description={`Explore premium law courses offered at ${settings.collegeName}, Chandrawal, Lucknow. Includes detailed structure for LL.B (3-Year Program) and B.A. LL.B (5-Year Integrated Program).`}
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
            {courses.map((course: any) => (
              <button
                key={course.id}
                onClick={() => setActiveCourseId(course.id)}
                className={`w-1/2 text-center py-4 text-sm font-bold uppercase tracking-wider relative transition-colors cursor-pointer ${
                  activeCourseId === course.id ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span>{course.name}</span>
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
              
              <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                <img
                  src={courseImageUrl}
                  alt={selectedCourse.name}
                  className="h-64 sm:h-80 w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <span className="bg-primary/5 text-primary border border-primary/10 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                    {selectedCourse.type}
                  </span>
                  <span className="bg-amber-50 text-amber-800 border border-amber-100 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                    {selectedCourse.status || 'Published'} • {selectedCourse.seats}
                  </span>
                </div>
                <h2 className="font-serif text-3xl font-extrabold text-slate-900">{selectedCourse.name}</h2>
                <p className="text-sm text-slate-500 font-medium">{selectedCourse.shortDescription}</p>
                <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> {selectedCourse.duration}</span>
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-primary" /> Approved Intake: {selectedCourse.seats}</span>
                  <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-primary" /> {selectedCourse.semester}</span>
                </div>
              </div>

              {/* Course Long Description */}
              <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-600 leading-relaxed space-y-4">
                <p>{selectedCourse.longDescription}</p>
              </div>

              {/* Career Opportunities */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="font-serif font-extrabold text-slate-800 text-lg flex items-center gap-2">
                  <Scale className="w-5 h-5 text-primary" /> Elite Career Pathways
                </h3>
                {renderBullets(selectedCourse.careerOpportunities || [], 'No career pathways added yet.')}
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
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase font-bold text-slate-300 tracking-widest">Accredited Board</h4>
                    {renderBullets(toTextArray(selectedCourse.admissionCriteria), 'No admission criteria added yet.', 'light')}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase font-bold text-slate-300 tracking-widest">Required Percentage</h4>
                    <p className="text-sm font-semibold mt-1 text-white">Minimum Percentage: {selectedCourse.minimumPercentage}</p>
                    {renderBullets(toTextArray(selectedCourse.eligibility), 'No eligibility points added yet.', 'light')}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase font-bold text-slate-300 tracking-widest">Counseling Process</h4>
                    <p className="text-sm font-semibold mt-1 leading-relaxed text-white">
                      Admissions based strictly on merit index and direct campus document counseling deans.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => openModal(selectedCourse.id)}
                  className="w-full py-3.5 bg-gold hover:bg-gold-light text-primary-dark font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md mt-4 cursor-pointer"
                >
                  {selectedCourse.applyButtonText || 'Initiate Enquiry'}
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
                  {(settings.eligibility as any)?.specialInstructions && <p className="text-[11px] text-slate-400">{(settings.eligibility as any).specialInstructions}</p>}
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
