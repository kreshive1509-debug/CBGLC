import fs from 'fs/promises';
import path from 'path';
import { readVisitorToken, hashVisitorToken, getVisitorBucketKeys } from './visitor';
import type { Request } from 'express';

type VisitorMetricType = 'day' | 'week' | 'month';

interface LocalVisitorSession {
  source: string;
  firstSeenAt: string;
  lastSeenAt: string;
}

interface LocalVisitorStore {
  counter: {
    totalVisitors: number;
    createdAt: string;
    updatedAt: string;
  };
  metrics: Record<VisitorMetricType, Record<string, number>>;
  sessions: Record<string, LocalVisitorSession>;
}

const VISITOR_STORE_PATH = path.join(process.cwd(), 'data', 'visitor-counter.json');

const createDefaultStore = (): LocalVisitorStore => {
  const now = new Date().toISOString();
  return {
    counter: {
      totalVisitors: 10000,
      createdAt: now,
      updatedAt: now,
    },
    metrics: {
      day: {},
      week: {},
      month: {},
    },
    sessions: {},
  };
};

const ensureStoreDirectory = async () => {
  await fs.mkdir(path.dirname(VISITOR_STORE_PATH), { recursive: true });
};

const readStore = async (): Promise<LocalVisitorStore> => {
  try {
    const raw = await fs.readFile(VISITOR_STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<LocalVisitorStore>;
    const defaultStore = createDefaultStore();
    return {
      counter: {
        ...defaultStore.counter,
        ...(parsed.counter || {}),
      },
      metrics: {
        day: parsed.metrics?.day || {},
        week: parsed.metrics?.week || {},
        month: parsed.metrics?.month || {},
      },
      sessions: parsed.sessions || {},
    };
  } catch {
    return createDefaultStore();
  }
};

const writeStore = async (store: LocalVisitorStore) => {
  await ensureStoreDirectory();
  await fs.writeFile(VISITOR_STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
};

export const getLocalVisitorCount = async () => {
  const store = await readStore();
  return store.counter.totalVisitors;
};

export const getLocalVisitorStats = async () => {
  const store = await readStore();
  const { dayKey, weekKey, monthKey } = getVisitorBucketKeys();
  return {
    totalVisitors: store.counter.totalVisitors,
    todayVisitors: store.metrics.day[dayKey] || 0,
    thisWeekVisitors: store.metrics.week[weekKey] || 0,
    thisMonthVisitors: store.metrics.month[monthKey] || 0,
    lastUpdated: store.counter.updatedAt,
  };
};

export const registerLocalVisitor = async (req: Request) => {
  const token = readVisitorToken(req);
  const visitorHash = hashVisitorToken(token);
  const source = req.body?.visitorToken ? 'body-token' : req.get('x-visitor-id') ? 'header-token' : req.headers.cookie?.includes('cbgl_visitor_id=') ? 'cookie-token' : 'ip-user-agent';
  const store = await readStore();

  if (!store.sessions[visitorHash]) {
    const now = new Date().toISOString();
    const { dayKey, weekKey, monthKey } = getVisitorBucketKeys();
    store.sessions[visitorHash] = {
      source,
      firstSeenAt: now,
      lastSeenAt: now,
    };
    store.counter.totalVisitors += 1;
    store.counter.updatedAt = now;
    store.metrics.day[dayKey] = (store.metrics.day[dayKey] || 0) + 1;
    store.metrics.week[weekKey] = (store.metrics.week[weekKey] || 0) + 1;
    store.metrics.month[monthKey] = (store.metrics.month[monthKey] || 0) + 1;
    await writeStore(store);
    return { totalVisitors: store.counter.totalVisitors, counted: true };
  }

  store.sessions[visitorHash].lastSeenAt = new Date().toISOString();
  await writeStore(store);
  return { totalVisitors: store.counter.totalVisitors, counted: false };
};
