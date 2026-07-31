import { Router } from 'express';
import {
  createDocument,
  deleteDocument,
  getDocuments,
  getDocumentById,
  toggleDocumentVisibility,
  updateDocument,
} from '../controllers/documentController';
import { verifyFirebaseToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.post('/', verifyFirebaseToken, createDocument);
router.put('/:id', verifyFirebaseToken, updateDocument);
router.delete('/:id', verifyFirebaseToken, deleteDocument);
router.patch('/:id/visibility', verifyFirebaseToken, toggleDocumentVisibility);

export default router;
