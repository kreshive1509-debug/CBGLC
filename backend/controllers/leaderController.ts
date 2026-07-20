import { Response } from 'express';
import { storage } from '../utils/storage';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export const getLeaders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const leaders = await storage.getLeaders();
    res.status(200).json(leaders);
  } catch (error: any) {
    console.error('Error fetching leaders:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const getLeaderById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const leader = await storage.getLeaderById(id);
    if (!leader) {
      res.status(404).json({ error: 'Leader not found' });
      return;
    }
    res.status(200).json(leader);
  } catch (error: any) {
    console.error('Error fetching leader by id:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const createLeader = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { photoUrl, fullName, designation, editorialMessage, buttonText, buttonUrl, published, featured, displayOrder } = req.body;

    if (!photoUrl || !fullName || !designation || !editorialMessage) {
      res.status(400).json({ error: 'Validation Error: Photo URL, full name, designation, and message are required' });
      return;
    }

    const existing = await storage.findLeaderByPhotoUrl(photoUrl);
    if (existing) {
      res.status(400).json({ error: 'Duplicate Photo URL is not allowed' });
      return;
    }

    const leader = await storage.createLeader({
      photoUrl,
      fullName,
      designation,
      editorialMessage,
      buttonText: buttonText || '',
      buttonUrl: buttonUrl || '',
      published: published ?? true,
      featured: featured ?? false,
      displayOrder: typeof displayOrder === 'number' ? displayOrder : 0
    });

    res.status(201).json({ message: 'Leader added successfully', leader });
  } catch (error: any) {
    console.error('Error creating leader:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const updateLeader = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { photoUrl, fullName, designation, editorialMessage, buttonText, buttonUrl, published, featured, displayOrder } = req.body;

    const existingLeader = await storage.getLeaderById(id);
    if (!existingLeader) {
      res.status(404).json({ error: 'Leader not found' });
      return;
    }

    if (!photoUrl || !fullName || !designation || !editorialMessage) {
      res.status(400).json({ error: 'Validation Error: Photo URL, full name, designation, and message are required' });
      return;
    }

    const duplicate = await storage.findLeaderByPhotoUrl(photoUrl);
    if (duplicate && duplicate._id.toString() !== id) {
      res.status(400).json({ error: 'Duplicate Photo URL is not allowed' });
      return;
    }

    const leader = await storage.updateLeader(id, {
      photoUrl,
      fullName,
      designation,
      editorialMessage,
      buttonText: buttonText || '',
      buttonUrl: buttonUrl || '',
      published: published ?? true,
      featured: featured ?? false,
      displayOrder: typeof displayOrder === 'number' ? displayOrder : existingLeader.displayOrder
    });

    res.status(200).json({ message: 'Leader updated successfully', leader });
  } catch (error: any) {
    console.error('Error updating leader:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const deleteLeader = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existingLeader = await storage.getLeaderById(id);
    if (!existingLeader) {
      res.status(404).json({ error: 'Leader not found' });
      return;
    }

    const deleted = await storage.deleteLeader(id);
    if (!deleted) {
      res.status(500).json({ error: 'Failed to delete leader' });
      return;
    }

    res.status(200).json({ message: 'Leader deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting leader:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const toggleLeaderPublish = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { published } = req.body;
    const leader = await storage.getLeaderById(id);
    if (!leader) {
      res.status(404).json({ error: 'Leader not found' });
      return;
    }
    if (typeof published !== 'boolean') {
      res.status(400).json({ error: 'Validation Error: Published status must be a boolean' });
      return;
    }
    const updated = await storage.updateLeader(id, { published });
    res.status(200).json({ message: `Leader ${published ? 'published' : 'unpublished'} successfully`, leader: updated });
  } catch (error: any) {
    console.error('Error toggling leader publish status:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const toggleLeaderFeatured = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { featured } = req.body;
    const leader = await storage.getLeaderById(id);
    if (!leader) {
      res.status(404).json({ error: 'Leader not found' });
      return;
    }
    if (typeof featured !== 'boolean') {
      res.status(400).json({ error: 'Validation Error: Featured status must be a boolean' });
      return;
    }
    const updated = await storage.updateLeader(id, { featured });
    res.status(200).json({ message: `Leader feature updated successfully`, leader: updated });
  } catch (error: any) {
    console.error('Error toggling leader featured status:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};
