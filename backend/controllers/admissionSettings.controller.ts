import { Request, Response } from 'express';
import { storage } from '../utils/storage';
import { triggerVercelDeployment } from '../utils/vercelDeployment';

export const getAdmissionSettings = async (req: Request, res: Response) => {
  try {
    if (!storage.isMongoConnected()) {
      res.status(503).json({ error: 'Service Unavailable', message: 'MongoDB is not connected.' });
      return;
    }

    const settings = await storage.getAdmissionSettings();
    res.status(200).json(settings);
  } catch (error: any) {
    console.error('Error fetching admission settings:', error);
    res.status(500).json({ message: 'Error fetching admission settings' });
  }
};

export const updateAdmissionSettings = async (req: Request, res: Response) => {
  try {
    if (!storage.isMongoConnected()) {
      res.status(503).json({ error: 'Service Unavailable', message: 'MongoDB is not connected.' });
      return;
    }

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
  } catch (error: any) {
    console.error('Error updating admission settings:', error);
    res.status(500).json({ message: 'Error updating admission settings' });
  }
};
