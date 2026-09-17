import { Router } from 'express';
import authRoutes from './authRoutes.js';
import interviewRoutes from './interviewRoutes.js';
import aiRoutes from './aiRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Antiview API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/interviews', interviewRoutes);
router.use('/ai', aiRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
