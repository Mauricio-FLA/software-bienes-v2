import { z } from 'zod';

export const registerSchema = z.object({
    id: z.number({
        required_error: "El documento es requerido"
    }),
    name_admin: z.string({
        required_error: "El nombre es requerido"
    }),
    email: z.string({
        required_error: "El  email es requerido"
    }),
    password: z.string({
        required_error: "La contraseña es requerida"
    }),
})