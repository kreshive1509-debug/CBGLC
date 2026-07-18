import { Router } from 'express';
import { getAdmissionSettings, updateAdmissionSettings } from '../controllers/admissionSettings.controller';
import { verifyFirebaseToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getAdmissionSettings);
router.put('/', verifyFirebaseToken, updateAdmissionSettings);

export default router;
