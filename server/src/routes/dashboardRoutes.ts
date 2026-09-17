import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/stats', DashboardController.getStats);
router.get('/performance', DashboardController.getPerformance);
router.get('/recommendations', DashboardController.getRecommendations);

export default router;
