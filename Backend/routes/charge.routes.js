import { Router } from "express";
import { CreateCharge, deleteCharge, getAllCharge, getChargeById, updateCharge } from "../controllers/charge.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
const router = Router();

// CHARGE ROUTES

// REGISTRAR UN CARGO (SE REQUIERE AUTENTICACIÓN)
router.post('/charge', authRequired, CreateCharge);
// ACTUALIZAR UN CARGO (SE REQUIERE AUTENTICACIÓN)
router.put('/charge/:id', authRequired, updateCharge);
// OBTENER UN CARGO POR ID (SE REQUIERE AUTENTICACIÓN)
router.get('/charge/:id', authRequired, getChargeById);
// OBTENER TODOS LOS CARGOS (SE REQUIERE AUTENTICACIÓN)
router.get('/charge', authRequired, getAllCharge)
// ELIMINAR CARGOS (SE REQUIERE AUTENTICACIÓN)
router.delete('/charge/:id', authRequired, deleteCharge)

// EXPORTAR RUTAS
export default router;