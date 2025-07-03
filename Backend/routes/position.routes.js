import multer from 'multer';
const upload = multer();
import { Router } from "express";
import { createPosition,  getAllPositions,   getPositionById,   updatePosition } from "../controllers/position.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();
// POSITION ROUTES

// REGISTRAR FUNCIONARIO (SE REQUIERE AUTENTICACIÓN)
router.post('/posi', upload.none(), createPosition);
// ACTUALIZAR FUNCIONARIO (SE REQUIERE AUTENTICACIÓN)
router.put('/posi/:id', upload.none(), updatePosition);
// OBTENER UN FUNCIONARIO POR ID (SE REQUIERE AUTENTICACIÓN)
router.get('/posi/:id',  getPositionById);
// OBTENER TODOS LOS FUNCIONARIOS (SE REQUIERE AUTENTICACIÓN)
router.get('/posi',  getAllPositions)

// EXPORTAR RUTAS
export default router;