import { Response } from 'express';
import { storage } from '../utils/storage';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { triggerVercelDeployment } from '../utils/vercelDeployment';

export const getGalleryImages = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { category, search, visible } = req.query;
    const images = await storage.getGalleryImages({
      category: category as string,
      search: search as string,
      visible: visible === 'true' ? true : visible === 'false' ? false : undefined
    });

    res.status(200).json(images);
  } catch (error: any) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to fetch gallery images.' });
  }
};

export const getGalleryImageById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const image = await storage.getGalleryImageById(id);
    if (!image) {
      res.status(404).json({ error: 'Gallery image not found' });
      return;
    }
    res.status(200).json(image);
  } catch (error: any) {
    console.error('Error fetching gallery image by id:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to fetch gallery image.' });
  }
};

export const createGalleryImage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { url, title, category, visible, displayOrder } = req.body;

    if (!url || !title || !category) {
      res.status(400).json({ error: 'Validation Error: Image URL, title, and category are required' });
      return;
    }

    const existing = await storage.findGalleryImageByUrl(url);
    if (existing) {
      res.status(400).json({ error: 'Duplicate Image URL is not allowed' });
      return;
    }

    const newImage = await storage.createGalleryImage({
      url,
      title,
      category,
      visible: visible ?? true,
      displayOrder: typeof displayOrder === 'number' ? displayOrder : 0
    });

    const deploymentTriggered = storage.isMongoConnected()
      ? await triggerVercelDeployment('Gallery')
      : false;

    res.status(201).json({
      success: true,
      deploymentTriggered,
      message: deploymentTriggered
        ? 'Gallery image added successfully. Website deployment has started. Changes will be live shortly.'
        : 'Gallery image added successfully, but automatic deployment could not be started.',
      image: newImage
    });
  } catch (error: any) {
    console.error('Error creating gallery image:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to create gallery image.' });
  }
};

export const updateGalleryImage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { url, title, category, visible, displayOrder } = req.body;

    const existingImage = await storage.getGalleryImageById(id);
    if (!existingImage) {
      res.status(404).json({ error: 'Gallery image not found' });
      return;
    }

    if (!url || !title || !category) {
      res.status(400).json({ error: 'Validation Error: Image URL, title, and category are required' });
      return;
    }

    const duplicateImage = await storage.findGalleryImageByUrl(url);
    if (duplicateImage && duplicateImage._id.toString() !== id) {
      res.status(400).json({ error: 'Duplicate Image URL is not allowed' });
      return;
    }

    const updatedImage = await storage.updateGalleryImage(id, {
      url,
      title,
      category,
      visible: visible ?? true,
      displayOrder: typeof displayOrder === 'number' ? displayOrder : existingImage.displayOrder
    });

    const deploymentTriggered = storage.isMongoConnected()
      ? await triggerVercelDeployment('Gallery')
      : false;

    res.status(200).json({
      success: true,
      deploymentTriggered,
      message: deploymentTriggered
        ? 'Gallery image updated successfully. Website deployment has started. Changes will be live shortly.'
        : 'Gallery image updated successfully, but automatic deployment could not be started.',
      image: updatedImage
    });
  } catch (error: any) {
    console.error('Error updating gallery image:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to update gallery image.' });
  }
};

export const deleteGalleryImage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existingImage = await storage.getGalleryImageById(id);
    if (!existingImage) {
      res.status(404).json({ error: 'Gallery image not found' });
      return;
    }

    const deleted = await storage.deleteGalleryImage(id);
    if (!deleted) {
      res.status(500).json({ error: 'Failed to delete gallery image' });
      return;
    }

    const deploymentTriggered = storage.isMongoConnected()
      ? await triggerVercelDeployment('Gallery')
      : false;

    res.status(200).json({
      success: true,
      deploymentTriggered,
      message: deploymentTriggered
        ? 'Gallery image deleted successfully. Website deployment has started. Changes will be live shortly.'
        : 'Gallery image deleted successfully, but automatic deployment could not be started.'
    });
  } catch (error: any) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to delete gallery image.' });
  }
};

export const toggleGalleryImageVisibility = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { visible } = req.body;
    const existingImage = await storage.getGalleryImageById(id);
    if (!existingImage) {
      res.status(404).json({ error: 'Gallery image not found' });
      return;
    }
    const updated = await storage.updateGalleryImage(id, { visible: Boolean(visible) });
    const deploymentTriggered = storage.isMongoConnected()
      ? await triggerVercelDeployment('Gallery')
      : false;

    res.status(200).json({
      success: true,
      deploymentTriggered,
      message: deploymentTriggered
        ? `Gallery image ${visible ? 'published' : 'hidden'} successfully. Website deployment has started. Changes will be live shortly.`
        : `Gallery image ${visible ? 'published' : 'hidden'} successfully, but automatic deployment could not be started.`,
      image: updated
    });
  } catch (error: any) {
    console.error('Error toggling gallery image visibility:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to update gallery visibility.' });
  }
};
