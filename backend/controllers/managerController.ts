import { Response } from 'express';
import { storage } from '../utils/storage';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { triggerVercelDeployment } from '../utils/vercelDeployment';

export const getManager = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const manager = await storage.getManager();
    res.status(200).json(manager);
  } catch (error: any) {
    console.error('Error fetching manager details:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to fetch manager details.' });
  }
};

export const updateManager = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, designation, message, googleDrivePhotoUrl } = req.body;

    if (!name || !designation || !message) {
      res.status(400).json({ error: 'Validation Error: Name, designation and message are required' });
      return;
    }

    const updatedManager = await storage.updateManager({
      name,
      designation,
      message,
      googleDrivePhotoUrl: googleDrivePhotoUrl || ''
    });

    const deploymentTriggered = storage.isMongoConnected()
      ? await triggerVercelDeployment('Manager Message')
      : false;

    res.status(200).json({
      success: true,
      deploymentTriggered,
      message: deploymentTriggered
        ? 'Manager details updated successfully. Website deployment has started. Changes will be live shortly.'
        : 'Manager details updated successfully, but automatic deployment could not be started.',
      manager: updatedManager
    });
  } catch (error: any) {
    console.error('Error updating manager details:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to update manager details.' });
  }
};
