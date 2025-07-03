import Charge from '../models/charge.model.js';

// REGISTRAR UN CARGO
export const CreateCharge = async (req, res) => {
    try {
        //  VALIDACIÓN QUE LA SOLICITUD NO ESTE VACIA
        const { name_charge } = req.body;
        if(!name_charge) {
             return res.status(400).json({ message: "El Cargo es obligatorio."});
        }
        // DEFINIMOS LA CONSTANTE PARA ALMACENAR EL CARGO ENVIADO
        const newCharge = new Charge({ name_charge });
        // GUARDAMOS EL CARGO EN LA BASE DE DATOS
        await newCharge.save();
        // MOSTRAMOS LA RESPUESTA DE EXITO CON EL REGISTRO GUARDADO
        res.status(201).json({ message: "Cargo creado exitosamente.", charge: newCharge });
    } catch (error) {
        //  VALIDACIÓN POSIBLES ERRORES
        console.error("Error al crear Cargo:", error);
        res.status(500).json({ message: "Error al crear el Cargo.", error: error.message });
    }
}

// ACTUALIZAR UN CARGO
export const updateCharge = async (req, res) => {
    // OBTENER EL ID DE LA RUTA
    const chargeId = req.params.id;
     // DESESTRUCTURACIÓN DEL CUERPO DE LA SOLICITUD A ACTUALIZAR
    const { name_charge } = req.body;
    try {
        // VALIDACIÓN QUE EL CARGO EXISTA EN LA BASE DE DATOA
        const charge = await Charge.findByPk(chargeId);
        if (!charge) {
            return res.status(404).json({ message: "Cargo no encontrado."});
        }
        // ACTUALIZAR EL CARGO
        await charge.update({
            name_charge
        });
        // MENSAJE DE EXITO JUNTO CON EL CARGO ACTUALIZADO
        return res.status(201).json({ message: "Cargo Actualizado Exitosamente", charge: charge});
        
    } catch (error) {
        // VALIDACIÓN DE POSIBLES ERRORES
        return res.status(500).json({ message: "Error al actualizar el Cargo"});
    }
}

// OBTENER UN CARGO
export const getChargeById = async(req, res) => {
    // OBTENEMOS EL ID DE LA RUTA
    const { id } = req.params;
    try {
        // VALIDACIÓN QUE SE INGRESE UN ID
        if(!id) {
            return res.status(404).json({ message: "El Id es Requerido." });
        }
        // BUSCAR EL REGISTRO EN LA BASE DE DATOS
        const charge = await Charge.findByPk(id);
        console.log(charge);
        // VALIDACIÓN SI NO HAY UN REGISTRO
        if(!charge) {
            return res.status(500).json({ message: "Cargo No encontrado." })
        }
        // EN CASO DE EXITO SE IMPRIME LA RESPUESTA JUNTO CON EL REGISTRO BUSCADO
        return res.status(200).json(charge)
    } catch (error) {
        // VALIDACIÓN DE POSIBLES ERRORES
        console.error("Error al obtener la información.", error.message);
        return res.status(500).json({ message: "Error al mostrar el Cargo", error: message.error})
    }
}

// OBTENER TODOS LOS CARGOS
export const getAllCharge = async(req, res) => {
    try {
        // BUSCAR LOS REGISTROS EN LA BASE DE DATOS
      const charge = await Charge.findAll();
      //  VALIDAMOS QUE EL ARREGLO NO ESTE VACIO
      if(charge.length == 0) {
        return res.status(404).json({ message: "No se encontraron Resultados"})
      }
      // SI HAY REGISTROS, SE MUESTRAN AL USUARIO
      res.json(charge)
    } catch (error) {
        // VALIDACIÓN DE POSIBLES ERRORES
      console.error("No se encontraron Resultados.", error.message);
      return res.status(500).json({ message: "No se encontraron Registros."})
    }
  };

  // ELIMINAR UN CARGO
  export const deleteCharge = async(req, res) => {
    // OBTENER EL ID DE LA RUTA
    const { id } = req.params;
    try {
        // VALIDAR QUE EL REGISTRO SE ENCUENTE EN LA BASE DE DATOS PARA ELIMINAR
        const charge = await Charge.destroy({ where: { id_charge: id}});
        // VALIDAR SI EL ARREGLO ESTÁ VACIO O CONTIENE UN REGISTRO
        if (charge.length == 0) {
            return res.status(404).json({ message: "Cargo No Encontrado" })
        }
        // MOSTRAR MENSAJE EN CASO DE ACCIÓN EXITOSA
        res.json({ message: "Cargo Eliminado Satisfactoriamente."})
    } catch (error) {
        // VALIDACIÓN DE POSIBLES ERRORES
        console.error("Error al Eliminar El Registro.", error.message);
        res.status(500).json({ message: error.message})
    }
  }