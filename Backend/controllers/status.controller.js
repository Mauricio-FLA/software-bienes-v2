import Status from "../models/status.model.js";

export const createStatus = async (req, res) => {
    try {
        const { name_status } = req.body;
        if (!name_status) {
            return res.status(404).json({ message: "El nombre del estado es obligatorio."})
        }

        const newStatus = new Status({ name_status});

        await newStatus.save();
        console.log(newStatus)
        return res.status(202).json({ message: "Estado creado exitosamente.", status: newStatus})
    } catch (error) {
        console.error("Error al registrar el estado.", error.message);
        return res.status(500).json({ message: "Error al registrar el estado.", error: error.message})
    }
}

export const updateStatus = async(req, res)  => {
    const  { id }  = req.params;
    const { name_status } = req.body;
    try {
        const status = await Status.findByPk(id);
        if (!status) {
            return res.status(404).json({ message: "Registro no encontrado."})
        }

        await status.update({
            name_status,
        });
        
        console.log(status);
        return res.status(201).json({ message: "Estado actualizado exitosamente."})
    } catch (error) {
        console.error("Error al Actualizar el estado.", error.message);
        return res.status(500).json({ message: "Estado no actualizado.", error: error.message})
    }
}


export const getStatusById = async (req, res) => {
    const { id } = req.params;
    try {
        const status = await Status.findByPk(id);
        if (!status) {
            return res.status(404).json({ message: "Estado no encontrado."})
        }
        return res.status(200).json(status);
    } catch (error) {
        console.error("Error al cargar el estado.", error.message)
        return res.status(500).json({ message: "Error al cargar el estado", error: error.message})
    }
}

export const getAllStatus = async (req, res) => {
    try {
        const status = await Status.findAll();

        if (status.length == 0) {
            return res.status(404).json({message: "No se encontraron registros."})
        }
        res.json(status);
    } catch (error) {
        console.error("Error al cargar los registros", error.message);
        return res.status(500).json({ message: "Error al cargar los registros", error: error.message})
    }
}

export const deleteStatus = async (req, res) => {
    const { id } = req.params;
    try {

        const status = await Status.findOne({ where: {id_status: id}})

        if (!status) {
            return res.status(404). json({ message: "Estafo no encontrado"})
        }

        const nameStatus = status.name_status;

        await Status.destroy({ where: {id_status: id}})

        res.json({ message: `Estado (${nameStatus}) eliminado exitosamene.`})
    } catch (error) {
        console.error (`Error al eliminar el estado (${nameStatus}).`, error.message);
        return res.status({ message: `Error al eliminar el estado (${nameStatus}).`, error: error.message})
    }
}