import { Router } from 'express';
import { ticketController,verCarritoController} from '../controllers/ticket.controller.js';
import { authUser } from '../../utils.js';
const router = Router();

router.get('/',authUser, verCarritoController);
router.get("/vistas",authUser, ticketController);

export default router;