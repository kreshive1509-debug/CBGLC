// Chandra Bhanu Gupta Law College - Website Content Dataset

export interface Course {
  id: string;
  name: string;
  duration: string;
  seats: string;
  eligibility: string;
  type: string;
  shortDesc: string;
  longDesc: string;
  careerOpportunities: string[];
  subjects: string[];
}

export interface Facility {
  id: string;
  title: string;
  description: string;
  image: string;
  details: string;
}

export interface Notice {
  id: string;
  date: string;
  category: 'Admission' | 'Exam' | 'Academic' | 'Event';
  title: string;
  description: string;
  content: string;
  important: boolean;
}

export interface HighlightItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  year: string;
  quote: string;
}

export const COLLEGE_INFO = {
  name: "Chandra Bhanu Gupta Law College",
  shortName: "CBG Law College",
  approvedBy: "Bar Council of India (BCI), New Delhi",
  affiliatedTo: "University of Lucknow",
  established: "2005",
  location: "Lucknow, Uttar Pradesh, India",
  tagline: "Building Future Legal Professionals",
  admissionYear: "2026-27",
  address: "Chandrawal, Lucknow - 226002, Uttar Pradesh, India",
  phone: "+91-8953963620",
  mobile: "+91-9415012345, +91-9415056789",
  email: "cbguptalawcollege@gmail.com",
  website: "www.cbglawcollege.edu.in",
  mapCoordinates: "https://maps.google.com/?q=Chandra+Bhanu+Gupta+Law+College+Lucknow",
};

export const HIGHLIGHTS: HighlightItem[] = [
  {
    id: "h1",
    title: "Experienced Faculty",
    description: "Learn from distinguished legal minds, veteran lawyers, and senior academicians with decades of teaching and courtroom experience.",
    iconName: "Scale"
  },
  {
    id: "h2",
    title: "Modern Infrastructure",
    description: "Fully-equipped moot courts, smart lecture halls, ultra-fast computer centers, and spacious seminar facilities that inspire success.",
    iconName: "Building"
  },
  {
    id: "h3",
    title: "University Affiliation",
    description: "Proudly affiliated with the prestigious University of Lucknow, ensuring an industry-accredited rigorous academic curriculum.",
    iconName: "Award"
  },
  {
    id: "h4",
    title: "Career Focused Education",
    description: "Tailored internships with top-tier firms, corporate litigation cells, placement preparation, and regular judicial services coaching.",
    iconName: "Briefcase"
  }
];

export const VISION_MISSION = {
  vision: {
    title: "Our Vision",
    quote: "Justice holds the scales of empowerment, and education is the foundation of justice.",
    description: "To emerge as a premier center of excellence in legal education, molding young intellects into socially responsible, ethical, and highly competent legal professionals who will uphold the rule of law and lead the pursuit of justice globally.",
    points: [
      "Fostering an atmosphere of rigorous intellectual exploration.",
      "Cultivating analytical thinking and high moral leadership.",
      "Integrating academic theories with courtroom pragmatism."
    ]
  },
  mission: {
    title: "Our Mission",
    quote: "Nurturing advocacy with ethics, wisdom, and social commitment.",
    description: "To deliver transformative legal education through innovative teaching methodologies, hands-on moot court exercises, social outreach, and state-of-the-art research facilities. We aim to bridge the gap between academic theory and practice.",
    points: [
      "Providing accessible, inclusive, and high-quality law programs.",
      "Empowering students with practical training through legal aid clinics and mock trials.",
      "Instilling core professional values of integrity, empathy, and advocacy."
    ]
  }
};

export const COURSES: Course[] = [
  {
    id: "llb-3yrs",
    name: "LL.B (3 Years Program)",
    duration: "3 Years (6 Semesters)",
    seats: "120 Seats",
    eligibility: "Graduation in any discipline from a recognized University with minimum 45% marks (40% for SC/ST candidates as per BCI guidelines).",
    type: "Postgraduate Law Degree",
    shortDesc: "A comprehensive professional law course designed for graduates seeking a powerful career in legal practice, judiciary, or corporate advocacy.",
    longDesc: "The Bachelor of Laws (LL.B.) 3-Year program at Chandra Bhanu Gupta Law College is designed to provide a deep understanding of core legal areas. The curriculum balances foundational jurisprudence, statutory interpretation, and clinical legal training. Students engage in practical modules including Moot Court activities, Legal Aid camps, and mandatory internships with top judges, lawyers, and legal firms. This program prepares students for the Bar Council exams, public legal services, and legal advisory roles.",
    careerOpportunities: [
      "Advocate in High Court & Supreme Court",
      "Judicial Magistrate (PCS-J)",
      "Corporate Legal Advisor",
      "Public Prosecutor or Government Counsel",
      "Legal Consultant for NGOs and MNCs",
      "Academician or Legal Researcher"
    ],
    subjects: [
      "Jurisprudence (Legal Theory)",
      "Constitutional Law of India",
      "Law of Crimes (Indian Penal Code)",
      "Law of Contracts",
      "Family Law (Hindu & Muslim Law)",
      "Law of Torts & Consumer Protection",
      "Civil Procedure Code (CPC)",
      "Criminal Procedure Code (CrPC)",
      "Law of Evidence",
      "Public International Law"
    ]
  },
  {
    id: "llb-5yrs",
    name: "B.A. LL.B (5 Years Integrated)",
    duration: "5 Years (10 Semesters)",
    seats: "120 Seats",
    eligibility: "10+2 or equivalent examination from a recognized Board with minimum 45% marks (40% for SC/ST candidates as per BCI rules).",
    type: "Integrated Undergraduate Degree",
    shortDesc: "An elite integrated course combining liberal arts and law, tailor-made for students immediately after high school aiming for legal mastery.",
    longDesc: "The integrated Bachelor of Arts and Bachelor of Laws (B.A. LL.B) 5-Year double degree is an elite academic pathway. Over ten semesters, students are exposed to broad humanities courses—such as Political Science, Sociology, History, and Economics—integrated smoothly with advanced law subjects. This comprehensive dual layout encourages a highly interdisciplinary perspective, critical for understanding legal policy and global jurisprudence. Practical exposure begins early, with structured internships, court visits, and intensive litigation training starting from the second year.",
    careerOpportunities: [
      "Corporate Law Attorney in Tier-1 Firms",
      "Judicial Officer / Civil Judge",
      "International Law Specialist",
      "Arbitrator & Conflict Mediator",
      "Civil Services (IAS, IPS, IRS) through Law Option",
      "In-House Counsel for Banks & Financial Tech Giants"
    ],
    subjects: [
      "Political Science & Political Theory",
      "Sociology & Indian Society",
      "English Literature & Legal Language",
      "History of Courts & Legal Profession",
      "Constitutional History and Law",
      "Administrative Law",
      "Corporate & Company Law",
      "Environmental Law & Policy",
      "Intellectual Property Rights (IPR)",
      "Alternative Dispute Resolution (ADR)"
    ]
  }
];

export const WHY_CHOOSE_US = [
  {
    title: "Distinguished Scholars",
    description: "Mentoring by BCI-recognized legal minds, former judges, and legal authors who bring live cases and litigation updates to classrooms.",
    icon: "GraduationCap"
  },
  {
    title: "Supreme Digital Library",
    description: "24/7 access to online legal engines like SSC Online, Manupatra, LexisNexis, and over 15,000 reference manuals, journals, and treaties.",
    icon: "BookOpen"
  },
  {
    title: "Interactive Smart Classrooms",
    description: "Air-conditioned classrooms equipped with touch screen displays, premium audio-visual panels, and ergonomic high-comfort seating.",
    icon: "Tv"
  },
  {
    title: "Championship Moot Court",
    description: "A replica courtroom with modern acoustics where students practice advocacy, present briefs, and prepare for national championships.",
    icon: "Scale"
  },
  {
    title: "Legal Research & Policy Cells",
    description: "Dedicated research teams investigating public policy, environmental statutes, human rights laws, and publishing bi-annual legal journals.",
    icon: "Search"
  },
  {
    title: "Guaranteed Placement Preparedness",
    description: "Specialized mock trial drills, resume-building counseling, public speaking workshops, and tied-up placement drives with state law firms.",
    icon: "TrendingUp"
  },
  {
    title: "Merit-Based Scholarships",
    description: "Attractive annual tuition waivers and cash awards for academic toppers, state rankers, and exceptional moot court competitors.",
    icon: "Award"
  },
  {
    title: "Distinguished Guest Lectures",
    description: "Regular wisdom exchanges with sitting judges of the Allahabad High Court, senior corporate advocates, and international legal authors.",
    icon: "Users"
  }
];

export const FACILITIES: Facility[] = [
  {
    id: "fac-library",
    title: "Central Law Library",
    description: "A treasure trove of knowledge housing extensive national and international law reporters, journals, and digital legal search portals.",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
    details: "Our library hosts over 12,000 textbooks, comprehensive collections of All India Reporter (AIR), Supreme Court Cases (SCC), and subscriptions to international law journals. The e-Library wing features 24 computerized desks running premium search engine access."
  },
  {
    id: "fac-mootcourt",
    title: "The Moot Court Room",
    description: "A meticulously designed, wood-paneled court environment where future advocates learn the critical art of oral argumentation and filing.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    details: "The Moot Court features a traditional judge's bench, witness boxes, and bar tables. It serves as the primary hub for practical court training, legal simulations, and hosts the annual Chandra Bhanu Gupta National Moot Court Championship."
  },
  {
    id: "fac-computerlab",
    title: "Computer & e-Research Lab",
    description: "High-speed internet-enabled workstation center designed to support deep academic research, legal database mining, and digital learning.",
    image: "https://images.unsplash.com/photo-1588912914074-b93851ff14b8?auto=format&fit=crop&w=800&q=80",
    details: "Equipped with 60 high-performance desktops, high-speed optical fiber connectivity, and premium print/scan infrastructure, enabling students to access electronic law journals and write legal research papers smoothly."
  },
  {
    id: "fac-seminarhall",
    title: "Air-Conditioned Seminar Hall",
    description: "A modern conference hall with superior acoustics, visual projection technology, and spacious seating for guest lectures and debates.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    details: "With a comfortable seating capacity of 250+ guests, the Seminar Hall is utilized for regional and national academic symposia, legal workshops, interactive panel discussions, and motivational speech campaigns."
  },
  {
    id: "fac-hostel",
    title: "Campus Student Residences",
    description: "Comfortable, highly secure, separate boarding houses for boys and girls, offering a home-like environment with nutritious catering.",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    details: "The residences feature Wi-Fi, 24/7 security, dynamic sports recreation rooms, water-purification installations, and a modern dining mess serving fresh, strictly hygienic multi-cuisine meals planned by nutritionists."
  },
  {
    id: "fac-sports",
    title: "Collegiate Sports Arena",
    description: "Encouraging a healthy mind in a healthy body through expansive volleyball, basketball, cricket, and diverse indoor sports recreation facilities.",
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80",
    details: "We feature extensive outdoor courts and an indoor activity center for chess, table tennis, and carrom, alongside a student physical wellness gymnasium guided by a resident athletic instructor."
  }
];

export const FOUNDER_INFO = {
  name: "Dr. Chandra Bhanu Gupta",
  title: "Visionary Founder & Renowned Legal Educationist",
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  shortMessage: "Legal education is not merely a profession; it is an instrument of profound social transformation and ethical leadership.",
  message: "I welcome you to Chandra Bhanu Gupta Law College, an institution established on the pillars of intellectual integrity, pursuit of excellence, and social justice. We believe that legal professionals are the architects of a civil society. Hence, our educational model does not simply teach laws; it instills a passion for absolute justice, high ethical reasoning, and comprehensive civic responsibility. Our graduates are trained to be courageous champions of truth in the courtrooms, boardroom leaders, and empathetic community developers. Here, we build advocates who carry legal precision in their minds and human values in their hearts."
};

export const MANAGER_INFO = {
  name: "Shri Aditya K. Gupta",
  title: "Manager & Chairperson, Governing Council",
  image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
  shortMessage: "Our goal is to fuse traditional legal values with modern tech-driven legal research to build future-ready advocacy leaders.",
  message: "At Chandra Bhanu Gupta Law College, our goal is to maintain a learning environment that matches the demands of a rapidly changing global landscape. Modern law has expanded far beyond classic courtrooms—it encompasses international commerce, cyber jurisprudence, intellectual property rights, and complex environment protocols. We have consistently upgraded our curriculum and campus with electronic libraries, interactive smart classrooms, and moot court tournaments. We provide our students with premium mentoring, strong placement preparations, and judicial coaching. I invite you to join us and embark on a rewarding journey that transforms your potential into an elite legal career."
};

export const NOTICES: Notice[] = [
  {
    id: "n1",
    date: "July 15, 2026",
    category: "Admission",
    title: "Admissions Open for LL.B 3 Years & B.A. LL.B 5 Years (Batch 2026-27)",
    description: "Online and offline application processes have commenced for the new academic batch. Submit your admission enquiry to receive personal advisory call.",
    content: "Chandra Bhanu Gupta Law College announces the commencement of admissions for the LL.B (3 Years) and B.A. LL.B (5 Years Integrated) programs for the session 2026-2027. Eligible candidates can register their interest by submitting the Admission Enquiry Form online or visiting the Chandrawal campus. Direct documentation verification and advisory counselling with senior deans will be conducted between 10:00 AM and 4:00 PM on working days. Early applications are advised as seats are strictly limited to BCI-sanctioned counts.",
    important: true
  },
  {
    id: "n2",
    date: "July 12, 2026",
    category: "Exam",
    title: "Lucknow University LL.B Semester Examinations Schedule Announced",
    description: "The University of Lucknow has released the final date sheet for the upcoming LL.B and B.A. LL.B Even Semester examinations.",
    content: "Students are hereby informed that the Lucknow University Even Semester (2nd, 4th, 6th, 8th, and 10th Semester) examinations are scheduled to commence from August 5, 2026. Detailed individual date sheets, subject-wise codes, and designated examination center details have been posted on the main notice board and the online portal. Admit cards will be distributed from the administrative office starting July 25, after clearances of library dues and pending fees. Mock exam tests will be held on July 28 for preparation.",
    important: true
  },
  {
    id: "n3",
    date: "July 08, 2026",
    category: "Academic",
    title: "National Seminar on 'Constitutional Morality and Digital Jurisprudence'",
    description: "The college is organizing a prestigious National Legal Seminar featuring eminent High Court judges and academic authors as keynote speakers.",
    content: "The Research Committee of CBG Law College cordially invites students, researchers, and legal practitioners to the National Seminar on 'Constitutional Morality & Digital Jurisprudence' on September 12, 2026. The seminar will deliberate on emerging challenges in cyber litigation, Artificial Intelligence regulatory legal policies, and fundamental freedom protections. Select research papers will be published in the peer-reviewed CBG Law Review. Abstract submissions are open till August 15.",
    important: false
  },
  {
    id: "n4",
    date: "July 01, 2026",
    category: "Event",
    title: "Intra-College Moot Court Competition Registration Open",
    description: "Unleash your advocacy skills in the annual Intra-College Moot Trial selection rounds. Winning teams will represent the college at nationals.",
    content: "The Moot Court Society (MCS) is excited to announce the Intra-College Moot Court Competition, to be held from August 20 to August 22, 2026. This competition is mandatory for all intermediate students and serves as the official selection process for the college's National Representative Teams. The moot problem revolves around 'Digital Copyright Infringement & Fair Use Exceptions'. Registrations of three-member teams (2 speakers, 1 researcher) must be completed by August 5, 2026.",
    important: false
  }
];

export const GALLERY_IMAGES = [
  {
    id: "g1",
    url: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
    category: "Campus",
    title: "College Majestic Main Campus Entrance"
  },
  {
    id: "g2",
    url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    category: "Moot Court",
    title: "High-End Practice Moot Courtroom"
  },
  {
    id: "g3",
    url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
    category: "Academics",
    title: "Central Law Library Research Desk"
  },
  {
    id: "g4",
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    category: "Events",
    title: "Legal Symposium Keynote Presentation"
  },
  {
    id: "g5",
    url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
    category: "Academics",
    title: "Graduation Convocation Ceremony"
  },
  {
    id: "g6",
    url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
    category: "Campus",
    title: "Interactive Smart Classroom Interactive Debate"
  }
];

export const STATS = [
  { value: "21+", label: "Years of Legacy" },
  { value: "2,500+", label: "Alumni Registered" },
  { value: "45+", label: "Distinguished Jurists & Deans" },
  { value: "2", label: "Premium Law Programs" }
];
