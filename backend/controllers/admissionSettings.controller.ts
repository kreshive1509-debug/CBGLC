import { Request, Response } from 'express';
import { storage } from '../utils/storage';

export const getAdmissionSettings = async (req: Request, res: Response) => {
  try {
    const settings = await storage.getAdmissionSettings();
    res.status(200).json(settings);
  } catch (error: any) {
    console.error('Error fetching admission settings:', error);
    res.status(500).json({ message: 'Error fetching admission settings', error: error.message });
  }
};

export const updateAdmissionSettings = async (req: Request, res: Response) => {
  try {
    const settings = await storage.updateAdmissionSettings(req.body);
    res.status(200).json(settings);
  } catch (error: any) {
    console.error('Error updating admission settings:', error);
    res.status(500).json({ message: 'Error updating admission settings', error: error.message });
  }
};
