import type { Request, Response } from 'express';
import { isMongoConnected } from '../config/db';
import VisitorCounter from '../models/VisitorCounter';
import VisitorMetric from '../models/VisitorMetric';
import VisitorSession from '../models/VisitorSession';
import { getVisitorBucketKeys, hashVisitorToken, readVisitorToken } from '../utils/visitor';

const COUNTER_KEY = 'global';

const ensureVisitorCounter = async () => {
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
    }
  ).lean();
};

const incrementMetric = async (metricType: 'day' | 'week' | 'month', bucketKey: string) => {
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
    res.status(503).json({ error: 'Service Unavailable', message: 'Unable to fetch visitor count.' });
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
    res.status(503).json({ error: 'Service Unavailable', message: 'Unable to fetch visitor statistics.' });
  }
};

export const registerVisitor = async (req: Request, res: Response) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Service Unavailable', message: 'MongoDB is not connected.' });
    }

    const token = readVisitorToken(req);
    if (!token || token.length < 3) {
      return res.status(400).json({ error: 'Invalid visitor token.' });
    }

    const visitorHash = hashVisitorToken(token);
    const source = req.body?.visitorToken ? 'body-token' : req.get('x-visitor-id') ? 'header-token' : req.headers.cookie?.includes('cbgl_visitor_id=') ? 'cookie-token' : 'ip-user-agent';
    let totalVisitors = 10000;
    let counted = false;

    const sessionResult = await VisitorSession.updateOne(
      { visitorHash },
      {
        $set: { lastSeenAt: new Date() },
        $setOnInsert: {
          visitorHash,
          source,
          firstSeenAt: new Date(),
        },
      },
      { upsert: true }
    );

    if ((sessionResult as any)?.upsertedCount > 0 || (sessionResult as any)?.upsertedId) {
      counted = true;
      const counter = await ensureVisitorCounter();
      const updatedCounter = await VisitorCounter.findOneAndUpdate(
        { key: COUNTER_KEY },
        { $inc: { totalVisitors: 1 } },
        { returnDocument: 'after', upsert: true }
      ).lean();

      const { dayKey, weekKey, monthKey } = getVisitorBucketKeys();
      await Promise.all([
        incrementMetric('day', dayKey),
        incrementMetric('week', weekKey),
        incrementMetric('month', monthKey),
      ]);

      totalVisitors = updatedCounter?.totalVisitors || (counter?.totalVisitors ? counter.totalVisitors + 1 : 10001);
    } else {
      const counter = await ensureVisitorCounter();
      totalVisitors = counter?.totalVisitors || 10000;
    }

    return res.status(200).json({
      totalVisitors,
      counted,
    });
  } catch (error) {
    console.error('Error registering visitor:', error);
    res.status(503).json({ error: 'Service Unavailable', message: 'Unable to register visitor.' });
  }
};
