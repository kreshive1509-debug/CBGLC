import mongoose from 'mongoose';
import type { Request, Response } from 'express';
import { isMongoConnected } from '../config/db';
import VisitorCounter from '../models/VisitorCounter';
import VisitorMetric from '../models/VisitorMetric';
import VisitorSession from '../models/VisitorSession';
import { getVisitorBucketKeys, hashVisitorToken, readVisitorToken } from '../utils/visitor';

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

export const getVisitorCount = async (_req: Request, res: Response) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Service Unavailable', message: 'MongoDB is not connected.' });
    }

    const counter = await ensureVisitorCounter();
    res.status(200).json({ totalVisitors: counter?.totalVisitors || 10000 });
  } catch (error) {
    console.error('Error fetching visitor count:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to fetch visitor count.' });
  }
};

export const getVisitorStats = async (_req: Request, res: Response) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Service Unavailable', message: 'MongoDB is not connected.' });
    }

    const counter = await ensureVisitorCounter();
    const { dayKey, weekKey, monthKey } = getVisitorBucketKeys();

    const [todayVisitors, thisWeekVisitors, thisMonthVisitors] = await Promise.all([
      getMetricCount('day', dayKey),
      getMetricCount('week', weekKey),
      getMetricCount('month', monthKey),
    ]);

    res.status(200).json({
      totalVisitors: counter?.totalVisitors || 10000,
      todayVisitors,
      thisWeekVisitors,
      thisMonthVisitors,
      lastUpdated: counter?.updatedAt || counter?.createdAt || null,
    });
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to fetch visitor statistics.' });
  }
};

export const registerVisitor = async (req: Request, res: Response) => {
  const token = readVisitorToken(req);
  if (!token || token.length < 3) {
    return res.status(400).json({ error: 'Invalid visitor token.' });
  }

  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Service Unavailable', message: 'MongoDB is not connected.' });
    }

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

      return res.status(200).json({
        totalVisitors,
        counted,
      });
    } catch (error: any) {
      if (error?.code === 11000) {
        const counter = await ensureVisitorCounter();
        return res.status(200).json({
          totalVisitors: counter?.totalVisitors || 10000,
          counted: false,
        });
      }

      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Error registering visitor:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to register visitor.' });
  }
};
