import Rol from '../models/rol.model.js'

// OBTENER TODOS LOS REGISTROS
export const getAllRol = async(req, res) => {
    try {
        // VALIDAR QUE CONTENGA REGISTROS
        const rol = await Rol.findAll();
        if (rol.length == 0) {
            return res.status(400).json({ message: "No se encontraron registros."})
        }
        // MOSTRAR LOS REGISTROS ENCONTRADOS
        res.json(rol)
    } catch (error) {
        // VALIDAR POSIBLES ERRORES
        console.error("Error al obtener los registros.", error.message);
        return res.status(500).json({ message: "Error al obtener los registros"})
    }
};

export const getRolById = async(req, res) => {
    // OBTENER EL ID DE LA RUTA
    const { id } = req.params;
    try {
        // VALIDAR QUE HAYA UN ID
        if (!id) {
            return res.status(400).json({ message: "El ID es requerido." })
        }
        // BUSCAR EL REGISTRO Y MOSTRARLO
        const rol = await  Rol.findByPk(id);
        console.log(rol);
        // VALIDAR SI EL ARREGLO SE ENCUENTRA VACIO
        if( rol.length == 0) {
            return res.status(400).json({ message: "Rol no encontrada." })
        }
        // MOSTRAR LOS REGISTROS ENCONTRADOS
        res.json(rol)

    } catch (error) {
        // VALIDACIÓN DE POSIBLES ERRORES
        console.error("Error al obtener el Rol.", error.message);
        return res.status.json({ message: "Error al obtener Roles"})
        
    }
};