import { Router } from 'express';
import { createStatus, deleteStatus, getAllStatus, getStatusById, updateStatus } from '../controllers/status.controller.js';


const router = Router();

router.post('/status/new', createStatus);
router.put('/status/:id', updateStatus)
router.get('/status/:id', getStatusById)
router.get('/statusall', getAllStatus);
router.delete('/status/:id', deleteStatus);

export default router;