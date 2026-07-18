import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  // General Info
  collegeName: string;
  tagline: string;
  logoUrl: string;
  
  // Location/Address
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  googleMapEmbedLink: string;
  googleMapUrl: string;
  
  // Phone/Email
  primaryPhone: string;
  secondaryPhone: string;
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
  breakingNewsText: string;
  heroBackgroundUrl: string;
  brochureUrl: string;
  brochureButtonText: string;
  
  // Footer/Copyright
  footerText: string;
  copyrightText: string;
  designedBy: string;

  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  // Google Sheets
  googleSheetsId: string;
  isGoogleSheetsEnabled: boolean;
}

const SettingsSchema: Schema = new Schema({
  collegeName: { type: String, required: true },
  tagline: { type: String, required: true },
  logoUrl: { type: String, default: '' },
  
  address: { type: String, required: true },
  landmark: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  pincode: { type: String, default: '' },
  googleMapEmbedLink: { type: String, default: '' },
  googleMapUrl: { type: String, default: '' },
  
  primaryPhone: { type: String, required: true },
  secondaryPhone: { type: String, default: '' },
  whatsAppNumber: { type: String, default: '' },
  emergencyContact: { type: String, default: '' },
  officeEmail: { type: String, required: true },
  admissionEmail: { type: String, default: '' },
  supportEmail: { type: String, default: '' },
  website: { type: String, default: '' },
  officeHours: { type: String, default: '' },
  
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  youtube: { type: String, default: '' },
  twitter: { type: String, default: '' },
  
  admissionStatus: { type: String, enum: ['Open', 'Closed'], default: 'Closed' },
  academicSession: { type: String, default: '2026-27' },
  admissionMessage: { type: String, default: 'Admissions Open' },
  breakingNewsStatus: { type: Boolean, default: false },
  breakingNewsText: { type: String, default: 'Admissions Open' },
  heroBackgroundUrl: { type: String, default: '' },
  brochureUrl: { type: String, default: '' },
  brochureButtonText: { type: String, default: 'Download Brochure' },
  
  footerText: { type: String, default: '' },
  copyrightText: { type: String, default: '' },
  designedBy: { type: String, default: '' },

  // SEO
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  metaKeywords: { type: String, default: '' },
  // Google Sheets
  googleSheetsId: { type: String, default: '' },
  isGoogleSheetsEnabled: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
