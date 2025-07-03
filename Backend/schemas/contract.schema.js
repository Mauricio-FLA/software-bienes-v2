import { z } from 'zod';

export const contractSchema = z.object({

  id_contra: z.string({ 
    required_error: "El número del contrato es requerido." 
    }).min(1, "El número del contrato no puede estar vacío."),

price: z.number({ 
    required_error: "El valor es requerido." 
    }).min(1, "El vaalor pagado no puede estar vacío."),

date_contract: z.date({ required_error: "La fecha es requerida." 
  }).min(1, "La fecha no puede estar vacía."),

details: z.string({ 
    required_error: "Los detalles del contrato son requeridos." 
    }).min(1, "Los detalles del contrato no pueden estar vacíos."),

provider: z.string({ 
    required_error: "El proveedor es requerido." 
    }).min(1, "El nombre del proveedor no puede estar vacío"),

});