import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config/config.js";
import Admin from "../models/admin.model.js";

export const verifyToken = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Autorización denegada: no se proporcionó token" });
    }
    
    if (process.env.NODE_ENV !== "production") {
      console.log("Token recibido:", token);
    }
    
    const decoded = jwt.verify(token, TOKEN_SECRET);
    
    if (process.env.NODE_ENV !== "production") {
      console.log("Información decodificada:", decoded);
    }

    userFound = await Admin.findById(decoded.id);
    if (userFound) {
      return res.json({
        type: "admin",
        id: userFound.id,
        name_admin: userFound.name_admin,
        email: userFound.email,
      });
    }

    return res.status(401).json({ message: "Autorización denegada: usuario no encontrado" });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Autorización denegada: token inválido" });
  }
};