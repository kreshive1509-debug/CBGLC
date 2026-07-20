import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryImage extends Document {
  url: string;
  title: string;
  category: string;
  visible: boolean;
  displayOrder: number;
}

const GalleryImageSchema: Schema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, default: 'Others' },
    visible: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.GalleryImage || mongoose.model<IGalleryImage>('GalleryImage', GalleryImageSchema);
