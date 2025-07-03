import bcrypt from 'bcryptjs';
import Admin from '../models/admin.model.js';

  // OBTENER LA INFORMACIÓN DE UN ADMINISTRADOR POR ID
  export const getAdminById = async(req, res) => {
    // OBTENER EL ID DE LA RUTA
    const { id } = req.params;
    try {
      //  VALIDACIÓN QUE EL ID SEA INGRESADO
      if (!id) {
        return res.status(404).json({ message: "El id es obligatorio." })
      }
      // BUSCAMOS EL REGISTRO EN LA BASE DE DATOS
      const admin = await Admin.findByPk(id);
      // MOSTRAR EL RESULTADO
      console.log(admin);
      //  VALIDACIÓN QUE EL ADMINISTRADOR EXISTA
      if(!admin) {
        // MOSTRAMOS RESPUESTA EN CAS DE QUE EL REGISTRO NO SEA ENCONTRADO
        return res.status(500).json({ message: "Administrador No Encontrado."});
      }
      // LANZAMOS LA RESPUESTA CON ESTADO DE 20 EN CASO DE QUE HAYA UN REGISTRO
      return res.status(200).json(admin)
    } catch (error) {
      //  VALIDACIÓN POSIBLES ERRORES
      console.error("Error al mostrar el Administrador", error);
      return res.status(500).json({ message: "Error al mostrar el administrador", error: message.error})
    }
  }
 
  // OBTENER TODOS LOS ADMINISTRADORES REGISTRADOS
  export const getAllAdmin = async(req, res) => {
    try {
      // OBTENEMOS TODOS LOS REGISTROS QUE TENGAS UN ID DE ROL = 1 ("Administrador")
      const admins = await Admin.findAll({ where: {id_rol: 2}});
      //  VALIDACIÓN SI EL ARREGLO ESTA VACIO O SI TIENE REGISTROS
      if(admins.length == 0) {
        return res.status(404).json({ message: "No se encontraron Resultados"})
      }
      // EN CASO DE QUE HAYAN REGISTROS, MOSTRAMOS LOS REGISTROS
      res.json(admins)
    } catch (error) {
      //  VALIDACIÓN POSIBLES ERRORES
      console.error("No se encontraron Resultados.", error.message);
      return res.status(500).json({ message: "No se encontraron Registros."})
    }
  }
  
  // ACTUALIZAR LA INFOMRACIÓN DE UN ADMINISTRADOR
export const updateAdmin = async(req, res) =>{
  // OBTENEMOS EL ID DE LA RUTA
    const id_admin = req.params.id;
    // DESESTRUCTURAMOS EL CUERPO DE LA SOLICITUD A ACTUALIZAR
    const { id, name_admin, email, password } = req.body;

    try {
      //  VALIDACIÓN QUE EL REGISTRO EXISTA EN LA BASE DE DATOA
        const admin = await Admin.findByPk(id_admin);
        if(!admin){
            return res.status(404).json({ message: "Usuario no encontrado."});
        }
        // EN CASO DE QUE HAYA UNA CONTRASEÑA EN LOS DATOS A ACTUALIZAR SE ENCRIPTA NUEVAMENTE
        let hashedPassword;
        if (password) {
          hashedPassword = await bcrypt.hash(password, 10);
        }
        // ACTUALIZAMOS EL OBJETO CON LOS MISMOS NOMBRES
        await admin.update({ 
            id,
            name_admin,
            email, 
            ...(password && { password: hashedPassword })}); // ENCRIPTAMOS LA CONTRASEÑA EN LA ACTUALIZACIÓN

          // MOSTRAMOS LA INFORMACIÓN DEL USUARIO CON DATOS ACTUALIZADOS
        res.json({
            id: admin.id,
            id: admin.id,
            name_admin: admin.name_admin,
            email: admin.email,
        })
        //  VALIDACIÓN POSIBLES ERRORES
    } catch (error) {
        return res.status(500).json({ message: "Error al actualizar el administrador"})
    }
}