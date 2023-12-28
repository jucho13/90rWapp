import Router from 'express';
import { verUsers,sessionManagement } from '../controllers/user.controller.js';

const router = Router();



router.get('/api/users', verUsers);
//Session management:
router.delete("/api/users", sessionManagement);

export default router;