import Subgerence from "../models/subgerence.model.js";

export const createSub = async (req, res) => {
    try {
        //  VALIDACIÓN QUE LA SOLICITUD NO ESTE VACIA
        const { name_sub } = req.body;
        if(!name_sub) {
             return res.status(400).json({ message: "El Cargo es obligatorio."});
        }
        // DEFINIMOS LA CONSTANTE PARA ALMACENAR EL CARGO ENVIADO
        const newSub = new Subgerence({ name_sub });
        // GUARDAMOS EL CARGO EN LA BASE DE DATOS
        await newSub.save();
        // MOSTRAMOS LA RESPUESTA DE EXITO CON EL REGISTRO GUARDADO
        res.status(201).json({ message: "Subgerencia creada exitosamente.", subgerencia: newSub });
    } catch (error) {
        //  VALIDACIÓN POSIBLES ERRORES
        console.error("Error al crear Subgerencia:", error.message);
        res.status(500).json({ message: "Error al crear Subgerencia.", error: error.message });
    }
}

// OBTENER TODOS LOS REGISTROS
export const getAllSub = async(req, res) => {
    try {
        // BUSCAR LOS REGISTROS EN LA BASE DE DATOS
      const sub = await Subgerence.findAll();
      //  VALIDAMOS QUE EL ARREGLO NO ESTE VACIO
      if(sub.length == 0) {
        return res.status(404).json({ message: "No se encontraron Resultados"})
      }
      // SI HAY REGISTROS, SE MUESTRAN AL USUARIO
      res.json(sub)
    } catch (error) {
        // VALIDACIÓN DE POSIBLES ERRORES
      console.error("No se encontraron Resultados.", error.message);
      return res.status(500).json({ message: "No se encontraron Registros."})
    }
  };