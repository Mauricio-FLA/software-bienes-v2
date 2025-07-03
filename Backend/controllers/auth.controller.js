import Admin from '../models/admin.model.js';
import { createAccessToken } from '../libs/jwt.js';
import bcrypt from 'bcryptjs';
 import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config/config.js';

// REGISTRO DEL ADMINISTRADOR (SE DEBE DESHABILITAR DESPUES DEL REGISTRO)
export const RegisterAdmin = async (req, res) => {
  // DESESTRUCTURACIÓN DEL OBJETO
    const { id, name_admin, email, password, id_rol } = req.body;

      // VALIDAR QE EL CORREO SE VALIDO
  const validateEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!validateEmail.test(email)) {
    return res.status(400).json({ message: "El formato del correo electrónico no es válido." });
  }

    // VALIDACIÓN DE LA CONTRASEÑA 
  if (password.length < 6) {
    return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres." });
  }

  const validatePassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|:;"'<>,.?/~`]).{6,}$/;
  
  if (!validatePassword.test(password)) {
    return res.status(400).json({
      message: "La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial (ej. !@#$%)."
    });
  }
    // VALIDACIÓN DE ERRORES
    try {
      // VERIFICAR QUE EL EMAIL NO ESTE EN USO ANTES DE CREAR EL REGISTRO
        const userFound = await Admin.findOne({ where: { email } });
        if (userFound) {
          return res.status(400).json(['El correo ya está en uso']);
        }
      // ENCRIPTACIÓN DE CONTRASEÑA CON BCRYPTJS
      const passwordHash = await bcrypt.hash(password, 10);
      // CREACIÓN DEL ADMINISTRADOR
      const newAdmin = await Admin.create({
        id,
        name_admin,
        email,
        password: passwordHash,
        id_rol
      });
      // GENERACIÓN DEL TOKEN DE AUTENTICACIÓN PARA EL ADMIN REGISTRADO
      const token = await createAccessToken({ id: newAdmin.id }); 
      // ENVÍA LA COOKIE DE AUTENTICACIÓN Y RESPONDE CON LOS DATOS DEL NUEVO ADMIN
        res
          .cookie("token", token, { httpOnly: true, secure: true })
          .status(201)
          .json({
            id: newAdmin.id,   // ID AUTO-GENERADO
            name_admin: newAdmin.name_admin, // NOMBRE COMPLETO
            email: newAdmin.email,       // CORREO ELECTRONICO
            id_rol: newAdmin.id_rol
          });

    } catch (error) {
      // VALIDACIÓN DE ERRORES
      console.error("Error al crear el admin:", error.message);
      res.status(500).json({ message: "Error al crear el admin" });
    }
  };

export const login = async(req, res) => {
  const { email, password } = req.body;

    // --- Validación del formato del email ---
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "El formato del correo electrónico no es válido." });
  }



  try {
    const userFound = await Admin.findOne({ where: { email } });
    if (!userFound) {
      return res.status(400).json({ message: "El usuario no existe"})
    }

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales incorrectas." })
    }

          // VALIDACIÓN DE LA CONTRASEÑA 
  if (password.length < 6) {
    return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres." });
  }

  const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|:;"'<>,.?/~`]).{6,}$/;
  
  if (!passwordComplexityRegex.test(password)) {
    return res.status(400).json({
      message: "La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial (ej. !@#$%)."
    });
  }

    const token = await createAccessToken({ id: userFound.id });
    res.cookie("token", token)
      res.json({
        id: userFound.id,   // DOCUMENTO DE IDENTIDAD
        name_admin: userFound.name_admin, // NOMBRE COMPLETO
        email: userFound.email 
    });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const verifyToken = async (req, res ) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "Unauthorization"});
  
  jwt.verify(token, TOKEN_SECRET, async (err, admin) => {
    if(err) return res.status(401).json({ message: "Unauthorization"});

    const userFound = await Admin.findByPk(admin.id)
    if(!userFound) return res.status(401).json({ message: "Unauthorizate"});
    return res.json({
      id: userFound.id,
      name_admin: userFound.name_admin,
      email:userFound.email,
      password:userFound.password
    });
  });
};

// LOGOUT
  export const logout = (req, res) => {
    // ELIMINAMOS EL TOKEN DE AUTENTICAICÓN
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.status(200).json({ message: "Sesión cerrada exitosamente" });
  };