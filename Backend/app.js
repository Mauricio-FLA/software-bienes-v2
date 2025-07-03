import express from 'express';
import path from "path";
import { fileURLToPath } from "url";
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from "cors";
import session from 'express-session';
import dotenv from 'dotenv';
import  { testConnection } from './config/db.js';
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import chargeRoutes from "./routes/charge.routes.js";
import depenRoutes from "./routes/depen.routes.js";
import posiRoutes from "./routes/position.routes.js";
import itemRoutes from "./routes/item.routes.js";
import tagRoutes from "./routes/tag.routes.js";
import transRoutes from "./routes/transfer.routes.js";
import subRoutes from "./routes/sub.routes.js"
import rolRoutes from './routes/rol.routes.js'
import conRoutes from './routes/contract.routes.js'
import assiRoutes from './routes/Assign.routes.js'
import statusRoutes from './routes/status.routes.js'


dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sirve directamente la carpeta uploads de forma segura
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use(authRoutes);
app.use(adminRoutes);
app.use(chargeRoutes);
app.use(depenRoutes);
app.use(posiRoutes);
app.use(itemRoutes);
app.use(tagRoutes);
app.use(transRoutes);
app.use(subRoutes);
app.use(rolRoutes);
app.use(conRoutes);
app.use(assiRoutes);
app.use(statusRoutes)

app.use(cookieParser());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));



// Función de arranque
async function startServer() {
  try {
    await testConnection();

    const PORT =  3001;
    app.listen(PORT, () => {
      console.log(`Server on Port ${PORT}`);
    });
  } catch (err) {
    console.error('Error arrancando el servidor:', err);
    process.exit(1);
  }
}
startServer();

export default app;