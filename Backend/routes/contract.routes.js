import {Router} from 'express';
import { createContract, getAllCon, getContractById, updateContract } from '../controllers/contract.controller.js';

const router = Router();

router.post('/contract', createContract)
router.get('/contract', getAllCon);
router.get('/contract/:id', getContractById);
router.put('/contract/:id', updateContract);

export default router;