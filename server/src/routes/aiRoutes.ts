import { Router } from 'express';
import { AIController } from '../controllers/aiController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.post('/generate-question', AIController.generateQuestion);
router.post('/evaluate-answer', AIController.evaluateAnswer);
router.post('/evaluate-code', AIController.evaluateCode);
router.post('/generate-feedback', AIController.generateFeedback);

export default router;
