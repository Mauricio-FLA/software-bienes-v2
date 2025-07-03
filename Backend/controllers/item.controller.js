import fs from 'fs';
import path from 'path';
import Item from "../models/item.model.js";
import Tag from "../models/tag.model.js"
import sharp from 'sharp';
import Status from '../models/status.model.js';

export const createItem = async (req, res) => {
  try {
    const { tag, name_item, brand, serialNumber, id_contra, id_tag } = req.body;

    const idtag = await Tag.findByPk(id_tag);
    if (!idtag) {
      return res.status(404).json({ message: `Tipo de placa con id_tag=${id_tag} no encontrado.` });
    }

    let imgPath = null;
    if (req.file) {
      const originalPath   = req.file.path;
      const dirname        = path.dirname(originalPath);
      const compressedName = 'compressed-' + req.file.filename;
      const compressedPath = path.join(dirname, compressedName);

      await sharp(originalPath)
        .resize({ width: 800, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(compressedPath);

      fs.unlinkSync(originalPath);

      imgPath = path.relative(path.resolve('uploads'), compressedPath).replace(/\\/g, '/');
    }

    const newItem = await Item.create({ tag, name_item, brand, serialNumber, id_contra, id_tag, img: imgPath, fecha_registro: new Date() });

    console.log(newItem.toJSON());
    
    return res.status(201).json({ message: 'Item registrado exitosamente', item: newItem});

  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error al registrar el item:', error);
    return res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

export const updateItem = async (req, res) => {
  // Asumo que el parámetro de ruta es el 'tag' del ítem que quieres actualizar
  // Si tu ruta es /items/:tag, entonces req.params.tag contendrá el valor
  const { id } = req.params; // Usamos un nombre diferente para evitar conflicto con req.body.tag
  const { tag, name_item, brand, serialNumber, id_tag, id_contra } = req.body;

  try {
    // Buscar el ítem usando la columna 'tag' como clave primaria
    const item = await Item.findByPk(id); // O Item.findOne({ where: { tag: itemTagToUpdate } });

    if (!item) {
      return res.status(404).json({ message: "Activo no encontrado." });
    }

    // --- Validación de id_tag (similar a createItem) ---
    if (id_tag) {
      const idtag = await Tag.findByPk(id_tag);
      if (!idtag) {
        return res.status(404).json({ message: `Tipo de placa con id_tag=${id_tag} no encontrado.` });
      }
    }

    let imgPath = item.img;

    // --- Lógica para la imagen (sin cambios aquí) ---
    if (req.file) {
      const originalPath = req.file.path;
      const dirname = path.dirname(originalPath);
      const compressedName = 'compressed-' + req.file.filename;
      const compressedPath = path.join(dirname, compressedName);

      try {
        await sharp(originalPath)
          .resize({ width: 800, withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toFile(compressedPath);

        fs.unlinkSync(originalPath);

        if (item.img) {
          const oldImgFullPath = path.join(path.resolve('uploads'), item.img);
          if (fs.existsSync(oldImgFullPath)) {
            fs.unlinkSync(oldImgFullPath);
          }
        }

        imgPath = path.relative(path.resolve('uploads'), compressedPath).replace(/\\/g, '/');
      } catch (sharpError) {
        if (fs.existsSync(originalPath)) {
          fs.unlinkSync(originalPath);
        }
        console.error("Error al procesar la imagen:", sharpError);
        return res.status(500).json({ message: "Error al procesar la imagen.", error: sharpError.message });
      }

    } else if (req.body.img === '') {
      if (item.img) {
        const oldImgFullPath = path.join(path.resolve('uploads'), item.img);
        if (fs.existsSync(oldImgFullPath)) {
          fs.unlinkSync(oldImgFullPath);
        }
      }
      imgPath = null;
    }

    // --- Preparar datos para la actualización ---
    const updateData = {
      tag: tag !== undefined ? tag : item.tag,
      name_item: name_item !== undefined ? name_item : item.name_item,
      brand: brand !== undefined ? brand : item.brand,
      serialNumber: serialNumber !== undefined ? serialNumber : item.serialNumber,
      id_tag: id_tag !== undefined ? id_tag : item.id_tag,
      id_contra: id_contra !== undefined ? id_contra : item.id_contra,
      img: imgPath,
    };

    // --- Realizar la actualización en la base de datos ---
    // ¡AQUÍ ESTÁ EL CAMBIO CRÍTICO! Usa 'tag' en el WHERE si 'tag' es tu clave primaria
    const [updatedRows] = await Item.update(updateData, { where: { tag: id } });

    if (updatedRows > 0) {
      // Si el tag también fue actualizado, necesitamos buscar por el NUEVO tag
      const finalItemIdentifier = (tag !== undefined && tag !== item.tag) ? tag : id;
      const updatedItem = await Item.findByPk(finalItemIdentifier);
      return res.status(200).json({ message: "Activo actualizado correctamente.", item: updatedItem });
    } else {
      return res.status(200).json({ message: "No se realizaron cambios en el activo.", item: item });
    }

  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error al actualizar el Activo:", error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: "Alguno de los valores únicos (ej. tag) ya existe.", errors: error.errors });
    }
    return res.status(500).json({ message: "Error interno del servidor al actualizar el activo.", error: error.message });
  }
};

// Las funciones getItem y getAllItem no necesitan cambios directos para la img
// ya que simplemente recuperan la información del item, incluyendo la URL.

// Función para eliminar un item (la eliminación no se relaciona directamente con la URL de la img en este modelo)
export const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: "El tag es requerido." });
    }

    const deletedRows = await Item.destroy({
      where: { tag: id }
    });

    if (deletedRows > 0) {
      return res.status(200).json({ message: "Activo eliminado correctamente." });
    } else {
      return res.status(404).json({ message: "Activo no encontrado." });
    }

  } catch (error) {
    console.error("Error al eliminar el Activo", error.message);
    return res.status(500).json({ message: "Error al eliminar el Activo." });
  }
};

export const getItem = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: "El tag es requerido." });
    }

    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: "Activo no encontrado." });
    }

    return res.status(200).json(item);

  } catch (error) {
    console.error("Error al obtener el registro", error.message);
    return res.status(500).json({ message: "Error al obtener el registro." });
  }
};

export const getAllItem = async (req, res) => {
 try {
  const items = await Item.findAll({
    include: [
      {model: Tag, attributes: ['TagType'], as: 'tags'},
      {model: Status, attributes: ['name_status'], as: 'status'}
    ],
    attributes: { exclude: ['id_tag', 'id_status']}
  });
  res.status(200).json(items);
 } catch (error) {
  console.error("Error al obtener los registros", error.message);
  return res.status(500).json({ message: "Error al optener los activos.", error: error.message});
 }
};