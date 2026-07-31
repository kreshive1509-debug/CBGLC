import mongoose, { Schema, Document } from 'mongoose';

export interface IAcademicDocument extends Document {
  title: string;
  description: string;
  category: string;
  link: string;
  linkType: 'Google Drive' | 'Google Form' | 'External URL' | 'PDF';
  buttonText: string;
  publishDate: Date;
  validTill?: Date;
  priority: 'High' | 'Medium' | 'Low';
  displayOrder: number;
  status: 'Published' | 'Draft' | 'Expired';
  isVisible: boolean;
  openInNewTab: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AcademicDocumentSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    category: { type: String, required: true, trim: true },
    link: { type: String, required: true, trim: true },
    linkType: { 
      type: String, 
      enum: ['Google Drive', 'Google Form', 'External URL', 'PDF'], 
      default: 'External URL' 
    },
    buttonText: { type: String, default: 'Open', trim: true },
    publishDate: { type: Date, default: Date.now },
    validTill: { type: Date },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['Published', 'Draft', 'Expired'], default: 'Published' },
    isVisible: { type: Boolean, default: true },
    openInNewTab: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.AcademicDocument || mongoose.model<IAcademicDocument>('AcademicDocument', AcademicDocumentSchema);
