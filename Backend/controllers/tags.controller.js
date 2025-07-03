import Tag from '../models/tag.model.js';

// REGISTRAR PLACAS
export const createTag = async (req, res) => {
    try {
        // DESESTRUCTURAR EL OBJETO
        const { TagType } = req.body;
        // VALIDAR QUE SE ENVIE 
        if(! TagType) {
             return res.status(400).json({ message: "La  Placa es Obligatoria."});
        }
        // ALMACENAR EL REGISTRO 
        const  newTag = new Tag({  TagType });
        // GUARDAR EL REGISTRO EN LA BASE DE DATOS
        await  newTag.save();
        // MENSAJE DE EXITO Y RESPUESTA DEL REGISTRO
        res.status(201).json({ message: "Placa creada exitosamente.", tag:  newTag });
    } catch (error) {
        // VALIDAR POSIBLES ERRORES
        console.error("Error al crear la Placa:", error);
        res.status(500).json({ message: "Error al crear la Placa.", error: error.message });
    }
}
 
// ACTUALIZAR PLACAS
export const updateTag = async (req, res) => {
    // OBTENER EL ID DE LA RUTA
    const tagId = req.params.id;
    // DESESTRUCTURAR EL OBJETO A ACTUALIZAR
    const { TagType } = req.body;
  
    try {
        // VALIDAR QUE EXISTA EL REGISTRO
      const tag = await Tag.findByPk(tagId);
      if (!tag) {
        return res.status(404).json({ message: "Placa No Encontrada." });
      }
  // ACTUALIZAR EL REGISTRO
      await tag.update({ TagType });
      // RESPUESTA DE EXITO JUNTO CON EL DATO ACTUALIZADO
      return res.status(200).json({ id_tag: tag.id_tag, TagType: tag.TagType, message: "Placa Actualizada Exitosamente" });
    } catch (error) {
        // VALIDACIÓN DE POSIBLES ERRORES
      console.error("Error al actualizar la placa", error.message);
      return res.status(500).json({ message: "Error al actualizar la placa", error:   error.message });
    }
  };
  
// FUNCIÓN PARA UNTENER UNA DE LAS PLACAS
export const getTagById = async(req, res) => {
    // OBTENER EL ID DE LA RUTA
    const { id } = req.params;
    try {
        // VALIDAR QUE HAYA UN ID
        if (!id) {
            return res.status(400).json({ message: "El ID es requerido." })
        }
        // BUSCAR EL REGISTRO Y MOSTRARLO
        const tag = await  Tag.findByPk(id);
        console.log(tag);
        // VALIDAR SI EL ARREGLO SE ENCUENTRA VACIO
        if( tag.length == 0) {
            return res.status(400).json({ message: "Placa no encontrada." })
        }
        // MOSTRAR LOS REGISTROS ENCONTRADOS
        res.json(tag)

    } catch (error) {
        // VALIDACIÓN DE POSIBLES ERRORES
        console.error("Error al obtener la placa.", error.message);
        return res.status.json({ message: "Error al obtener la placa"})
        
    }
};

// OBTENER TODOS LOS REGISTROS
export const getAllTag = async(req, res) => {
    try {
        // VALIDAR QUE CONTENGA REGISTROS
        const tag = await Tag.findAll();
        if (tag.length == 0) {
            return res.status(400).json({ message: "No se encontraron registros."})
        }
        // MOSTRAR LOS REGISTROS ENCONTRADOS
        res.json(tag)
    } catch (error) {
        // VALIDAR POSIBLES ERRORES
        console.error("Error al obtener los registros.", error.message);
        return res.status(500).json({ message: "Error al obtener los registros"})
    }
};

export const deleteTag = async(req, res) => {
    const {id} = req.params;
    try {
        // BUSCAR EL REGISTRO A ELIMINAR
        const tag = await Tag.destroy({ where: {id_tag: id}});
        // VALIDAR QUE EXISTA EL REGISTRO
        if(!tag){
            return res.status(404).json({ message: "Placa No Encontrado."})
        }
        // RESPUESTA DE EXITO
        res.json({ message: "Placa eliminada satisfactoriamente."});
    } catch (error) {
        // VALIDACIÓN DE POSIBLES ERRORES
        console.error(("Error al eliminar le registro.", error.message));
        return res.status(500).json({ message: "Error al eliminar el registro."})
    }
}