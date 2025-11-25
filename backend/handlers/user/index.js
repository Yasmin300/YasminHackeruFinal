import { Router } from 'express';
import authentication from './auth.js';
import admin from './admin_user.js';
import registeruser from './user.js';
const router = Router();

router.use('/', authentication);
router.use('/', admin);
router.use('/', registeruser);
export default router;
