import { Router } from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { buyStock, sellStock } from '../controllers/trade.controller.js';

const router = Router();

// POST /api/trade/buy
router.post('/buy', auth, buyStock);
// POST /api/trade/sell
router.post('/sell', auth, sellStock);

export default router;
