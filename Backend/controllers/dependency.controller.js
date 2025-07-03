import Subgerence from '../models/subgerence.model.js'
import Dependency from '../models/dependency.model.js'

export const createDepen = async (req, res) => {
  try {
    const {name_depen, id_sub} = req.body;
    if (!name_depen || !id_sub) {
      return res.status(400).json({ message: "Nombre y Subgerencia son obligatorios."})
    }

    const sungerence = await Subgerence.findByPk(id_sub);
    if (!sungerence) {
      return res.status(404).json({ message: "Subgerencia no encontrada."})
    }

    const newDepen = await Dependency.create({
      name_depen,
      id_sub
    });

    res.status(201).json(newDepen)
  } catch (error) {
    console.error('Error al crear la Dependencia:', error);
    res.status(500).json({ message: 'Error interno.', error: error.message });
  }
}

// OBTENER TODOS LOS REGISTROS
export const getAllDepen = async(req, res) => {
    try {
        // BUSCAR LOS REGISTROS EN LA BASE DE DATOS
      const depen = await Dependency.findAll();
      //  VALIDAMOS QUE EL ARREGLO NO ESTE VACIO
      if(depen.length == 0) {
        return res.status(404).json({ message: "No se encontraron Resultados"})
      }
      // SI HAY REGISTROS, SE MUESTRAN AL USUARIO
      res.json(depen)
    } catch (error) {
        // VALIDACIÓN DE POSIBLES ERRORES
      console.error("No se encontraron Resultados.", error.message);
      return res.status(500).json({ message: "No se encontraron Registros."})
    }
  };