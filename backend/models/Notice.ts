import mongoose, { Schema, Document } from 'mongoose';

export interface INotice extends Document {
  title: string;
  description: string;
  category: string;
  publishDate: Date;
  expiryDate?: Date;
  googleDriveUrl?: string;
  pinned: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NoticeSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    publishDate: { type: Date, required: true },
    expiryDate: { type: Date },
    googleDriveUrl: { type: String, default: '' },
    pinned: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Explicitly use lower-case or capitalized names according to MVC
export default mongoose.models.Notice || mongoose.model<INotice>('Notice', NoticeSchema);
