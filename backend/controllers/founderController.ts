import { Response } from 'express';
import { storage } from '../utils/storage';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { triggerVercelDeployment } from '../utils/vercelDeployment';

export const getFounder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const founder = await storage.getFounder();
    res.status(200).json(founder);
  } catch (error: any) {
    console.error('Error fetching founder details:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to fetch founder details.' });
  }
};

export const updateFounder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, designation, message, googleDrivePhotoUrl } = req.body;

    if (!name || !designation || !message) {
      res.status(400).json({ error: 'Validation Error: Name, designation and message are required' });
      return;
    }

    const updatedFounder = await storage.updateFounder({
      name,
      designation,
      message,
      googleDrivePhotoUrl: googleDrivePhotoUrl || ''
    });

    const deploymentTriggered = storage.isMongoConnected()
      ? await triggerVercelDeployment('Founder Message')
      : false;

    res.status(200).json({
      success: true,
      deploymentTriggered,
      message: deploymentTriggered
        ? 'Founder details updated successfully. Website deployment has started. Changes will be live shortly.'
        : 'Founder details updated successfully, but automatic deployment could not be started.',
      founder: updatedFounder
    });
  } catch (error: any) {
    console.error('Error updating founder details:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to update founder details.' });
  }
};
