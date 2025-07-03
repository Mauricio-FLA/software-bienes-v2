import {z} from "zod";

export const practiceSchema = z.object({
    name_practice: z.string({
        required_error: "El nombre del aprendiz es requerido"
    }),
    document: z.string({
        required_error: "El documento es requerido"
    }),
    email: z.string({
        required_error: "El email es requerido"
    }),
    password: z.string({
        required_error: "La contraseña es requerida"
    }),
    phone: z.string({
        required_error: "El telefono es requerido"
    }),
    institution: z.string({
        required_error: "La institución es requerida"
    }),
    study: z.string({
        required_error: " la carrera es obligatoria"
    }),
})