import {Router} from 'express';
import { createAssign, DevoAssign, getAllAssign, getAssignById, getAssignsByPosition } from '../controllers/Assign.controller.js';
import upload from '../middlewares/multerConfig.js';

const router = Router();

router.post('/assign', upload.array('files'), createAssign);
router.get('/assign', getAllAssign);
router.get('/assign/:id', getAssignById);
router.get('/assign/position/:id_pos', getAssignsByPosition);
router.delete('/assign/devolution/:id', DevoAssign)


export default router;