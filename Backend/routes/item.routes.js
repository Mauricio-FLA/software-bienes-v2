import { Router } from "express"
import {  createItem, getAllItem, getItem,  updateItem } from "../controllers/item.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { itemSchema } from "../schemas/item.schema.js";
import upload from "../middlewares/multerConfig.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

// REGISTRAR BIENES  (SE REQUIERE AUTENTICACIÓN)
router.post('/item', upload.single('image'), validateSchema(itemSchema), createItem );    
// ACTUALIZAR BIENES  (SE REQUIERE AUTENTICACIÓN)
router.put('/item/:id', upload.single('newImage'), updateItem);
// OBTENER INFORMACIÓN DE UN BIEN  (SE REQUIERE AUTENTICACIÓN)
router.get('/item/:id', getItem),
// OBTENER LA INFORMACIÓN DE TODOS LOS BIENES (SE REQUIERE AUTENTICACIÓN)
router.get('/items',  getAllItem)

export default router;