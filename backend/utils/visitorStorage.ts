import mongoose from 'mongoose';
import type { Request } from 'express';
import { readVisitorToken, hashVisitorToken, getVisitorBucketKeys } from './visitor';
import VisitorCounter from '../models/VisitorCounter';
import VisitorMetric from '../models/VisitorMetric';
import VisitorSession from '../models/VisitorSession';

const COUNTER_KEY = 'global';

const ensureVisitorCounter = async (session?: mongoose.ClientSession) => {
  return VisitorCounter.findOneAndUpdate(
    { key: COUNTER_KEY },
    {
      $setOnInsert: {
        key: COUNTER_KEY,
        totalVisitors: 10000,
      },
    },
    {
      returnDocument: 'after',
      upsert: true,
      session,
    }
  ).lean();
};

const incrementMetric = async (metricType: 'day' | 'week' | 'month', bucketKey: string, session?: mongoose.ClientSession) => {
  return VisitorMetric.findOneAndUpdate(
    { metricType, bucketKey },
    {
      $setOnInsert: {
        metricType,
        bucketKey,
      },
      $inc: { count: 1 },
    },
    {
      returnDocument: 'after',
      upsert: true,
      session,
    }
  ).lean();
};

const getMetricCount = async (metricType: 'day' | 'week' | 'month', bucketKey: string) => {
  const metric = await VisitorMetric.findOne({ metricType, bucketKey }).lean();
  return metric?.count || 0;
};

export const getLocalVisitorCount = async () => {
  const counter = await ensureVisitorCounter();
  return counter?.totalVisitors || 10000;
};

export const getLocalVisitorStats = async () => {
  const counter = await ensureVisitorCounter();
  const { dayKey, weekKey, monthKey } = getVisitorBucketKeys();
  const [todayVisitors, thisWeekVisitors, thisMonthVisitors] = await Promise.all([
    getMetricCount('day', dayKey),
    getMetricCount('week', weekKey),
    getMetricCount('month', monthKey),
  ]);

  return {
    totalVisitors: counter?.totalVisitors || 10000,
    todayVisitors,
    thisWeekVisitors,
    thisMonthVisitors,
    lastUpdated: counter?.updatedAt || counter?.createdAt || null,
  };
};

export const registerLocalVisitor = async (req: Request) => {
  const token = readVisitorToken(req);
  const visitorHash = hashVisitorToken(token);
  const source = req.body?.visitorToken ? 'body-token' : req.get('x-visitor-id') ? 'header-token' : req.headers.cookie?.includes('cbgl_visitor_id=') ? 'cookie-token' : 'ip-user-agent';
  const session = await mongoose.startSession();

  try {
    let totalVisitors = 10000;
    let counted = false;

    await session.withTransaction(async () => {
      const inserted = await VisitorSession.create(
        [
          {
            visitorHash,
            source,
            firstSeenAt: new Date(),
            lastSeenAt: new Date(),
          },
        ],
        { session }
      );

      if (inserted?.length) {
        counted = true;
        const counter = await ensureVisitorCounter(session);
        const updatedCounter = await VisitorCounter.findOneAndUpdate(
          { key: COUNTER_KEY },
          { $inc: { totalVisitors: 1 } },
          { returnDocument: 'after', session }
        ).lean();

        const { dayKey, weekKey, monthKey } = getVisitorBucketKeys();
        await Promise.all([
          incrementMetric('day', dayKey, session),
          incrementMetric('week', weekKey, session),
          incrementMetric('month', monthKey, session),
        ]);

        totalVisitors = updatedCounter?.totalVisitors || (counter?.totalVisitors ? counter.totalVisitors + 1 : 10001);
      }
    });

    if (!counted) {
      const counter = await ensureVisitorCounter();
      totalVisitors = counter?.totalVisitors || 10000;
    }

    return { totalVisitors, counted };
  } finally {
    session.endSession();
  }
};
