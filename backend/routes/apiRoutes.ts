import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
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
  togglePinNotice,
} from '../controllers/noticeController';
import {
  getGalleryImages,
  getGalleryImageById,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  toggleGalleryImageVisibility,
} from '../controllers/galleryController';
import {
  getLeaders,
  getLeaderById,
  createLeader,
  updateLeader,
  deleteLeader,
  toggleLeaderPublish,
  toggleLeaderFeatured,
} from '../controllers/leaderController';
import { createEnquiry } from '../controllers/admission.controller';
import { createContactMessage } from '../controllers/contactController';
import { getVisitorCount, getVisitorStats, registerVisitor } from '../controllers/visitorController';
import {
  getHero,
  updateHero,
  getAbout,
  updateAbout,
  getVision,
  updateVision,
  getMission,
  updateMission,
  getCourses,
  updateCourses,
  getFooter,
  updateFooter,
  getContact,
  updateContact,
  getSocialLinks,
  updateSocialLinks,
  getBreakingNews,
  updateBreakingNews,
  getAdmission,
  updateAdmission,
  getLeadership,
  updateLeadership,
  getVisitorCounter,
  updateVisitorCounter,
  getRoutesReport,
  updateNoticeByBody,
  deleteNoticeByBody,
  updateGalleryByBody,
} from '../controllers/cmsCompatController';
import admissionRoutes from './admission.routes';
import admissionSettingsRoutes from './admissionSettings.routes';
import facultyRoutes from './facultyRoutes';
import documentRoutes from './documentRoutes';
import { verifyFirebaseToken } from '../middlewares/authMiddleware';
import { isMongoConnected } from '../config/db';

const router = Router();

// --- PUBLIC ROUTES ---
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    database: isMongoConnected() ? 'Connected' : 'Disconnected',
    server: 'Running',
    timestamp: new Date().toISOString(),
  });
});
router.get('/routes', getRoutesReport);
router.get('/settings', getSettings);
router.get('/db-status', (req, res) => {
  const connected = isMongoConnected();
  res.json({
    connected,
    mode: connected ? 'MongoDB' : 'Disconnected',
    uriSet: !!process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('YOUR_MONGODB_URI')
  });
});
router.get('/hero', getHero);
router.get('/about', getAbout);
router.get('/vision', getVision);
router.get('/mission', getMission);
router.get('/courses', getCourses);
router.get('/founder', getFounder);
router.get('/manager', getManager);
router.get('/gallery', getGalleryImages);
router.get('/gallery/:id', getGalleryImageById);
router.get('/notices', getNotices);
router.get('/notices/:id', getNoticeById);
router.get('/footer', getFooter);
router.get('/contact', getContact);
router.get('/social-links', getSocialLinks);
router.get('/admission', getAdmission);
router.get('/leadership', getLeadership);
router.get('/breaking-news', getBreakingNews);
router.get('/visitor-count', getVisitorCount);
router.get('/visitor-stats', getVisitorStats);
router.get('/visitor-counter', getVisitorCounter);
router.post('/enquiries', createEnquiry);
router.post('/admission', createEnquiry);
router.post('/contact', createContactMessage);
router.use('/admission-settings', admissionSettingsRoutes);
router.post(
  '/visitor',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many visitor requests, please try again later.' },
  }),
  registerVisitor
);

// --- PROTECTED ROUTES (ADMIN ONLY) ---
router.put('/settings', verifyFirebaseToken, updateSettings);
router.put('/hero', verifyFirebaseToken, updateHero);
router.put('/about', verifyFirebaseToken, updateAbout);
router.put('/vision', verifyFirebaseToken, updateVision);
router.put('/mission', verifyFirebaseToken, updateMission);
router.put('/courses', verifyFirebaseToken, updateCourses);
router.put('/founder', verifyFirebaseToken, updateFounder);
router.put('/manager', verifyFirebaseToken, updateManager);
router.put('/footer', verifyFirebaseToken, updateFooter);
router.put('/contact', verifyFirebaseToken, updateContact);
router.put('/social-links', verifyFirebaseToken, updateSocialLinks);
router.put('/breaking-news', verifyFirebaseToken, updateBreakingNews);
router.put('/admission', verifyFirebaseToken, updateAdmission);
router.put('/leadership', verifyFirebaseToken, updateLeadership);
router.put('/visitor-counter', verifyFirebaseToken, updateVisitorCounter);

router.post('/notices', verifyFirebaseToken, createNotice);
router.put('/notices/:id', verifyFirebaseToken, updateNotice);
router.delete('/notices/:id', verifyFirebaseToken, deleteNotice);
router.put('/notices', verifyFirebaseToken, updateNoticeByBody);
router.delete('/notices', verifyFirebaseToken, deleteNoticeByBody);
router.patch('/notices/:id/publish', verifyFirebaseToken, togglePublishNotice);
router.patch('/notices/:id/pin', verifyFirebaseToken, togglePinNotice);

router.post('/gallery', verifyFirebaseToken, createGalleryImage);
router.put('/gallery/:id', verifyFirebaseToken, updateGalleryImage);
router.delete('/gallery/:id', verifyFirebaseToken, deleteGalleryImage);
router.put('/gallery', verifyFirebaseToken, updateGalleryByBody);
router.patch('/gallery/:id/visible', verifyFirebaseToken, toggleGalleryImageVisibility);

router.get('/leaders', getLeaders);
router.get('/leaders/:id', getLeaderById);
router.post('/leaders', verifyFirebaseToken, createLeader);
router.put('/leaders/:id', verifyFirebaseToken, updateLeader);
router.delete('/leaders/:id', verifyFirebaseToken, deleteLeader);
router.patch('/leaders/:id/publish', verifyFirebaseToken, toggleLeaderPublish);
router.patch('/leaders/:id/featured', verifyFirebaseToken, toggleLeaderFeatured);

router.use('/enquiries', verifyFirebaseToken, admissionRoutes);
router.use('/faculties', facultyRoutes);
router.use('/documents', documentRoutes);

export default router;
