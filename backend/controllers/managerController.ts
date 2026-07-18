import { Response } from 'express';
import { storage } from '../utils/storage';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export const getManager = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const manager = await storage.getManager();
    res.status(200).json(manager);
  } catch (error: any) {
    console.error('Error fetching manager details:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
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

    res.status(200).json({ message: 'Manager details updated successfully', manager: updatedManager });
  } catch (error: any) {
    console.error('Error updating manager details:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};
