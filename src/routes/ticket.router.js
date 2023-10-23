import { Router } from 'express';
import { ticketController, ticketControllerPost,verCarritoController} from '../controllers/ticket.controller.js';
const router = Router();

router.get('/', verCarritoController);
router.get("/:tid", ticketController);
router.post("/",ticketControllerPost);

export default router;