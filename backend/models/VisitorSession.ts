import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitorSession extends Document {
  visitorHash: string;
  source: string;
  firstSeenAt: Date;
  lastSeenAt: Date;
}

const VisitorSessionSchema = new Schema<IVisitorSession>(
  {
    visitorHash: { type: String, required: true, unique: true, index: true },
    source: { type: String, default: 'browser-token' },
    firstSeenAt: { type: Date, default: Date.now },
    lastSeenAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.VisitorSession || mongoose.model<IVisitorSession>('VisitorSession', VisitorSessionSchema);
