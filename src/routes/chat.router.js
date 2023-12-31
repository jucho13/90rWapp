import { Router } from 'express';

import { getRenderChatController, postNewChatController } from '../controllers/chat.controller.js';
import { authUser } from '../../utils.js';


const router = Router();

//GET
router.get('/',authUser, getRenderChatController);

//POST
router.post('/newChat', postNewChatController);

export default router