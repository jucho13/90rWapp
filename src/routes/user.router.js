import {Router} from 'express';
import { verUsers,sessionManagement,vistaUnicaAdminUsers, deleteTimedOutUsers } from '../controllers/user.controller.js';
import { authAdmin, authUser } from '../../utils.js';
import { deleteUser, updateUser } from '../controllers/user.admin.controller.js';

const router = Router();



router.get('/api/users',authUser, verUsers);
router.delete("/api/users", authUser, deleteTimedOutUsers);
router.get('/api/users/admin',authAdmin, vistaUnicaAdminUsers);
router.put('/api/users/admin',authAdmin, updateUser);
router.delete('/api/users/admin',authAdmin, deleteUser);

export default router;