import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, ShieldCheck, Library, Landmark, Scale, Users, 
  HeartHandshake, CheckCircle, GraduationCap, Compass, 
  Tv, Cpu, Trophy, History, BookOpen, Sparkles
} from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { useData } from '../context/DataContext';
import { SEOHelper } from '../components/SEOHelper';
import { COLLEGE_INFO, WHY_CHOOSE_US, VISION_MISSION } from '../constants/data';
import { useAdmissionModal } from '../context/AdmissionContext';

export const About: React.FC = () => {
  const { openModal } = useAdmissionModal();
  const { settings } = useData();

  // Objectives list (Section 5)
  const objectives = [
    {
      title: "Statutory Law Mastery",
      desc: "To instill deep core knowledge of civil procedures, criminal statutes, corporate taxation, and constitutional laws.",
      icon: <Scale className="w-5 h-5 text-gold" />
    },
    {
      title: "Ethical Courtroom Demeanor",
      desc: "To cultivate a rigorous sense of legal ethics, courtroom etiquette, and absolute respect for the bar and bench.",
      icon: <ShieldCheck className="w-5 h-5 text-gold" />
    },
    {
      title: "Public Interest & Legal Aid",
      desc: "To provide extensive legal clinics, free advice campaigns, and literacy seminars to underprivileged community sectors.",
      icon: <HeartHandshake className="w-5 h-5 text-gold" />
    },
    {
      title: "Global Jurisprudence Policy",
      desc: "To integrate emerging fields such as cyber law, intellectual property, international commerce, and green legal policies.",
      icon: <Compass className="w-5 h-5 text-gold" />
    }
  ];

  return (
    <div className="bg-white">
      <SEOHelper
        title={`About Us | ${settings.collegeName}`}
        description={`Learn more about the history, vision, mission, and academic objectives of ${settings.collegeName}, Aliganj, Lucknow. Approved by BCI and affiliated with Lucknow University.`}
      />
      {/* Page Header (Hero style banner) */}
      <section className="relative py-20 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 select-none pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1920&q=80"
            alt="About CBG Law College"
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
            ESTABLISHED IN {settings.academicSession || COLLEGE_INFO.established}
          </motion.span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight mt-4">
            About Our Law College
          </h1>
          <div className="h-[3px] bg-gold mx-auto mt-4 w-16" />
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mt-4">
            Approved by the Bar Council of India (BCI) and affiliated with the University of Lucknow. Shaping professional advocates with ethical foundations.
          </p>
        </div>
      </section>

      {/* SECTION 1: College Introduction */}
      <section className="py-20 px-4 bg-white" id="intro">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <SectionHeading
                badge="01 • INSTITUTIONAL PROFILE"
                title={settings.collegeName}
                align="left"
              />
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed -mt-6">
                {settings.collegeName} is a premier center of excellence in legal education in Lucknow, Uttar Pradesh. Named after the eminent political scholar and social reformer Dr. Chandra Bhanu Gupta, the college has been at the forefront of providing quality, accessible, and comprehensive legal training since its inception.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                By fusing rigorous academic theory with clinical courtroom exercises, the college ensures that students develop deep analytical precision, litigation confidence, and ethical frameworks. Our professional LL.B and Integrated B.A. LL.B programs are designed to match both traditional court procedures and dynamic modern corporate litigation standards.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs font-bold text-slate-700">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span>BCI Approved Program</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs font-bold text-slate-700">
                  <Landmark className="w-5 h-5 text-primary" />
                  <span>Lucknow University Affiliation</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-3 border-2 border-dashed border-gold/30 rounded-3xl transform rotate-1 translate-x-2 translate-y-2 pointer-events-none" />
              <div className="relative overflow-hidden rounded-2xl shadow-xl aspect-4/3 bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80"
                  alt="CBG Law Campus"
                  className="w-full h-full object-cover hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: History */}
      <section className="py-20 bg-slate-50 border-t border-b border-slate-100 px-4" id="history">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 lg:order-2">
            <div className="relative overflow-hidden rounded-2xl shadow-lg aspect-4/3 bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80"
                alt="Our History"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="lg:col-span-7 lg:order-1 space-y-6">
            <SectionHeading
              badge="02 • OUR HERITAGE"
              title="A Rich History of Academic Integrity"
              align="left"
            />
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed -mt-6">
              Established in {COLLEGE_INFO.established}, our college carries a profound academic legacy. The institution was set up by visionary legal reformers who identified the urgent need for a dedicated, high-quality law academy in North India. Over the years, the campus has evolved from a small assembly into a fully fledged, multi-acre educational haven in Lucknow's Aliganj neighborhood.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Named in memory of Dr. Chandra Bhanu Gupta, whose life was a testament to public integrity and education, we have consistently upheld the highest standard of bar parameters. Our history is recorded in the outstanding achievements of our alumni, who now serve as High Court advocates, judicial magistrates, corporate counsels, and policy analysts.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1"><History className="w-4 h-4 text-primary" /> Founded: {COLLEGE_INFO.established}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4 text-primary" /> Over 20 Years of Academic Excellence</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTIONS 3 & 4: Vision & Mission */}
      <section className="py-20 px-4" id="vision-mission">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* SECTION 3: Vision */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white border border-slate-100 p-8 rounded-3xl shadow-xs hover:shadow-lg transition-all space-y-6"
            >
              <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10">
                <Compass className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-extrabold text-slate-900">{VISION_MISSION.vision.title}</h3>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold italic border-l-4 border-gold pl-4 leading-relaxed">
                "{VISION_MISSION.vision.quote}"
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                {VISION_MISSION.vision.description}
              </p>
              <div className="space-y-2 pt-2">
                {VISION_MISSION.vision.points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-500">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* SECTION 4: Mission */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white border border-slate-100 p-8 rounded-3xl shadow-xs hover:shadow-lg transition-all space-y-6"
            >
              <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-extrabold text-slate-900">{VISION_MISSION.mission.title}</h3>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold italic border-l-4 border-gold pl-4 leading-relaxed">
                "{VISION_MISSION.mission.quote}"
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                {VISION_MISSION.mission.description}
              </p>
              <div className="space-y-2 pt-2">
                {VISION_MISSION.mission.points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-500">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SECTION 5: Objectives */}
      <section className="py-20 bg-slate-50 border-t border-b border-slate-100 px-4" id="objectives">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            badge="05 • STRATEGIC FOCUS"
            title="Our Core Academic Objectives"
            subtitle="The targeted instructional benchmarks that guide our course delivery and syllabus implementations."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {objectives.map((obj, idx) => (
              <div key={idx} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-2xs space-y-4">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
                  {obj.icon}
                </div>
                <h4 className="font-serif font-bold text-slate-800 text-base leading-tight">{obj.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: Why Choose CBGLC */}
      <section className="py-20 px-4 bg-white" id="why-choose-us">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            badge="06 • INSTITUTIONAL ADVANTAGES"
            title="Why Invest in CBG Law College?"
            subtitle="Explore our custom resources, championships, digital search desks, and jurist mentorships."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {WHY_CHOOSE_US.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs hover:shadow-md transition-all space-y-4"
              >
                <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center border border-primary/10">
                  {idx % 4 === 0 && <GraduationCap className="w-5 h-5 text-primary" />}
                  {idx % 4 === 1 && <Library className="w-5 h-5 text-primary" />}
                  {idx % 4 === 2 && <Tv className="w-5 h-5 text-primary" />}
                  {idx % 4 === 3 && <Scale className="w-5 h-5 text-primary" />}
                </div>
                <h4 className="font-serif font-bold text-slate-800 text-sm sm:text-base leading-tight">{item.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: Academic Excellence */}
      <section className="py-20 bg-slate-50 border-t border-b border-slate-100 px-4" id="academic-excellence">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <SectionHeading
              badge="07 • ACADEMIC RIGOR"
              title="A Culture of High Academic Excellence"
              align="left"
            />
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed -mt-6">
              Chandra Bhanu Gupta Law College complies strictly with the academic parameters declared by Lucknow University and BCI. We maintain an outstanding curriculum that integrates lecture assemblies with guest seminars, legal case file reviews, and research publications.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Our classrooms are led by highly qualified jurists, advocate scholars, and authors with decades of legal wisdom. We run personalized monitoring cells to assist students preparing for the Judicial Services Exams (PCS-J) and civil services assemblies, ensuring they remain highly placement-ready from day one.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white rounded-2xl border border-slate-100">
                <span className="text-2xl font-serif font-bold text-primary block">45+</span>
                <span className="text-slate-500 text-[11px] font-semibold uppercase">Jurist Deans</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-100">
                <span className="text-2xl font-serif font-bold text-primary block">2,500+</span>
                <span className="text-slate-500 text-[11px] font-semibold uppercase">Elite Alumni</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-3 border border-gold/20 rounded-2xl transform rotate-1 translate-x-1 pointer-events-none" />
            <div className="relative overflow-hidden rounded-2xl shadow-lg aspect-4/3 bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
                alt="Academic Excellence"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: Infrastructure */}
      <section className="py-20 px-4 bg-white" id="infrastructure">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 lg:order-2">
            <div className="relative overflow-hidden rounded-2xl shadow-lg aspect-4/3 bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"
                alt="Infrastructure Overview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="lg:col-span-7 lg:order-1 space-y-6">
            <SectionHeading
              badge="08 • CAMPUS RESOURCES"
              title="State-of-the-Art Infrastructure"
              align="left"
            />
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed -mt-6">
              There is no substitute for experiencing an environment designed strictly to inspire professional litigation. Our campus at Sector C, Aliganj, Lucknow features fully air-conditioned smart classrooms equipped with display panels, touch screens, and high-speed Wi-Fi resources.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We host a majestic wood-paneled championship Moot Courtroom, separate student hostels with modern mess facilities, high-speed computerized e-research labs running LexisNexis, and a collegiate sports arena to maintain physical and mental wellness.
            </p>
            <div className="flex gap-4">
              <span className="flex items-center gap-1 text-xs text-slate-500"><Library className="w-4 h-4 text-gold" /> Central Library</span>
              <span className="flex items-center gap-1 text-xs text-slate-500"><Cpu className="w-4 h-4 text-gold" /> e-Research Lab</span>
              <span className="flex items-center gap-1 text-xs text-slate-500"><Trophy className="w-4 h-4 text-gold" /> Sports Arena</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: Student Development */}
      <section className="py-20 bg-slate-50 border-t border-b border-slate-100 px-4" id="student-development">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <SectionHeading
              badge="09 • STUDENT GROWTH"
              title="Empowering Student Development"
              align="left"
            />
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed -mt-6">
              Our pedagogy does not start or end with textbooks. At CBG Law College, student development is supported through extensive mock-court competitions, legal writing workshops, public speaking seminars, and clinical legal internships.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Under our dedicated legal-aid society, students actively organize free legal awareness camps in rural communities around Lucknow, offering direct administrative support and counsel to those in need. This ensures our graduates possess deep empathy, professional eloquence, and real advocacy confidence.
            </p>
            <ul className="space-y-2 text-xs font-semibold text-slate-500">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Annual National Moot Court Championships</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Mandatory Internship programs starting Year 1</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Student-led Legal Aid counseling desks</li>
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl shadow-lg aspect-4/3 bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
                alt="Student Development"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: Legal Education */}
      <section className="py-20 bg-white px-4" id="legal-education">
        <div className="max-w-4xl mx-auto bg-slate-900 text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-xl text-center space-y-6">
          <div className="absolute inset-0 select-none pointer-events-none opacity-10">
            <img
              src="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80"
              alt="Legal Background"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="relative z-10 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gold bg-white/10 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 10 • MODERN ADVOCACY FOCUS
            </span>
            <h3 className="font-serif text-2xl sm:text-3.5xl font-extrabold leading-tight">
              A Visionary Mandate for Legal Education
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              We believe legal education is not merely a path to a degree; it is a sacred responsibility to uphold the rule of law. Under BCI regulations and Lucknow University affiliations, we nurture future courtroom advocates, corporate policy consultants, and judges who carry sharp intellectual minds and strong human values.
            </p>
          </div>

          <div className="relative z-10 pt-4 flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => openModal()}
              className="px-8 py-3.5 bg-gold hover:bg-gold-light text-primary-dark font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
            >
              Initiate Enquiry
            </button>
            <a
              href={`tel:${COLLEGE_INFO.phone}`}
              className="px-8 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
            >
              Contact Registrar
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
