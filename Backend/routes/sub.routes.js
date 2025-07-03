import { Router } from 'express';
import { createSub, getAllSub } from '../controllers/sub.controller.js';

const router = Router();

router.post('/sub', createSub);
router.get('/sub', getAllSub)


export default router;