import { Router } from 'express';
import { User} from '../models/user.model.js';
import { auth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
});

export default router;
