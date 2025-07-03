import { z } from 'zod';

 // creación del Esquema de Funcionarios
export const positionSchema = z.object({

    // Validación para que los campos no se envien vacíos
    name: z.string({
        required_error: "E email es obligatorio"
    }),
    identificationNumber: z.string({
        required_error: "El número de documento es obligatorio"
    }),
    email: z.string({
        required_error: "El email es obligatorio"
    }),

    password: z.string({
        required_error: "La contraseña es obligatoria."
    }),
});