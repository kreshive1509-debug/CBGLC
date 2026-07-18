import mongoose, { Schema, Document } from 'mongoose';

export interface IManager extends Document {
  name: string;
  designation: string;
  message: string;
  googleDrivePhotoUrl: string;
}

const ManagerSchema: Schema = new Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  message: { type: String, required: true },
  googleDrivePhotoUrl: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.models.Manager || mongoose.model<IManager>('Manager', ManagerSchema);
