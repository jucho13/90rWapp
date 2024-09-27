import {Router} from 'express';

import { authAdmin,authUser } from '../../utils.js';
const router = Router();



router.get('/',authUser, vistaNormal);
router.get("/session", sessionManagement);
router.get('/login', login);
router.post("/register", registerPost);
router.post("/login", loginPost);
router.get("/fail-register",failRegister);
router.get("/fail-login",failLogin );
router.get('/register', register);
router.get('/profile',authUser, profile);
router.get('/private', authAdmin, privateMood);
router.get("/logout", logOut);

export default router;