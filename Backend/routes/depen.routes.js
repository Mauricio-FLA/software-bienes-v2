import { Router } from "express";
import { createDepen, getAllDepen } from "../controllers/dependency.controller.js";
// import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

// DEPENDENCY ROUTES

// CREAR DEPENDENCIA (SE REQUIERE AUTENTICACIÓN)
router.post('/depen',  createDepen);
router.get('/depen', getAllDepen)

// EXPORTAR RUTAS
export default router;