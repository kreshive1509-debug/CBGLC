import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitorCounter extends Document {
  key: string;
  totalVisitors: number;
}

const VisitorCounterSchema = new Schema<IVisitorCounter>(
  {
    key: { type: String, required: true, unique: true, default: 'global' },
    totalVisitors: { type: Number, required: true, default: 10000, min: 10000 },
  },
  { timestamps: true }
);

export default mongoose.models.VisitorCounter || mongoose.model<IVisitorCounter>('VisitorCounter', VisitorCounterSchema);
