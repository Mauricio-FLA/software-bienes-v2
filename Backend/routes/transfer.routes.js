
import { Router } from "express";
import { deleteTransfer,    getAllTransfers, getsTransfers, getTransferById, getTransferByIdByImg, getTransfersByPosition } from "../controllers/transfer.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import upload from "../middlewares/multerConfig.js";
import { createTransfer, updateTransfer } from "../controllers/AuthTransfer.controller.js";

const router =Router();

// ASIGNAR UN BIEN  (SE REQUIERE AUTENTICACIÓN)
router.post('/transfer', authRequired, upload.single('image'), createTransfer);
router.put('/transfer/:id', authRequired, updateTransfer)
router.get('/positions/:id_posi/transfers', getTransfersByPosition);
// OBTENER TODAS LAS ASIGNACIONES (SE REQUIERE AUTENTICACIÓN)
router.get('/transfers', authRequired, getsTransfers)
router.get('/transfer', authRequired, getAllTransfers);
// OBTENER LA INFORMACIÓN DE UNA ASIGNACIÓN  (SE REQUIERE AUTENTICACIÓN)
router.get('/transfers/:id', authRequired, getTransferById);
router.get('/transfers/:id/info',  getTransferByIdByImg);
router.delete('/transfer/:id', authRequired, deleteTransfer)

export default router;


