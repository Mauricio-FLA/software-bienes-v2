import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta absoluta a la carpeta de uploads existente en Backend/uploads
const uploadsDir = path.resolve(__dirname, "../uploads");

// Verificar que la carpeta de uploads exista (no crear una nueva)
if (!fs.existsSync(uploadsDir)) {
  console.error(`La carpeta de uploads no existe en: ${uploadsDir}`);
  throw new Error("Directorio de uploads no encontrado. Asegúrate de crearlo manualmente.");
}

// Configuración del almacenamiento con diskStorage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    // Generar nombre único: timestamp + originalname
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9\.\-_]/g, "_");
    const filename = `${timestamp}-${safeName}`;
    cb(null, filename);
  }
});

// Filtro de archivos: solo imágenes válidas
const fileFilter = (req, file, cb) => {
  const allowedMime = ["image/jpeg", "image/png", "image/gif"];  
  if (allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Solo se permiten imágenes (jpeg, png, gif)"));
  }
};

// Exportar el middleware de multer
const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024// 20MB
  },
  fileFilter
});

export default upload;
