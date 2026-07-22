import { Response } from 'express';
import { storage } from '../utils/storage';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { triggerVercelDeployment } from '../utils/vercelDeployment';

export const getSettings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!storage.isMongoConnected()) {
      res.status(503).json({ error: 'Service Unavailable', message: 'MongoDB is not connected.' });
      return;
    }

    const settings = await storage.getSettings();
    res.status(200).json(settings);
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to fetch settings.' });
  }
};

export const updateSettings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!storage.isMongoConnected()) {
      res.status(503).json({ error: 'Service Unavailable', message: 'MongoDB is not connected.' });
      return;
    }

    const updatedSettings = await storage.updateSettings(req.body);
    const deploymentTriggered = storage.isMongoConnected()
      ? await triggerVercelDeployment('Website Settings')
      : false;

    res.status(200).json({
      success: true,
      deploymentTriggered,
      message: deploymentTriggered
        ? 'Content saved successfully. Website deployment has started. Changes will be live shortly.'
        : 'Content saved successfully, but automatic deployment could not be started.',
      settings: updatedSettings
    });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to update settings.' });
  }
};
