import { Router } from 'express';
import { createEnquiry, getAllEnquiries, updateEnquiryStatus } from '../controllers/admission.controller';

const router = Router();

router.post('/', createEnquiry);
router.get('/', getAllEnquiries);
router.patch('/:id', updateEnquiryStatus);

export default router;
