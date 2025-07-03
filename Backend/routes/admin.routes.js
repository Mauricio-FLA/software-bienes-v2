import { Router } from "express";
import {  getAdminById, getAllAdmin, updateAdmin } from "../controllers/admin.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

//ADMIN ROUTES
// ACTUALIZAR ADMINISTRADOR (SE REQUIERE AUTENTICACIÓN)
router.put('/admin/:id', authRequired, updateAdmin);
// OBTENER ADMINISTRADOR POR ID (SE REQUIERE AUTENTICACIÓN)
router.get('/admin/:id', authRequired, getAdminById);
// OBTENER TODOS LOS ADMINISTRADORES REGISTRADOS (SE REQUIERE AUTENTICACIÓN)
 router.get('/admin',  getAllAdmin);
// ELIMINAR ADMINISTRADOR (SE REQUIERE AUTENTICACIÓN)

// EXPORTAR RUTAS
export default router;