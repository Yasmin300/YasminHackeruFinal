import { Router } from 'express';

import job from './job.js';
import app from './applications.js';
const router = Router();

router.use('/', job);
router.use('/application', app);
export default router;
