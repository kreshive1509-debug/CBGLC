import { Response } from 'express';
import { storage } from '../utils/storage';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { triggerVercelDeployment } from '../utils/vercelDeployment';

export const getLeaders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const leaders = await storage.getLeaders();
    res.status(200).json(leaders);
  } catch (error: any) {
    console.error('Error fetching leaders:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to fetch leaders.' });
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
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to fetch leader.' });
  }
};

export const createLeader = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { fullName, designation, membership, editorialMessage, published, displayOrder } = req.body;

    if (!fullName || !designation || !membership) {
      res.status(400).json({ error: 'Validation Error: Full name, designation, and membership are required' });
      return;
    }

    const leader = await storage.createLeader({
      fullName,
      designation,
      membership,
      editorialMessage,
      published: published ?? true,
      displayOrder: typeof displayOrder === 'number' ? displayOrder : 0
    });

    const deploymentTriggered = storage.isMongoConnected()
      ? await triggerVercelDeployment('Leadership')
      : false;

    res.status(201).json({
      success: true,
      deploymentTriggered,
      message: deploymentTriggered
        ? 'Leader added successfully. Website deployment has started. Changes will be live shortly.'
        : 'Leader added successfully, but automatic deployment could not be started.',
      leader
    });
  } catch (error: any) {
    console.error('Error creating leader:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to create leader.' });
  }
};

export const updateLeader = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { fullName, designation, membership, editorialMessage, published, displayOrder } = req.body;

    const existingLeader = await storage.getLeaderById(id);
    if (!existingLeader) {
      res.status(404).json({ error: 'Leader not found' });
      return;
    }

    if (!fullName || !designation || !membership) {
      res.status(400).json({ error: 'Validation Error: Full name, designation, and membership are required' });
      return;
    }

    const leader = await storage.updateLeader(id, {
      fullName,
      designation,
      membership,
      editorialMessage,
      published: published ?? true,
      displayOrder: typeof displayOrder === 'number' ? displayOrder : existingLeader.displayOrder
    });

    const deploymentTriggered = storage.isMongoConnected()
      ? await triggerVercelDeployment('Leadership')
      : false;

    res.status(200).json({
      success: true,
      deploymentTriggered,
      message: deploymentTriggered
        ? 'Leader updated successfully. Website deployment has started. Changes will be live shortly.'
        : 'Leader updated successfully, but automatic deployment could not be started.',
      leader
    });
  } catch (error: any) {
    console.error('Error updating leader:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to update leader.' });
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

    const deploymentTriggered = storage.isMongoConnected()
      ? await triggerVercelDeployment('Leadership')
      : false;

    res.status(200).json({
      success: true,
      deploymentTriggered,
      message: deploymentTriggered
        ? 'Leader deleted successfully. Website deployment has started. Changes will be live shortly.'
        : 'Leader deleted successfully, but automatic deployment could not be started.'
    });
  } catch (error: any) {
    console.error('Error deleting leader:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to delete leader.' });
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
    const deploymentTriggered = storage.isMongoConnected()
      ? await triggerVercelDeployment('Leadership')
      : false;

    res.status(200).json({
      success: true,
      deploymentTriggered,
      message: deploymentTriggered
        ? `Leader ${published ? 'published' : 'unpublished'} successfully. Website deployment has started. Changes will be live shortly.`
        : `Leader ${published ? 'published' : 'unpublished'} successfully, but automatic deployment could not be started.`,
      leader: updated
    });
  } catch (error: any) {
    console.error('Error toggling leader publish status:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to update leader publish status.' });
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
    const deploymentTriggered = storage.isMongoConnected()
      ? await triggerVercelDeployment('Leadership')
      : false;

    res.status(200).json({
      success: true,
      deploymentTriggered,
      message: deploymentTriggered
        ? 'Leader feature updated successfully. Website deployment has started. Changes will be live shortly.'
        : 'Leader feature updated successfully, but automatic deployment could not be started.',
      leader: updated
    });
  } catch (error: any) {
    console.error('Error toggling leader featured status:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to update leader featured status.' });
  }
};
