import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  // General Info
  collegeName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  
  // Location/Address
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  googleMapEmbedLink: string;
  googleMapUrl: string;
  latitude: string;
  longitude: string;
  
  // Phone/Email
  primaryPhone: string;
  secondaryPhone: string;
  alternatePhone: string;
  whatsAppNumber: string;
  emergencyContact: string;
  officeEmail: string;
  admissionEmail: string;
  supportEmail: string;
  website: string;
  officeHours: string;
  
  // Social Media
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  twitter: string;
  
  // Admission/Hero/Brochure
  admissionStatus: 'Open' | 'Closed';
  academicSession: string;
  admissionMessage: string;
  breakingNewsStatus: boolean;
  breakingNewsMessages: Array<{ id: string; text: string; speed: number; order: number }>;
  heroBackgroundUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroSmallTagline: string;
  heroAdmissionBadge: string;
  heroPrimaryCtaText: string;
  heroSecondaryCtaText: string;
  heroStats: Array<{ label: string; value: string }>;
  heroOverlayText: string;
  brochureUrl: string;
  brochureButtonText: string;

  // About / Vision / Mission
  aboutTitle: string;
  aboutSubtitle: string;
  aboutDescription: string;
  aboutImageUrl: string;
  aboutHighlights: Array<{ id: string; text: string; icon: string }>;
  aboutStats: Array<{ label: string; value: string }>;
  visionTitle: string;
  visionIcon: string;
  visionQuote: string;
  visionDescription: string;
  visionPoints: Array<{ id: string; text: string }>;
  visionCaption: string;
  missionTitle: string;
  missionIcon: string;
  missionQuote: string;
  missionDescription: string;
  missionPoints: Array<{ id: string; text: string }>;
  missionCaption: string;

  // Courses Management
  courses: Array<{
    id: string;
    name: string;
    shortDescription: string;
    longDescription: string;
    seats: number;
    duration: string;
    semester: string;
    badge: string;
    imageUrl: string;
    status: 'Draft' | 'Published';
    displayOrder: number;
    admissionCriteria: string;
    eligibility: string;
    minimumPercentage: string;
    subjects: string[];
    careerOpportunities: string[];
    coreSubjects: string[];
    curriculumPdfUrl: string;
    applyButtonText: string;
  }>;

  // Facilities Management
  facilities: Array<{
    id: string;
    title: string;
    description: string;
    iconUrl: string;
    displayOrder: number;
  }>;

  // Fees Structure
  fees: {
    admissionFee: string;
    semesterFee: string;
    annualFee: string;
    libraryFee: string;
    examFee: string;
    hostelFee: string;
    securityDeposit: string;
    scholarship: string;
    otherCharges: string;
    paymentNotes: string;
  };

  // Eligibility
  eligibility: {
    title: string;
    minimumMarks: string;
    documentsRequired: Array<{ id: string; text: string }>;
    reservedCategoryRules: string;
    ageRequirement: string;
    specialInstructions: Array<{ id: string; text: string }>;
  };

  // Core Subjects
  coreSubjects: Array<{ id: string; name: string; displayOrder: number }>;

  // Curriculum PDF
  curriculumPdfUrl: string;

  // Footer/Copyright
  footerText: string;
  copyrightText: string;
  designedBy: string;
  showDesignedByCredit: boolean;
  footerQuickLinks: Array<{ id: string; label: string; path: string; displayOrder: number }>;
  footerUsefulLinks: Array<{ id: string; label: string; path: string; displayOrder: number }>;

  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImageUrl: string;
  googleAnalyticsId: string;
  googleSearchConsoleId: string;
  
  // Google Sheets
  googleSheetsId: string;
  isGoogleSheetsEnabled: boolean;
}

const SettingsSchema: Schema = new Schema({
  // General Info
  collegeName: { type: String, required: true },
  tagline: { type: String, required: true },
  logoUrl: { type: String, default: '' },
  faviconUrl: { type: String, default: '' },
  
  // Location/Address
  address: { type: String, required: true },
  landmark: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  pincode: { type: String, default: '' },
  googleMapEmbedLink: { type: String, default: '' },
  googleMapUrl: { type: String, default: '' },
  latitude: { type: String, default: '' },
  longitude: { type: String, default: '' },
  
  // Phone/Email
  primaryPhone: { type: String, required: true },
  secondaryPhone: { type: String, default: '' },
  alternatePhone: { type: String, default: '' },
  whatsAppNumber: { type: String, default: '' },
  emergencyContact: { type: String, default: '' },
  officeEmail: { type: String, required: true },
  admissionEmail: { type: String, default: '' },
  supportEmail: { type: String, default: '' },
  website: { type: String, default: '' },
  officeHours: { type: String, default: '' },
  
  // Social Media
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  youtube: { type: String, default: '' },
  twitter: { type: String, default: '' },
  
  // Admission/Hero/Brochure
  admissionStatus: { type: String, enum: ['Open', 'Closed'], default: 'Closed' },
  academicSession: { type: String, default: '2026-27' },
  admissionMessage: { type: String, default: 'Admissions Open' },
  breakingNewsStatus: { type: Boolean, default: false },
  breakingNewsMessages: { type: [{ id: String, text: String, speed: { type: Number, default: 1 }, order: { type: Number, default: 0 } }], default: [] },
  heroBackgroundUrl: { type: String, default: '' },
  heroTitle: { type: String, default: '' },
  heroSubtitle: { type: String, default: '' },
  heroSmallTagline: { type: String, default: 'Approved by BCI (Bar Council of India)' },
  heroAdmissionBadge: { type: String, default: 'Admission Open' },
  heroPrimaryCtaText: { type: String, default: 'Admission Enquiry' },
  heroSecondaryCtaText: { type: String, default: 'Download Brochure' },
  heroStats: { type: [{ label: String, value: String }], default: [] },
  heroOverlayText: { type: String, default: '' },
  brochureUrl: { type: String, default: '' },
  brochureButtonText: { type: String, default: 'Download Brochure' },

  // About / Vision / Mission
  aboutTitle: { type: String, default: '' },
  aboutSubtitle: { type: String, default: '' },
  aboutDescription: { type: String, default: '' },
  aboutImageUrl: { type: String, default: '' },
  aboutHighlights: { type: [{ id: String, text: String, icon: String }], default: [] },
  aboutStats: { type: [{ label: String, value: String }], default: [] },
  visionTitle: { type: String, default: '' },
  visionIcon: { type: String, default: '' },
  visionQuote: { type: String, default: '' },
  visionDescription: { type: String, default: '' },
  visionPoints: { type: [{ id: String, text: String }], default: [] },
  visionCaption: { type: String, default: '' },
  missionTitle: { type: String, default: '' },
  missionIcon: { type: String, default: '' },
  missionQuote: { type: String, default: '' },
  missionDescription: { type: String, default: '' },
  missionPoints: { type: [{ id: String, text: String }], default: [] },
  missionCaption: { type: String, default: '' },

  // Courses Management
  courses: {
    type: [{
      id: String,
      name: String,
      shortDescription: String,
      longDescription: String,
      seats: Number,
      duration: String,
      semester: String,
      badge: String,
      imageUrl: String,
      status: { type: String, enum: ['Draft', 'Published'], default: 'Published' },
      displayOrder: { type: Number, default: 0 },
      admissionCriteria: String,
      eligibility: String,
      minimumPercentage: String,
      subjects: { type: [String], default: [] },
      careerOpportunities: { type: [String], default: [] },
      coreSubjects: [String],
      curriculumPdfUrl: String,
      applyButtonText: String
    }],
    default: []
  },

  // Facilities Management
  facilities: {
    type: [{
      id: String,
      title: String,
      description: String,
      iconUrl: String,
      displayOrder: { type: Number, default: 0 }
    }],
    default: []
  },

  // Fees Structure
  fees: {
    type: {
      admissionFee: { type: String, default: '' },
      semesterFee: { type: String, default: '' },
      annualFee: { type: String, default: '' },
      libraryFee: { type: String, default: '' },
      examFee: { type: String, default: '' },
      hostelFee: { type: String, default: '' },
      securityDeposit: { type: String, default: '' },
      scholarship: { type: String, default: '' },
      otherCharges: { type: String, default: '' },
      paymentNotes: { type: String, default: '' }
    },
    default: {}
  },

  // Eligibility
  eligibility: {
    type: {
      title: { type: String, default: '' },
      minimumMarks: { type: String, default: '' },
      documentsRequired: { type: [{ id: String, text: String }], default: [] },
      reservedCategoryRules: { type: String, default: '' },
      ageRequirement: { type: String, default: '' },
      specialInstructions: { type: [{ id: String, text: String }], default: [] }
    },
    default: {}
  },

  // Core Subjects
  coreSubjects: { type: [{ id: String, name: String, displayOrder: { type: Number, default: 0 } }], default: [] },

  // Curriculum PDF
  curriculumPdfUrl: { type: String, default: '' },

  // Footer/Copyright
  footerText: { type: String, default: '' },
  copyrightText: { type: String, default: '' },
  designedBy: { type: String, default: '' },
  showDesignedByCredit: { type: Boolean, default: true },
  footerQuickLinks: { type: [{ id: String, label: String, path: String, displayOrder: { type: Number, default: 0 } }], default: [] },
  footerUsefulLinks: { type: [{ id: String, label: String, path: String, displayOrder: { type: Number, default: 0 } }], default: [] },

  // SEO
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  metaKeywords: { type: String, default: '' },
  ogImageUrl: { type: String, default: '' },
  googleAnalyticsId: { type: String, default: '' },
  googleSearchConsoleId: { type: String, default: '' },
  
  // Google Sheets
  googleSheetsId: { type: String, default: '' },
  isGoogleSheetsEnabled: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
