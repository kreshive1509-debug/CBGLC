import { Response } from 'express';
import { storage } from '../utils/storage';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export const getSettings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const settings = await storage.getSettings();
    res.status(200).json(settings);
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const updateSettings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const updatedSettings = await storage.updateSettings(req.body);
    res.status(200).json({ message: 'Settings updated successfully', settings: updatedSettings });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};
