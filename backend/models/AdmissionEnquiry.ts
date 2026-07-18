import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmissionEnquiry extends Document {
  fullName: string;
  mobileNumber: string;
  email: string;
  program: string;
  highestQualification: string;
  preferredCounselling: string;
  query?: string;
  status: 'New' | 'Contacted' | 'Counselling Scheduled' | 'Admission Confirmed' | 'Closed';
  date: string;
  time: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdmissionEnquirySchema: Schema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    program: { type: String, required: true },
    highestQualification: { type: String, required: true },
    preferredCounselling: { type: String, required: true },
    query: { type: String, maxlength: 500 },
    status: { 
        type: String, 
        enum: ['New', 'Contacted', 'Counselling Scheduled', 'Admission Confirmed', 'Closed'], 
        default: 'New' 
    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.AdmissionEnquiry || mongoose.model<IAdmissionEnquiry>('AdmissionEnquiry', AdmissionEnquirySchema);
