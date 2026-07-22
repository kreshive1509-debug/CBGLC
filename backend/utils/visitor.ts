import crypto from 'crypto';
import type { Request } from 'express';

export type VisitorBucketType = 'day' | 'week' | 'month';

const VISITOR_TIME_ZONE = process.env.VISITOR_TIMEZONE || 'Asia/Kolkata';
const VISITOR_HASH_SECRET = process.env.VISITOR_HASH_SECRET || process.env.JWT_SECRET || 'cbgl-visitor-secret';
const VISITOR_COOKIE_NAME = 'cbgl_visitor_id';

const parseCookieHeader = (cookieHeader?: string) => {
  if (!cookieHeader) return new Map<string, string>();

  return cookieHeader.split(';').reduce((cookies, chunk) => {
    const [rawKey, ...rawValue] = chunk.split('=');
    const key = rawKey?.trim();
    if (!key) return cookies;
    cookies.set(key, decodeURIComponent(rawValue.join('=').trim()));
    return cookies;
  }, new Map<string, string>());
};

const getDatePartsInTimeZone = (date: Date = new Date()) => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: VISITOR_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(date);
  const year = Number(parts.find((part) => part.type === 'year')?.value || date.getUTCFullYear());
  const month = Number(parts.find((part) => part.type === 'month')?.value || '1');
  const day = Number(parts.find((part) => part.type === 'day')?.value || '1');

  return { year, month, day };
};

const getIsoWeekKey = (date: Date = new Date()) => {
  const { year, month, day } = getDatePartsInTimeZone(date);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  const dayNumber = (utcDate.getUTCDay() + 6) % 7;
  const thursday = new Date(utcDate);
  thursday.setUTCDate(utcDate.getUTCDate() - dayNumber + 3);

  const firstThursday = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 4));
  const firstThursdayDayNumber = (firstThursday.getUTCDay() + 6) % 7;
  const weekNumber = 1 + Math.round(((thursday.getTime() - firstThursday.getTime()) / 86400000 - 3 + firstThursdayDayNumber) / 7);

  return `${thursday.getUTCFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
};

export const getVisitorBucketKeys = (date: Date = new Date()) => {
  const { year, month, day } = getDatePartsInTimeZone(date);
  return {
    dayKey: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    weekKey: getIsoWeekKey(date),
    monthKey: `${year}-${String(month).padStart(2, '0')}`,
  };
};

export const readVisitorToken = (req: Request) => {
  const cookieHeader = parseCookieHeader(req.headers.cookie);
  const bodyToken = typeof req.body?.visitorToken === 'string' ? req.body.visitorToken : '';
  const headerToken = typeof req.headers['x-visitor-id'] === 'string' ? req.headers['x-visitor-id'] : '';
  const cookieToken = cookieHeader.get(VISITOR_COOKIE_NAME) || '';
  const derivedToken = `${req.ip || 'unknown'}|${req.get('user-agent') || 'unknown-agent'}`;
  const sourceToken = bodyToken || headerToken || cookieToken || derivedToken;

  return sourceToken.trim().slice(0, 256);
};

export const hashVisitorToken = (token: string) => {
  return crypto.createHash('sha256').update(`${VISITOR_HASH_SECRET}:${token}`).digest('hex');
};
