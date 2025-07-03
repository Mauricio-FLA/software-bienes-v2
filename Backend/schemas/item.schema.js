import { z } from 'zod';

export const itemSchema = z.object({

  tag: z.string({ 
    required_error: "La placa es requerida." 
    }).min(1, "La placa no puede estar vacía."),

name_item: z.string({ 
    required_error: "El nombre es requerido." 
    }).min(1, "El nombre no puede estar vacío."),

brand: z.string({ required_error: "La marca es requerida." 
  }).min(1, "La marca no puede estar vacía."),

serialNumber: z.string({ 
    required_error: "El número serial es requerido." 
    }).min(1, "El número serial no puede estar vacío."),

    img: z.string().url("La URL de la imagen no es válida.").optional(),

id_tag: z.string({ 
    required_error: "El tipo de placa serial es requerido." 
    }).min(1, "El tipo de placa no puede estar vacío."),

});