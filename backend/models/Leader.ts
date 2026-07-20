import mongoose, { Schema, Document } from 'mongoose';

export interface ILeader extends Document {
  photoUrl: string;
  fullName: string;
  designation: string;
  editorialMessage: string;
  buttonText?: string;
  buttonUrl?: string;
  featured: boolean;
  published: boolean;
  displayOrder: number;
}

const LeaderSchema: Schema = new Schema(
  {
    photoUrl: { type: String, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    editorialMessage: { type: String, required: true },
    buttonText: { type: String, default: '' },
    buttonUrl: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Leader || mongoose.model<ILeader>('Leader', LeaderSchema);
