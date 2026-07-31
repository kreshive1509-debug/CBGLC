import { Router } from 'express';
import {
  createFaculty,
  deleteFaculty,
  getFaculties,
  getFacultyById,
  getSplashScreenConfig,
  toggleFacultyVisibility,
  updateFaculty,
  updateSplashScreenConfig,
} from '../controllers/facultyController';
import { verifyFirebaseToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getFaculties);
router.get('/splash-screen', getSplashScreenConfig);
router.put('/splash-screen', verifyFirebaseToken, updateSplashScreenConfig);
router.get('/:id', getFacultyById);
router.post('/', verifyFirebaseToken, createFaculty);
router.put('/:id', verifyFirebaseToken, updateFaculty);
router.delete('/:id', verifyFirebaseToken, deleteFaculty);
router.patch('/:id/visibility', verifyFirebaseToken, toggleFacultyVisibility);

export default router;
