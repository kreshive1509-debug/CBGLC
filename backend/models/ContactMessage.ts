import mongoose, { Schema } from 'mongoose';

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, default: '', trim: true, maxlength: 30 },
    subject: { type: String, default: 'General Enquiry', trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 4000 },
    status: { type: String, default: 'New', enum: ['New', 'Read', 'Closed'] },
    timestamp: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);
