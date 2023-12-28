import { Router } from 'express';
import { ticketController,verCarritoController} from '../controllers/ticket.controller.js';
const router = Router();

router.get('/', verCarritoController);
router.get("/vistas", ticketController);

export default router;