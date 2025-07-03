import fs from 'fs';
import path from 'path';
import sharp from "sharp";
import sequelize from '../config/db.js';
import Assign from "../models/Assign.model.js";
import Position from "../models/position.model.js";
import Item from '../models/item.model.js';
import Charge from '../models/charge.model.js';
import Dependency from '../models/dependency.model.js';
import Status from '../models/status.model.js';

export const createAssign = async (req, res) => {

let raw = req.body.assigns


if (typeof raw === 'string') {
  try {
    raw = JSON.parse(raw);
  } catch (e) {
    return res.status(400).json({ message: 'assigns no es un JSON válido' });
  }
}

let assignsArray = [];
if (Array.isArray(raw)) {
  assignsArray = raw;
} else if (raw && typeof raw === 'object') {
  assignsArray = [raw];
}

if (!assignsArray.length) {
  return res.status(400).json({ message: 'No se enviaron asignaciones.' });
}


  // 2. Validación básica (igual que antes)…
  //    ➞ recorta, verifica id_pos, details, location, tag, imágenes y tags únicos

  try {
    const result = await sequelize.transaction(async (t) => {
      // 3. Obtener el status “Asignado”
      const assignedStatus = await Status.findOne({
        where: { name_status: 'Asignado' },
        transaction: t
      });
      if (!assignedStatus) {
        const err = new Error(`Estado "Asignado" no existe en la tabla Status`);
        err.status = 500;
        throw err;
      }

      // 4. Preparar datos de Assign (igual que antes)…
      const records = [];
      const files = Array.isArray(req.files) ? req.files : [];
      for (let i = 0; i < assignsArray.length; i++) {
        const { details, location, id_pos, tag } = assignsArray[i];
        // Verificar existencia de la posición
        if (!await Position.findByPk(id_pos, { transaction: t })) {
          const err = new Error(`Position ${id_pos} no encontrada`);
          err.status = 404;
          throw err;
        }

        // Procesar imagen (igual que antes)…
        let imgPath = null;
        if (files[i]) {
          const orig = files[i].path;
          const compName = 'compressed-' + files[i].filename;
          const compPath = path.join(path.dirname(orig), compName);
          await sharp(orig)
            .resize({ width: 800, withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toFile(compPath);
          await fs.promises.unlink(orig);
          imgPath = path.relative(path.resolve('uploads'), compPath).replace(/\\/g, '/');
        }

        records.push({
          details:   details.trim(),
          location:  location.trim(),
          id_pos,
          tag:       tag.trim(),
          img:       imgPath,
          date_assi: new Date()
        });
      }

      // 5. Crear asignaciones
      const createdAssigns = await Assign.bulkCreate(records, { transaction: t });

      // 6. Actualizar estado de Items
      const tags = records.map(r => r.tag);
      await Item.update(
        { id_status: assignedStatus.id_status },
        { where: { tag: tags }, transaction: t }
      );

      return createdAssigns;
    });

    return res.status(201).json({
      message: `Se crearon ${result.length} asignación(es) y los items se marcaron como “Asignado”.`,
      assigns: result
    });

  } catch (error) {
    // limpiar archivos como antes…
    if (req.files) req.files.forEach(f => fs.existsSync(f.path) && fs.unlinkSync(f.path));
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getAllAssign = async (req, res) => {
  try {
    const assigns = await Assign.findAll({
      include: [
        {
          model: Position, as: 'position', attributes: ['name', 'email', 'id_pos'],

          include: [
            { model: Charge, as: 'cargo', attributes: ['name_charge']},
            { model: Dependency, as: 'dependencia', attributes: ['name_depen'] }
          ]
        },
        { model: Item, attributes: ['tag', 'name_item', 'brand', 'serialNumber', 'img']}
      ],
    });

    return res.status(200).json(assigns);
  } catch (error) {
    console.error('Error al obtener las asignaciones:', error);
    return res.status(500).json({
      message: 'Error al obtener las asignaciones',
      error: error.message
    });
  }
};

export const getAssignById = async (req, res) => {
  const { id } = req.params;

  try {
    const assign = await Assign.findOne({
      where: { id_assi: id },

      include: [
        { model: Position, attributes: ['name', 'email', 'id_pos'], 
            include: [
            { model: Charge, as: 'cargo', attributes: ['name_charge']},
            { model: Dependency, as: 'dependencia', attributes: ['name_depen']}
          ]
        },
        { model: Item, attributes: ['tag', 'name_item', 'brand', 'serialNumber', 'img']}
      ],
    });

    if (!assign) {
      return res.status(404).json({ message: 'Asignación no encontrada' });
    }

    return res.status(200).json(assign);
  } catch (error) {
    console.error('Error al obtener la asignación:', error);
    return res.status(500).json({
      message: 'Error al obtener la asignación',
      error: error.message
    });
  }
};


export const getAssignsByPosition = async (req, res) => {
  const { id_pos } = req.params;

  try {
    // 1) Datos del funcionario
    const funcionario = await Position.findOne({
      where: { id_pos },
      attributes: ['id_pos', 'name', 'email'],
      include: [
        { model: Charge,     as: 'cargo',       attributes: ['name_charge'] },
        { model: Dependency, as: 'dependencia', attributes: ['name_depen'] }
      ]
    });
    if (!funcionario) {
      return res.status(404).json({ message: 'Funcionario no encontrado.' });
    }

    // 2) Asignaciones del funcionario
    const assigns = await Assign.findAll({
      where: { id_pos },
      attributes: ['id_assi', 'date_assi', 'details', 'location', 'img'],
      include: [
        {
          model: Item,
          as: 'item',  
          attributes: ['tag', 'name_item', 'brand', 'serialNumber', 'img']
        },

        {
          model: Position,
          as: 'position',
          attributes: ['id_pos','name','email', 'id_depen'],
          include: [
            {
              model: Dependency,
              as: 'dependencia',
              attributes: ['name_depen']
            }
          ]
        }
  ],   
      order: [['date_assi', 'DESC']]
    });

    // 3) Devolver un objeto claro
    return res.status(200).json({ funcionario, assigns });

  } catch (error) {
    console.error('Error al obtener las asignaciones:', error);
    return res.status(500).json({
      message: 'Error al obtener las asignaciones por funcionario',
      error: error.message
    });
  }
};

export const DevoAssign = async (req, res) => {
  const { id } = req.params;
  try {
    const assign = await Assign.findByPk(id);
    if (!assign) {
      return res.status(404).json({ messa: `No se encontro la asignación con ID: ${id}.`});
    }
   await Assign.destroy({ where: {id_assi: id}})
    return res.status(200).json({ message: "Devolución de actibo exitosa."})
  } catch (error) {
    console.error("Error al realizar la devolución del Activo.", error.message)
    return res.status(500).json({ message: "No se puede realizar la devolución.", error: error.message})
  }
}