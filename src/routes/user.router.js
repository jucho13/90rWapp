import {Router} from 'express';
import { verUsers,sessionManagement,vistaUnicaAdminUsers, deleteTimedOutUsers } from '../controllers/user.controller.js';
import { authAdmin } from '../../utils.js';

const router = Router();



router.get('/api/users', verUsers);
router.delete("/api/users", deleteTimedOutUsers);
router.get('/api/users/admin',authAdmin, vistaUnicaAdminUsers);
router.put('/api/users/admin',authAdmin, vistaUnicaAdminUsers);
router.delete('/api/users/admin',authAdmin, vistaUnicaAdminUsers);

export default router;