import { Response } from 'express';
import { isMongoConnected } from '../config/db';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import AcademicDocument from '../models/AcademicDocument';

const normalizeDocumentPayload = (input: any = {}) => {
  return {
    title: String(input.title ?? '').trim(),
    description: String(input.description ?? '').trim(),
    category: String(input.category ?? '').trim(),
    link: String(input.link ?? '').trim(),
    linkType: ['Google Drive', 'Google Form', 'External URL', 'PDF'].includes(input.linkType) 
      ? input.linkType 
      : 'External URL',
    buttonText: String(input.buttonText ?? 'Open').trim(),
    publishDate: input.publishDate ? new Date(input.publishDate) : new Date(),
    validTill: input.validTill ? new Date(input.validTill) : undefined,
    priority: ['High', 'Medium', 'Low'].includes(input.priority) ? input.priority : 'Medium',
    displayOrder: Number.isFinite(Number(input.displayOrder)) ? Number(input.displayOrder) : 0,
    status: ['Published', 'Draft', 'Expired'].includes(input.status) ? input.status : 'Published',
    isVisible: typeof input.isVisible === 'boolean' ? input.isVisible : true,
    openInNewTab: typeof input.openInNewTab === 'boolean' ? input.openInNewTab : true,
  };
};

const toPlain = (value: any) => {
  if (!value) return null;
  return typeof value.toObject === 'function' ? value.toObject() : value;
};

export const getDocuments = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!isMongoConnected()) {
      res.status(503).json({ error: 'Service Unavailable', message: 'MongoDB is not connected.' });
      return;
    }

    const documents = await AcademicDocument.find().sort({ displayOrder: 1, publishDate: -1 }).lean();
    res.status(200).json({ documents });
  } catch (error: any) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to fetch documents.' });
  }
};

export const getDocumentById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!isMongoConnected()) {
      res.status(503).json({ error: 'Service Unavailable', message: 'MongoDB is not connected.' });
      return;
    }

    const document = await AcademicDocument.findById(req.params.id).lean();
    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    res.status(200).json({ document });
  } catch (error: any) {
    console.error('Error fetching document by id:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to fetch document.' });
  }
};

export const createDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!isMongoConnected()) {
      res.status(503).json({ error: 'Service Unavailable', message: 'MongoDB is not connected.' });
      return;
    }

    const payload = normalizeDocumentPayload(req.body);
    if (!payload.title || !payload.category || !payload.link) {
      res.status(400).json({ error: 'Validation Error: Title, category, and link are required' });
      return;
    }

    const document = await AcademicDocument.create(payload);
    res.status(201).json({ success: true, document: toPlain(document) });
  } catch (error: any) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to create document.' });
  }
};

export const updateDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!isMongoConnected()) {
      res.status(503).json({ error: 'Service Unavailable', message: 'MongoDB is not connected.' });
      return;
    }

    const existing = await AcademicDocument.findById(req.params.id);
    if (!existing) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    const payload = normalizeDocumentPayload(req.body);
    if (!payload.title || !payload.category || !payload.link) {
      res.status(400).json({ error: 'Validation Error: Title, category, and link are required' });
      return;
    }

    Object.assign(existing, payload);
    await existing.save();
    res.status(200).json({ success: true, document: toPlain(existing) });
  } catch (error: any) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to update document.' });
  }
};

export const deleteDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!isMongoConnected()) {
      res.status(503).json({ error: 'Service Unavailable', message: 'MongoDB is not connected.' });
      return;
    }

    const deleted = await AcademicDocument.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to delete document.' });
  }
};

export const toggleDocumentVisibility = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!isMongoConnected()) {
      res.status(503).json({ error: 'Service Unavailable', message: 'MongoDB is not connected.' });
      return;
    }

    const document = await AcademicDocument.findById(req.params.id);
    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    document.isVisible = typeof req.body?.isVisible === 'boolean' ? req.body.isVisible : !document.isVisible;
    await document.save();
    res.status(200).json({ success: true, document: toPlain(document) });
  } catch (error: any) {
    console.error('Error toggling document visibility:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to update document visibility.' });
  }
};
