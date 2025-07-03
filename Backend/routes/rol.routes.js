import { Router } from "express";
import { getAllRol, getRolById } from "../controllers/rol.controller.js";

const router = Router();

router.get('/rol', getAllRol);
router.get('/rol/:id', getRolById);

export default router