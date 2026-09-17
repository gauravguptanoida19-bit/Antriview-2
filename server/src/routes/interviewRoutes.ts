import { Router } from 'express';
import { InterviewController } from '../controllers/interviewController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// All interview routes require user authentication
router.use(authenticate);

router.post('/', InterviewController.createInterview);
router.get('/', InterviewController.getInterviews);
router.get('/:id', InterviewController.getInterviewById);
router.patch('/:id', InterviewController.updateInterview);
router.delete('/:id', InterviewController.deleteInterview);

router.post('/:id/start', InterviewController.startInterview);
router.post('/:id/submit', InterviewController.submitAnswer);
router.post('/:id/code-submit', InterviewController.submitCode);
router.post('/:id/complete', InterviewController.completeInterview);

export default router;
