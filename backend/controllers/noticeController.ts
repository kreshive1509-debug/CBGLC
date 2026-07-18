import { Response } from 'express';
import { storage } from '../utils/storage';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export const getNotices = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { category, search, status } = req.query;

    const notices = await storage.getNotices({
      category: category as string,
      search: search as string,
      status: status as string
    });

    res.status(200).json(notices);
  } catch (error: any) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const getNoticeById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const notice = await storage.getNoticeById(id);

    if (!notice) {
      res.status(404).json({ error: 'Notice not found' });
      return;
    }

    res.status(200).json(notice);
  } catch (error: any) {
    console.error('Error fetching notice by id:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const createNotice = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, description, category, publishDate, expiryDate, googleDriveUrl, pinned, published } = req.body;

    if (!title || !description || !category) {
      res.status(400).json({ error: 'Validation Error: Title, description, and category are required' });
      return;
    }

    const newNotice = await storage.createNotice({
      title,
      description,
      category,
      publishDate: publishDate || new Date().toISOString(),
      expiryDate: expiryDate || null,
      googleDriveUrl: googleDriveUrl || '',
      pinned: pinned ?? false,
      published: published ?? true
    });

    res.status(201).json({ message: 'Notice created successfully', notice: newNotice });
  } catch (error: any) {
    console.error('Error creating notice:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const updateNotice = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, category, publishDate, expiryDate, googleDriveUrl, pinned, published } = req.body;

    const existingNotice = await storage.getNoticeById(id);
    if (!existingNotice) {
      res.status(404).json({ error: 'Notice not found' });
      return;
    }

    if (!title || !description || !category) {
      res.status(400).json({ error: 'Validation Error: Title, description, and category are required' });
      return;
    }

    const updatedNotice = await storage.updateNotice(id, {
      title,
      description,
      category,
      publishDate,
      expiryDate: expiryDate || null,
      googleDriveUrl: googleDriveUrl || '',
      pinned: pinned ?? false,
      published: published ?? true
    });

    res.status(200).json({ message: 'Notice updated successfully', notice: updatedNotice });
  } catch (error: any) {
    console.error('Error updating notice:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const deleteNotice = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`[NoticeController] Delete request for ID: ${id}`);
    
    // Check if ID is valid for MongoDB if connected
    if (storage.isMongoConnected() && !storage.isValidObjectId(id)) {
      console.warn(`[NoticeController] Invalid MongoDB ID provided: ${id}. This might be a legacy JSON ID.`);
      res.status(400).json({ error: 'Invalid Notice ID format for MongoDB. Please refresh and try again.' });
      return;
    }

    const existingNotice = await storage.getNoticeById(id);
    if (!existingNotice) {
      console.warn(`[NoticeController] Delete failed: Notice with ID ${id} not found.`);
      res.status(404).json({ error: `Notice with ID ${id} not found` });
      return;
    }

    const result = await storage.deleteNotice(id);
    if (result) {
      console.log(`[NoticeController] Successfully deleted notice ID: ${id}`);
      res.status(200).json({ message: 'Notice deleted successfully' });
    } else {
      console.error(`[NoticeController] Storage layer failed to delete notice ID: ${id}`);
      res.status(500).json({ error: 'Failed to delete notice from storage engine.' });
    }
  } catch (error: any) {
    console.error('[NoticeController] Critical error in deleteNotice:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const togglePublishNotice = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { published } = req.body;

    const existingNotice = await storage.getNoticeById(id);
    if (!existingNotice) {
      res.status(404).json({ error: 'Notice not found' });
      return;
    }

    if (typeof published !== 'boolean') {
      res.status(400).json({ error: 'Validation Error: Published status must be a boolean' });
      return;
    }

    const updatedNotice = await storage.updateNotice(id, { published });
    res.status(200).json({ message: `Notice ${published ? 'published' : 'unpublished'} successfully`, notice: updatedNotice });
  } catch (error: any) {
    console.error('Error toggling publish status:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const togglePinNotice = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { pinned } = req.body;

    const existingNotice = await storage.getNoticeById(id);
    if (!existingNotice) {
      res.status(404).json({ error: 'Notice not found' });
      return;
    }

    if (typeof pinned !== 'boolean') {
      res.status(400).json({ error: 'Validation Error: Pinned status must be a boolean' });
      return;
    }

    const updatedNotice = await storage.updateNotice(id, { pinned });
    res.status(200).json({ message: `Notice ${pinned ? 'pinned' : 'unpinned'} successfully`, notice: updatedNotice });
  } catch (error: any) {
    console.error('Error toggling pin status:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};
