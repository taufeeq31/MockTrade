import { Router } from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { buyStock } from '../controllers/trade.controller.js';

const router = Router();

// POST /api/trade/buy
router.post('/buy', auth, buyStock);

export default router;
