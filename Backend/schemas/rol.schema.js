import { z } from "zod";

export const rolSchema = z.object({
    name_rol: z.string({
        required_error: "El rol es requerido."
    })
})