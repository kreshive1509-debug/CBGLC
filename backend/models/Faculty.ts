import mongoose, { Schema, Document } from 'mongoose';

export interface IFaculty extends Document {
  kind: 'faculty' | 'splash';
  name?: string;
  designation?: string;
  qualification?: string;
  department?: string;
  experience?: string;
  description?: string;
  expertise?: string[];
  photo?: string;
  email?: string;
  linkedin?: string;
  website?: string;
  displayOrder: number;
  isVisible: boolean;
  enabled?: boolean;
  backgroundImage?: string;
  logo?: string;
  heading?: string;
  subheading?: string;
  loadingText?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  maxDuration?: number;
}

const FacultySchema: Schema = new Schema(
  {
    kind: { type: String, enum: ['faculty', 'splash'], default: 'faculty', trim: true },
    name: { type: String, trim: true, default: '' },
    designation: { type: String, trim: true, default: '' },
    qualification: { type: String, trim: true, default: '' },
    department: { type: String, trim: true, default: '' },
    experience: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    expertise: [{ type: String, trim: true }],
    photo: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, default: '' },
    linkedin: { type: String, trim: true, default: '' },
    website: { type: String, trim: true, default: '' },
    displayOrder: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    enabled: { type: Boolean, default: true },
    backgroundImage: { type: String, trim: true, default: '' },
    logo: { type: String, trim: true, default: '' },
    heading: { type: String, trim: true, default: '' },
    subheading: { type: String, trim: true, default: '' },
    loadingText: { type: String, trim: true, default: '' },
    overlayColor: { type: String, trim: true, default: '' },
    overlayOpacity: { type: Number, default: 0.78 },
    maxDuration: { type: Number, default: 5000 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Faculty || mongoose.model<IFaculty>('Faculty', FacultySchema);
