import { Router } from "express";
import { login, logout, RegisterAdmin } from "../controllers/auth.controller.js";
import { verifyToken } from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema } from "../schemas/register.schema.js";
import { loginSchema } from "../schemas/login.schema.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

// AUTH ROUTES
// VERIFICACIÓN DE LA EXISTENCIA DEL TOKEN
router.get("/verify", verifyToken, (req, res) => { res.status(200).json({ admin: req.admin }); });
// RUTA REGISTER
router.post('/register', validateSchema(registerSchema), RegisterAdmin)
// RUTA LOGIN
router.post('/login',  validateSchema(loginSchema), login);
// RUTA LOGOUT (SE REQUIERE AUTENTICACIÓN)
router.post('/logout', authRequired, logout);

// EXPORTAR RUTAS
export default router;