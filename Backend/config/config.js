// IMPORTAMOS DOTENV PARA EL MANEJO DE VARIABLES DE ENTORNO
import dotenv from 'dotenv';  

// CARGAMOS LAS VARIABLES DEL .ENV
dotenv.config();   

// OBTENEMOS LA LLAVE SECRETA DEL ARCHIVO .ENV
export const TOKEN_SECRET = process.env.TOKEN_SECRET;
// VALIDAMOS QUE TOKEN_SECRET EXISTA
if (!TOKEN_SECRET) {
    throw new Error("TOKEN_SECRET no está definido en el archivo .env");
}