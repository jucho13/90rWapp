import { Router } from "express";
import { sendEmail } from "../controllers/mail.controller.js";

const router = Router();


router.post("/", sendEmail);

export default router;