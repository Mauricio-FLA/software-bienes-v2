import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string({
        required_error: "El email es invalido"
    }),
    password: z.string({
        required_error: "La contraseña es requerida",
    })
})