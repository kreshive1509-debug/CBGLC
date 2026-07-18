import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmissionSettings extends Document {
  admissionStatus: 'Open' | 'Closed';
  academicSession: string;
  admissionMessage: string;
  breakingNewsStatus: boolean;
  breakingNewsText: string;
}

const AdmissionSettingsSchema: Schema = new Schema(
  {
    admissionStatus: { type: String, enum: ['Open', 'Closed'], default: 'Closed' },
    academicSession: { type: String, default: '2026-27' },
    admissionMessage: { type: String, default: 'Admissions Open' },
    breakingNewsStatus: { type: Boolean, default: false },
    breakingNewsText: { type: String, default: 'Admissions Open for Academic Session' }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.AdmissionSettings || mongoose.model<IAdmissionSettings>('AdmissionSettings', AdmissionSettingsSchema);
