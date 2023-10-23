import { Router } from 'express';
import { ticketController,verCarritoController,ticketControllerPost} from '../controllers/ticket.controller.js';
const router = Router();

router.get('/', verCarritoController);
router.get("/vistas", ticketController);
router.post("/vista",ticketControllerPost);

export default router;