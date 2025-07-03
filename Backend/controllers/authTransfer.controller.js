import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import Assign from '../models/transfer.model.js';
import Position from '../models/position.model.js';
import Item from '../models/item.model.js';
import sequelize from '../config/db.js'; 

export const createTransfer = async (req, res, next) => {

  let activosRaw = req.body.activos;
  let activosArray = [];

  if (Array.isArray(activosRaw)) {
    activosArray = activosRaw;
  } else if (activosRaw && typeof activosRaw === 'object') {
    activosArray = [activosRaw];
  }
  const activos = activosArray;

  const { id_posi, fecha_traslado, funcionario, details, location } = req.body;
  const errors = [];

  if (!id_posi)             errors.push('Documento de posición (id_posi)');
  if (!fecha_traslado)      errors.push('Fecha de traslado (fecha_traslado)');
  if (!location || location.trim() === '') errors.push('Ubicación del funcionario (location)');
  if (!funcionario?.name)   errors.push('Nombre del funcionario (funcionario.name)');
  if (!funcionario?.email)  errors.push('Email del funcionario (funcionario.email)');
  if (!funcionario?.depen)  errors.push('Dependencia del funcionario (funcionario.depen)');
  if (!Array.isArray(activos) || activos.length === 0) {
    errors.push('Al menos un activo en el campo "activos"');
  }

  if (errors.length) {
    // Eliminar archivo subido si hubo validación fallida
    if (req.file?.path) fs.unlinkSync(req.file.path);
    return res.status(400).json({
      message: 'Faltan campos obligatorios',
      fields: errors
    });
  }

  let filename = null;

  try {
    if (req.file) {
      // 2. Comprimir la imagen con Sharp (calidad 80%, ancho máximo 1024px)
      const originalPath   = req.file.path;
      const compressedName = 'compressed-' + req.file.filename;
      const compressedPath = path.join(path.dirname(originalPath), compressedName);

      await sharp(originalPath)
        .resize({ width: 1024, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(compressedPath);

      // Eliminar el archivo original y quedarnos solo con el comprimido
      fs.unlinkSync(originalPath);

      // Actualizar datos de la imagen en req.file
      req.file.path    = compressedPath;
      req.file.filename = compressedName;

      filename = compressedName;
    }

    // 3. Validación de cada activo: debe tener tag
    const seenTags = new Set();
    for (let i = 0; i < activos.length; i++) {
      const activo = activos[i];
      if (!activo.tag || typeof activo.tag !== 'string' || activo.tag.trim() === '') {
        if (req.file?.path) fs.unlinkSync(req.file.path);
        return res.status(400).json({
          message: `El activo en la posición ${i} debe tener un campo 'Placa' no vacío.`
        });
      }
      const cleanTag = activo.tag.trim();
      if (seenTags.has(cleanTag)) {
        if (req.file?.path) fs.unlinkSync(req.file.path);
        return res.status(400).json({
          message: `La placa '${cleanTag}' está repetida en la petición (índice ${i}).`
        });
      }
      seenTags.add(cleanTag);
    }

    // 4. Verificar en la BD que ninguno de estos tags ya tenga un traslado previo
    for (const activo of activos) {
      const cleanTag = activo.tag.trim();
      const ultimo   = await Transfer.findOne({
        where: { tag: cleanTag },
        order: [['fecha_traslado', 'DESC']]
      });

      if (ultimo) {
        if (req.file?.path) fs.unlinkSync(req.file.path);
        const fechaISO = new Date(ultimo.fecha_traslado).toISOString().slice(0, 10);
        return res.status(400).json({
          message: `El activo con placa '${cleanTag}' ya se encuentra en '${ultimo.location}' desde ${fechaISO}. No se puede trasladar de nuevo sin una baja previa.`
        });
      }
    }

    // 5. Transacción para insertar
    const result = await sequelize.transaction(async (t) => {
      const detalles = activos.map(activo => ({
        id_posi,
        fecha_traslado,
        funcionario_name:   funcionario.name.trim(),
        funcionario_email:  funcionario.email.trim(),
        funcionario_depen:  funcionario.depen.trim(),
        location:           location.trim(),
        item_name:        (activo.item_name   || '').trim(),
        item_brand:       (activo.item_brand  || '').trim(),
        item_serial:      (activo.item_serial || '').trim(),
        item_descrip:     (activo.item_descrip || '').trim(),
        tag:              activo.tag.trim(),
        details:          (details || '').trim(),
        img:              filename // aquí puede ser null si no subieron imagen
      }));

      // Verificar FK de item
      for (const det of detalles) {
        const existeItem = await Item.findOne({ where: { tag: det.tag }, transaction: t });
        if (!existeItem) {
          const err = new Error(`El ítem con tag '${det.tag}' no existe en la tabla 'item'.`);
          err.status = 400;
          throw err;
        }
      }

      return await Transfer.bulkCreate(detalles, { transaction: t });
    });

    return res.status(201).json({
      message: `Se asignaron ${result.length} activo(s) exitosamente.`,
      transfers: result
    });

  } catch (error) {
    if (req.file?.path) fs.unlinkSync(req.file.path);
    if (error.status === 400) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Error al crear transferencias:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const updateTransfer = async (req, res, next) => {
  const id_transfer = req.params.id;
  // 1) Extraemos los campos según tu modelo plano:
  const {
    id_posi,
    fecha_traslado,
    funcionario_name,
    funcionario_email,
    funcionario_depen,
    item_name,
    item_brand,
    item_serial,
    item_descrip,
    tag,
    location,
    details
  } = req.body;

  // 2) Validamos los campos obligatorios (según allowNull: false en el modelo)
  const errors = [];
  if (!id_posi)               errors.push('id_posi (posición destino)');
  if (!fecha_traslado)        errors.push('fecha_traslado');
  if (!funcionario_name)      errors.push('funcionario_name');
  if (!funcionario_depen)     errors.push('funcionario_depen');
  if (!item_name)             errors.push('item_name');
  if (!item_brand)            errors.push('item_brand');
  if (!item_serial)           errors.push('item_serial');
  if (!item_descrip)          errors.push('item_descrip');
  if (!tag)                   errors.push('tag');
  if (!location)              errors.push('location');
  if (!details)               errors.push('details');
  // (funcionario_email es allowNull: true en el modelo, pero si prefieres requerirlo, agrégalo a la validación)

  if (errors.length) {
    return res.status(400).json({
      message: 'Faltan campos obligatorios o hay valores inválidos',
      fields: errors
    });
  }

  try {
    // 3) Buscamos el traslado existente
    const existing = await Transfer.findByPk(id_transfer);
    if (!existing) {
      return res.status(404).json({
        message: `No se encontró traslado con ID ${id_transfer}.`
      });
    }

    // 4) Validar conflicto de TAG si cambió
    const cleanTag = tag.trim();
    if (cleanTag !== existing.tag) {
      const ultimo = await Transfer.findOne({
        where: { tag: cleanTag },
        order: [['fecha_traslado', 'DESC']]
      });
      if (ultimo) {
        const fechaISO = new Date(ultimo.fecha_traslado).toISOString().slice(0, 10);
        return res.status(400).json({
          message: `No se puede cambiar el tag a '${cleanTag}', porque ese item ya registra un traslado en '${ultimo.location}' desde ${fechaISO}.`
        });
      }
    }

    // 5) Verificar que el item con ese TAG existe en la tabla Item
    const existeItem = await Item.findOne({ where: { tag: cleanTag } });
    if (!existeItem) {
      return res.status(400).json({
        message: `El ítem con tag '${cleanTag}' no existe en la tabla 'Item'.`
      });
    }

    // 6) Verificar que la posición destino exista
    const posicion = await Position.findByPk(id_posi);
    if (!posicion) {
      return res.status(404).json({
        message: `No se encontró posición con id ${id_posi}.`
      });
    }

    // 7) Actualizamos dentro de una transacción
    const updated = await sequelize.transaction(async (t) => {
      existing.id_posi            = id_posi;
      existing.fecha_traslado     = fecha_traslado;
      existing.funcionario_name   = funcionario_name;
      existing.funcionario_email  = funcionario_email;
      existing.funcionario_depen  = funcionario_depen;
      existing.item_name          = item_name;
      existing.item_brand         = item_brand;
      existing.item_serial        = item_serial;
      existing.item_descrip       = item_descrip;
      existing.tag                = cleanTag;
      existing.location           = location.trim();
      existing.details            = details;

      return await existing.save({ transaction: t });
    });

    // 8) Devolvemos la respuesta con el registro actualizado
    return res.status(200).json({
      message: `Traslado con ID ${id_transfer} actualizado exitosamente.`,
      transfer: updated
    });

  } catch (error) {
    console.error('Error al actualizar traslado:', error);
    // Si lanzaste un error con status = 400 dentro de la transacción, se propaga aquí
    if (error.status === 400) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({
      message: 'Error interno del servidor al actualizar traslado',
      error: error.message
    });
  }
};
