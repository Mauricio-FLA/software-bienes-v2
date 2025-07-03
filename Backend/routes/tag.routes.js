import { Router } from "express";
import { createTag, deleteTag, getAllTag, getTagById, updateTag } from "../controllers/tags.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { tagSchema } from "../schemas/tag.schema.js";
import { authRequired } from "../middlewares/validateToken.js";

// TAG ROUTES
const router = Router();

// REGISTRAR UNA PLACA (SE REQUIERE AUTENTICACIÓN)
router.post('/tag', validateSchema(tagSchema), createTag);
// ACTUALIZAR UNA PLACA REGISTRADA (SE REQUIERE AUTENTICACIÓN)
router.put('/tag/:id', authRequired, updateTag);
// OBTENER UNA PLACA ESPECIFICA (SE REQUIERE AUTENTICACIÓN)
router.get('/tag/:id', authRequired, getTagById);
// OBTENER TODAS LAS PLACAS (SE REQUIERE AUTENTICACIÓN)
router.get('/tag', getAllTag);
// ELIMINAR UN REGISTRO (SE REQUIERE AUTENTICACIÓN)
router.delete('/tag/:id', authRequired, deleteTag)

export default router;