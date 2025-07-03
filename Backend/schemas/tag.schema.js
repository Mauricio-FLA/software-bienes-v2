import { z } from "zod";
export const tagSchema = z.object({
    TagType: z.string({
        required_error: "La Placa es Requerida."
    })
})