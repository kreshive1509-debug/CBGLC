import mongoose, { Schema, Document } from 'mongoose';
import type { VisitorBucketType } from '../utils/visitor';

export interface IVisitorMetric extends Document {
  metricType: VisitorBucketType;
  bucketKey: string;
  count: number;
}

const VisitorMetricSchema = new Schema<IVisitorMetric>(
  {
    metricType: { type: String, required: true, enum: ['day', 'week', 'month'] },
    bucketKey: { type: String, required: true },
    count: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true }
);

VisitorMetricSchema.index({ metricType: 1, bucketKey: 1 }, { unique: true });

export default mongoose.models.VisitorMetric || mongoose.model<IVisitorMetric>('VisitorMetric', VisitorMetricSchema);
