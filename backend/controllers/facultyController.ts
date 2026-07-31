import { Response } from 'express';
import { isMongoConnected } from '../config/db';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import Faculty from '../models/Faculty';

const DEFAULT_SPLASH_CONFIG = {
  kind: 'splash' as const,
  enabled: true,
  backgroundImage: '',
  logo: '',
  heading: 'Chandra Bhanu Gupta Law College',
  subheading: 'Shaping ethical legal minds with academic distinction and professional excellence.',
  loadingText: 'Preparing your campus experience',
  overlayColor: 'rgba(2, 6, 23, 0.78)',
  overlayOpacity: 0.78,
  maxDuration: 5000,
};

const normalizeFacultyPayload = (input: any = {}) => {
  const expertise = Array.isArray(input.expertise)
    ? input.expertise
        .map((item: any) => String(item ?? '').trim())
        .filter(Boolean)
    : String(input.expertise ?? '')
        .split(',')
        .map((item: string) => item.trim())
        .filter(Boolean);

  return {
    kind: input.kind === 'splash' ? 'splash' : 'faculty',
    name: String(input.name ?? '').trim(),
    designation: String(input.designation ?? '').trim(),
    qualification: String(input.qualification ?? '').trim(),
    department: String(input.department ?? '').trim(),
    experience: String(input.experience ?? '').trim(),
    description: String(input.description ?? '').trim(),
    expertise,
    photo: String(input.photo ?? '').trim(),
    email: String(input.email ?? '').trim(),
    linkedin: String(input.linkedin ?? '').trim(),
    website: String(input.website ?? '').trim(),
    displayOrder: Number.isFinite(Number(input.displayOrder)) ? Number(input.displayOrder) : 0,
    isVisible: typeof input.isVisible === 'boolean' ? input.isVisible : true,
    enabled: typeof input.enabled === 'boolean' ? input.enabled : true,
    backgroundImage: String(input.backgroundImage ?? '').trim(),
    logo: String(input.logo ?? '').trim(),
    heading: String(input.heading ?? '').trim(),
    subheading: String(input.subheading ?? '').trim(),
    loadingText: String(input.loadingText ?? '').trim(),
    overlayColor: String(input.overlayColor ?? '').trim(),
    overlayOpacity: Number.isFinite(Number(input.overlayOpacity)) ? Number(input.overlayOpacity) : 0.78,
    maxDuration: Number.isFinite(Number(input.maxDuration)) ? Number(input.maxDuration) : 5000,
  };
};

const toPlain = (value: any) => {
  if (!value) return null;
  return typeof value.toObject === 'function' ? value.toObject() : value;
};

export const getFaculties = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!isMongoConnected()) {
      res.status(503).json({ error: 'Service Unavailable', message: 'MongoDB is not connected.' });
      return;
    }

    const faculties = await Faculty.find({ kind: 'faculty' }).sort({ displayOrder: 1, createdAt: 1, _id: 1 }).lean();
    res.status(200).json({ faculties });
  } catch (error: any) {
    console.error('Error fetching faculties:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to fetch faculties.' });
  }
};

export const getFacultyById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!isMongoConnected()) {
      res.status(503).json({ error: 'Service Unavailable', message: 'MongoDB is not connected.' });
      return;
    }

    const faculty = await Faculty.findOne({ _id: req.params.id, kind: 'faculty' }).lean();
    if (!faculty) {
      res.status(404).json({ error: 'Faculty not found' });
      return;
    }

    res.status(200).json({ faculty });
  } catch (error: any) {
    console.error('Error fetching faculty by id:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to fetch faculty.' });
  }
};

export const createFaculty = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!isMongoConnected()) {
      res.status(503).json({ error: 'Service Unavailable', message: 'MongoDB is not connected.' });
      return;
    }

    const payload = normalizeFacultyPayload(req.body);
    if (!payload.name || !payload.designation) {
      res.status(400).json({ error: 'Validation Error: Name and designation are required' });
      return;
    }

    const faculty = await Faculty.create({ ...payload, kind: 'faculty' });
    res.status(201).json({ success: true, faculty: toPlain(faculty) });
  } catch (error: any) {
    console.error('Error creating faculty:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to create faculty.' });
  }
};

export const updateFaculty = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!isMongoConnected()) {
      res.status(503).json({ error: 'Service Unavailable', message: 'MongoDB is not connected.' });
      return;
    }

    const existing = await Faculty.findOne({ _id: req.params.id, kind: 'faculty' });
    if (!existing) {
      res.status(404).json({ error: 'Faculty not found' });
      return;
    }

    const payload = normalizeFacultyPayload(req.body);
    if (!payload.name || !payload.designation) {
      res.status(400).json({ error: 'Validation Error: Name and designation are required' });
      return;
    }

    Object.assign(existing, payload, { kind: 'faculty' });
    await existing.save();
    res.status(200).json({ success: true, faculty: toPlain(existing) });
  } catch (error: any) {
    console.error('Error updating faculty:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to update faculty.' });
  }
};

export const deleteFaculty = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!isMongoConnected()) {
      res.status(503).json({ error: 'Service Unavailable', message: 'MongoDB is not connected.' });
      return;
    }

    const deleted = await Faculty.findOneAndDelete({ _id: req.params.id, kind: 'faculty' });
    if (!deleted) {
      res.status(404).json({ error: 'Faculty not found' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error deleting faculty:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to delete faculty.' });
  }
};

export const toggleFacultyVisibility = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!isMongoConnected()) {
      res.status(503).json({ error: 'Service Unavailable', message: 'MongoDB is not connected.' });
      return;
    }

    const faculty = await Faculty.findOne({ _id: req.params.id, kind: 'faculty' });
    if (!faculty) {
      res.status(404).json({ error: 'Faculty not found' });
      return;
    }

    faculty.isVisible = typeof req.body?.isVisible === 'boolean' ? req.body.isVisible : !faculty.isVisible;
    await faculty.save();
    res.status(200).json({ success: true, faculty: toPlain(faculty) });
  } catch (error: any) {
    console.error('Error toggling faculty visibility:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to update faculty visibility.' });
  }
};

export const getSplashScreenConfig = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!isMongoConnected()) {
      res.status(200).json({ splash: DEFAULT_SPLASH_CONFIG });
      return;
    }

    const splash = await Faculty.findOne({ kind: 'splash' }).lean();
    const config = splash ? { ...DEFAULT_SPLASH_CONFIG, ...splash } : DEFAULT_SPLASH_CONFIG;
    res.status(200).json({ splash: config });
  } catch (error: any) {
    console.error('Error fetching splash screen config:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to fetch splash screen configuration.' });
  }
};

export const updateSplashScreenConfig = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!isMongoConnected()) {
      res.status(503).json({ error: 'Service Unavailable', message: 'MongoDB is not connected.' });
      return;
    }

    const payload = normalizeFacultyPayload(req.body);
    const nextConfig = {
      ...DEFAULT_SPLASH_CONFIG,
      ...payload,
      kind: 'splash' as const,
      enabled: typeof req.body?.enabled === 'boolean' ? req.body.enabled : DEFAULT_SPLASH_CONFIG.enabled,
      backgroundImage: String(req.body?.backgroundImage ?? '').trim(),
      logo: String(req.body?.logo ?? '').trim(),
      heading: String(req.body?.heading ?? '').trim(),
      subheading: String(req.body?.subheading ?? '').trim(),
      loadingText: String(req.body?.loadingText ?? '').trim(),
      overlayColor: String(req.body?.overlayColor ?? '').trim(),
      overlayOpacity: Number.isFinite(Number(req.body?.overlayOpacity)) ? Number(req.body?.overlayOpacity) : DEFAULT_SPLASH_CONFIG.overlayOpacity,
      maxDuration: Number.isFinite(Number(req.body?.maxDuration)) ? Number(req.body?.maxDuration) : DEFAULT_SPLASH_CONFIG.maxDuration,
    };

    let splash = await Faculty.findOne({ kind: 'splash' });
    if (!splash) {
      splash = new Faculty(nextConfig);
    } else {
      Object.assign(splash, nextConfig);
    }

    await splash.save();
    res.status(200).json({ success: true, splash: toPlain(splash) });
  } catch (error: any) {
    console.error('Error updating splash screen config:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to update splash screen configuration.' });
  }
};
