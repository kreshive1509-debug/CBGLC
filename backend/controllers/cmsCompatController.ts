import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { isMongoConnected } from '../config/db';
import { storage } from '../utils/storage';
import { triggerVercelDeployment } from '../utils/vercelDeployment';
import VisitorCounter from '../models/VisitorCounter';
import _Notice from '../models/Notice';

const Notice = _Notice as any;

const pick = (source: any, keys: string[]) =>
  keys.reduce((acc: Record<string, any>, key) => {
    acc[key] = source?.[key];
    return acc;
  }, {});

const sendSettingsSection = async (res: Response, keys: string[]) => {
  const settings = await storage.getSettings();
  res.status(200).json(pick(settings, keys));
};

const updateSettingsSection = async (req: Request, res: Response, sectionName: string) => {
  const updated = await storage.updateSettings(req.body);
  const deploymentTriggered = storage.isMongoConnected()
    ? await triggerVercelDeployment(sectionName)
    : false;

  res.status(200).json({
    success: true,
    deploymentTriggered,
    message: deploymentTriggered
      ? 'Content saved successfully. Website deployment has started. Changes will be live shortly.'
      : 'Content saved successfully, but automatic deployment could not be started.',
    settings: updated
  });
};

const resolveId = (req: Request) => {
  const bodyId = typeof req.body?.id === 'string' ? req.body.id : typeof req.body?._id === 'string' ? req.body._id : '';
  const queryId = typeof req.query?.id === 'string' ? req.query.id : '';
  return bodyId || queryId;
};

const deployIfMongo = async (context: string) => {
  return storage.isMongoConnected() ? await triggerVercelDeployment(context) : false;
};

export const getHero = async (_req: Request, res: Response) => {
  await sendSettingsSection(res, [
    'heroBackgroundUrl',
    'heroTitle',
    'heroSubtitle',
    'heroSmallTagline',
    'heroAdmissionBadge',
    'heroPrimaryCtaText',
    'heroSecondaryCtaText',
    'heroStats',
    'heroOverlayText',
    'admissionStatus',
    'academicSession',
    'admissionMessage'
  ]);
};

export const updateHero = async (req: Request, res: Response) => {
  await updateSettingsSection(req, res, 'Hero');
};

export const getAbout = async (_req: Request, res: Response) => {
  await sendSettingsSection(res, [
    'aboutTitle',
    'aboutSubtitle',
    'aboutDescription',
    'aboutImageUrl',
    'aboutHighlights',
    'aboutStats'
  ]);
};

export const updateAbout = async (req: Request, res: Response) => {
  await updateSettingsSection(req, res, 'About');
};

export const getVision = async (_req: Request, res: Response) => {
  await sendSettingsSection(res, [
    'visionTitle',
    'visionIcon',
    'visionQuote',
    'visionDescription',
    'visionPoints',
    'visionCaption'
  ]);
};

export const updateVision = async (req: Request, res: Response) => {
  await updateSettingsSection(req, res, 'Vision');
};

export const getMission = async (_req: Request, res: Response) => {
  await sendSettingsSection(res, [
    'missionTitle',
    'missionIcon',
    'missionQuote',
    'missionDescription',
    'missionPoints',
    'missionCaption'
  ]);
};

export const updateMission = async (req: Request, res: Response) => {
  await updateSettingsSection(req, res, 'Mission');
};

export const getCourses = async (_req: Request, res: Response) => {
  await sendSettingsSection(res, ['courses']);
};

export const updateCourses = async (req: Request, res: Response) => {
  await updateSettingsSection(req, res, 'Courses');
};

export const getFooter = async (_req: Request, res: Response) => {
  await sendSettingsSection(res, [
    'footerText',
    'copyrightText',
    'designedBy',
    'showDesignedByCredit',
    'footerQuickLinks',
    'footerUsefulLinks'
  ]);
};

export const updateFooter = async (req: Request, res: Response) => {
  await updateSettingsSection(req, res, 'Footer');
};

export const getContact = async (_req: Request, res: Response) => {
  await sendSettingsSection(res, [
    'address',
    'landmark',
    'city',
    'state',
    'pincode',
    'googleMapEmbedLink',
    'googleMapUrl',
    'latitude',
    'longitude',
    'primaryPhone',
    'secondaryPhone',
    'alternatePhone',
    'whatsAppNumber',
    'emergencyContact',
    'officeEmail',
    'admissionEmail',
    'supportEmail',
    'website',
    'officeHours'
  ]);
};

export const updateContact = async (req: Request, res: Response) => {
  await updateSettingsSection(req, res, 'Contact');
};

export const getSocialLinks = async (_req: Request, res: Response) => {
  await sendSettingsSection(res, ['facebook', 'instagram', 'linkedin', 'youtube', 'twitter']);
};

export const updateSocialLinks = async (req: Request, res: Response) => {
  await updateSettingsSection(req, res, 'Social Links');
};

export const getBreakingNews = async (_req: Request, res: Response) => {
  await sendSettingsSection(res, ['breakingNewsStatus', 'breakingNewsMessages', 'admissionStatus', 'academicSession', 'admissionMessage']);
};

export const updateBreakingNews = async (req: Request, res: Response) => {
  await updateSettingsSection(req, res, 'Breaking News');
};

export const getAdmission = async (_req: Request, res: Response) => {
  const settings = await storage.getAdmissionSettings();
  res.status(200).json(settings);
};

export const updateAdmission = async (req: Request, res: Response) => {
  const settings = await storage.updateAdmissionSettings(req.body);
  const deploymentTriggered = storage.isMongoConnected()
    ? await triggerVercelDeployment('Admission Settings')
    : false;

  res.status(200).json({
    success: true,
    deploymentTriggered,
    message: deploymentTriggered
      ? 'Content saved successfully. Website deployment has started. Changes will be live shortly.'
      : 'Content saved successfully, but automatic deployment could not be started.',
    settings
  });
};

export const getLeadership = async (_req: Request, res: Response) => {
  const leaders = await storage.getLeaders();
  res.status(200).json(leaders);
};

export const updateLeadership = async (req: Request, res: Response) => {
  const id = resolveId(req);
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Leader id is required' });
  }

  const existing = await storage.getLeaderById(id);
  if (!existing) {
    return res.status(404).json({ error: 'Leader not found' });
  }

  const leader = await storage.updateLeader(id, req.body);
  const deploymentTriggered = storage.isMongoConnected()
    ? await triggerVercelDeployment('Leadership')
    : false;

  res.status(200).json({
    success: true,
    deploymentTriggered,
    message: deploymentTriggered
      ? 'Leader updated successfully. Website deployment has started. Changes will be live shortly.'
      : 'Leader updated successfully, but automatic deployment could not be started.',
    leader
  });
};

export const updateNoticeByBody = async (req: Request, res: Response) => {
  const id = resolveId(req);
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Notice id is required' });
  }

  const existingNotice = await storage.getNoticeById(id);
  if (!existingNotice) {
    return res.status(404).json({ error: 'Notice not found' });
  }

  const notice = await storage.updateNotice(id, req.body);
  const deploymentTriggered = await deployIfMongo('Notices');
  res.status(200).json({
    success: true,
    deploymentTriggered,
    message: deploymentTriggered
      ? 'Notice updated successfully. Website deployment has started. Changes will be live shortly.'
      : 'Notice updated successfully, but automatic deployment could not be started.',
    notice
  });
};

export const deleteNoticeByBody = async (req: Request, res: Response) => {
  const id = resolveId(req);
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Notice id is required' });
  }

  const existingNotice = await storage.getNoticeById(id);
  if (!existingNotice) {
    return res.status(404).json({ error: 'Notice not found' });
  }

  const deleted = await storage.deleteNotice(id);
  if (!deleted) {
    return res.status(500).json({ error: 'Failed to delete notice from storage engine.' });
  }

  const deploymentTriggered = await deployIfMongo('Notices');
  res.status(200).json({
    success: true,
    deploymentTriggered,
    message: deploymentTriggered
      ? 'Notice deleted successfully. Website deployment has started. Changes will be live shortly.'
      : 'Notice deleted successfully, but automatic deployment could not be started.'
  });
};

export const updateGalleryByBody = async (req: Request, res: Response) => {
  const id = resolveId(req);
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Gallery image id is required' });
  }

  const existingImage = await storage.getGalleryImageById(id);
  if (!existingImage) {
    return res.status(404).json({ error: 'Gallery image not found' });
  }

  const image = await storage.updateGalleryImage(id, req.body);
  const deploymentTriggered = await deployIfMongo('Gallery');
  res.status(200).json({
    success: true,
    deploymentTriggered,
    message: deploymentTriggered
      ? 'Gallery image updated successfully. Website deployment has started. Changes will be live shortly.'
      : 'Gallery image updated successfully, but automatic deployment could not be started.',
    image
  });
};

export const getVisitorCounter = async (_req: Request, res: Response) => {
  if (!isMongoConnected()) {
    return res.status(200).json({ totalVisitors: 10000 });
  }

  const counter = await VisitorCounter.findOne({ key: 'global' }).lean();
  res.status(200).json({
    totalVisitors: counter?.totalVisitors || 10000
  });
};

export const updateVisitorCounter = async (req: Request, res: Response) => {
  if (!isMongoConnected()) {
    return res.status(503).json({ error: 'Service Unavailable', message: 'MongoDB is not connected.' });
  }

  const totalVisitors = Number(req.body?.totalVisitors);
  if (!Number.isFinite(totalVisitors) || totalVisitors < 10000) {
    return res.status(400).json({ error: 'Invalid visitor counter value.' });
  }

  const counter = await VisitorCounter.findOneAndUpdate(
    { key: 'global' },
    { $set: { totalVisitors } },
    { new: true, upsert: true, runValidators: true }
  ).lean();

  const deploymentTriggered = await deployIfMongo('Visitor Counter');

  res.status(200).json({
    success: true,
    deploymentTriggered,
    totalVisitors: counter?.totalVisitors || totalVisitors
  });
};

export const getRoutesReport = (_req: Request, res: Response) => {
  res.status(200).json([
    '/api/health',
    '/api/routes',
    '/api/settings',
    '/api/hero',
    '/api/about',
    '/api/vision',
    '/api/mission',
    '/api/courses',
    '/api/gallery',
    '/api/notices',
    '/api/footer',
    '/api/contact',
    '/api/social-links',
    '/api/admission',
    '/api/leadership',
    '/api/breaking-news',
    '/api/admission-settings',
    '/api/visitor-count',
    '/api/visitor-stats',
    '/api/visitor-counter',
    '/api/enquiries',
    '/api/visitor'
  ]);
};
