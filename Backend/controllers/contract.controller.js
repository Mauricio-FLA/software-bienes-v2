import Contract from '../models/contract.model.js';

// REGISTRAR UN CONTRATO (AJUSTADO PARA VALIDACIÓN DE REPETICIÓN)
export const createContract = async (req, res) => {
  try {
    const { id_contra, price, date_contra, details, provider } = req.body;

    const existingContract = await Contract.findOne({ where: { id_contra: id_contra } });

    if (existingContract) {
      const existingDate = existingContract.date_contra ? new Date(existingContract.date_contra)
      .toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'una fecha desconocida';
      
      return res.status(400).json({
        message: `El contrato con número ${id_contra} ya fue registrado el día ${existingDate}.`
      });
    }

    const newCon = await Contract.create({ id_contra, price, date_contra, details, provider });

    console.log(newCon.toJSON());
    return res.status(201).json({ message: "Registro creado exitosamente", newCon });

  } catch (error) {
    console.error('Error al crear el contrato:', error);
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};

export const updateContract= async (req, res) => {
    // OBTENER EL ID DE LA RUTA
    const contractId = req.params.id;
     // DESESTRUCTURACIÓN DEL CUERPO DE LA SOLICITUD A ACTUALIZAR
    const {  id_contra, price, date_contra, details, provider } = req.body;
    try {
        // VALIDACIÓN QUE EL CARGO EXISTA EN LA BASE DE DATOA
        const contract = await Contract.findByPk(contractId);
        if (!contract) {
            return res.status(404).json({ message: "Cargo no encontrado."});
        }
        // ACTUALIZAR EL CARGO
        await contract.update({id_contra, price, date_contra, details, provider });
        // MENSAJE DE EXITO JUNTO CON EL CARGO ACTUALIZADO
        return res.status(201).json({ message: "Contrato Actualizado Exitosamente", contracto: contract});
        
    } catch (error) {
        // VALIDACIÓN DE POSIBLES ERRORES
        return res.status(500).json({ message: "Error al actualizar el Contrato"});
    }
}

export const getAllCon = async(req, res) => {
    try {
        // VALIDAR QUE CONTENGA REGISTROS
        const contrac = await Contract.findAll();
        if (contrac.length == 0) {
            return res.status(400).json({ message: "No se encontraron registros."})
        }
        // MOSTRAR LOS REGISTROS ENCONTRADOS
        res.json(contrac)
    } catch (error) {
        // VALIDAR POSIBLES ERRORES
        console.error("Error al obtener los registros.", error.message);
        return res.status(500).json({ message: "Error al obtener los registros"})
    }
};

export const getContractById = async(req, res) => {
    // OBTENEMOS EL ID DE LA RUTA
    const { id } = req.params;
    try {
        // VALIDACIÓN QUE SE INGRESE UN ID
        if(!id) {
            return res.status(404).json({ message: "El Id es Requerido." });
        }
        // BUSCAR EL REGISTRO EN LA BASE DE DATOS
        const contract = await Contract.findByPk(id);
        console.log(contract);
        // VALIDACIÓN SI NO HAY UN REGISTRO
        if(!contract) {
            return res.status(500).json({ message: "Cargo No encontrado." })
        }
        // EN CASO DE EXITO SE IMPRIME LA RESPUESTA JUNTO CON EL REGISTRO BUSCADO
        return res.status(200).json(contract)
    } catch (error) {
        // VALIDACIÓN DE POSIBLES ERRORES
        console.error("Error al obtener la información.", error.message);
        return res.status(500).json({ message: "Error al mostrar el Cargo", error: message.error})
    }
}

