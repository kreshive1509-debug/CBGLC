import mongoose, { Schema, Document } from 'mongoose';

export interface IFounder extends Document {
  name: string;
  designation: string;
  message: string;
  googleDrivePhotoUrl: string;
}

const FounderSchema: Schema = new Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  message: { type: String, required: true },
  googleDrivePhotoUrl: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.models.Founder || mongoose.model<IFounder>('Founder', FounderSchema);
