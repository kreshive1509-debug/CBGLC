import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { getFounder, updateFounder } from '../controllers/founderController';
import { getManager, updateManager } from '../controllers/managerController';
import {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  togglePublishNotice,
  togglePinNotice
} from '../controllers/noticeController';import { getGalleryImages, getGalleryImageById, createGalleryImage, updateGalleryImage, deleteGalleryImage, toggleGalleryImageVisibility } from '../controllers/galleryController';
import { getLeaders, getLeaderById, createLeader, updateLeader, deleteLeader, toggleLeaderPublish, toggleLeaderFeatured } from '../controllers/leaderController';import { createEnquiry } from '../controllers/admission.controller';
import admissionRoutes from './admission.routes';
import admissionSettingsRoutes from './admissionSettings.routes';
import { verifyFirebaseToken } from '../middlewares/authMiddleware';
import { isMongoConnected } from '../config/db';

const router = Router();

// --- PUBLIC ROUTES ---
router.get('/settings', getSettings);
router.get('/db-status', (req, res) => {
  const connected = isMongoConnected();
  res.json({
    connected,
    mode: connected ? 'MongoDB' : 'Local JSON Fallback',
    uriSet: !!process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('YOUR_MONGODB_URI')
  });
});
router.get('/founder', getFounder);
router.get('/manager', getManager);
router.get('/gallery', getGalleryImages);
router.get('/gallery/:id', getGalleryImageById);
router.get('/notices', getNotices);
router.get('/notices/:id', getNoticeById);
router.post('/enquiries', createEnquiry);
router.use('/admission-settings', admissionSettingsRoutes);

// --- PROTECTED ROUTES (ADMIN ONLY) ---
router.put('/settings', verifyFirebaseToken, updateSettings);
router.put('/founder', verifyFirebaseToken, updateFounder);
router.put('/manager', verifyFirebaseToken, updateManager);

router.post('/notices', verifyFirebaseToken, createNotice);
router.put('/notices/:id', verifyFirebaseToken, updateNotice);
router.delete('/notices/:id', verifyFirebaseToken, deleteNotice);
router.patch('/notices/:id/publish', verifyFirebaseToken, togglePublishNotice);
router.patch('/notices/:id/pin', verifyFirebaseToken, togglePinNotice);

router.post('/gallery', verifyFirebaseToken, createGalleryImage);
router.put('/gallery/:id', verifyFirebaseToken, updateGalleryImage);
router.delete('/gallery/:id', verifyFirebaseToken, deleteGalleryImage);
router.patch('/gallery/:id/visible', verifyFirebaseToken, toggleGalleryImageVisibility);

router.get('/leaders', getLeaders);
router.get('/leaders/:id', getLeaderById);
router.post('/leaders', verifyFirebaseToken, createLeader);
router.put('/leaders/:id', verifyFirebaseToken, updateLeader);
router.delete('/leaders/:id', verifyFirebaseToken, deleteLeader);
router.patch('/leaders/:id/publish', verifyFirebaseToken, toggleLeaderPublish);
router.patch('/leaders/:id/featured', verifyFirebaseToken, toggleLeaderFeatured);

router.use('/enquiries', verifyFirebaseToken, admissionRoutes);

export default router;
