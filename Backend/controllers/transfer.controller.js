import { Op, fn, col } from 'sequelize';   
import Transfer from '../models/transfer.model.js';
import Position from '../models/position.model.js';
import Item from '../models/item.model.js';
import sequelize from '../config/db.js'; 

// OBTENER TODOS LOS REGISTROS
export const getsTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.findAll({
      attributes: { exclude: ['img'] },
      include: [
        { model: Position, attributes: ['id_pos'] },
        { model: Item,     attributes: ['id_tag'] },
      ],
    });
    res.json(transfers);
  } catch (error) {
    console.error('Error al obtener transferencias:', error);
    res.status(500).json({ message: 'Error interno.', error: error.message });
  }
};

// OBTENER LOS REGISTROS RESUMIDOS
export const getAllTransfers = async (req, res) => {
  try {
    // 1) Agrupamos para obtener totales y un sample_id
    const groups = await Transfer.findAll({
      attributes: [
        'funcionario_name',
        'funcionario_email',
        'funcionario_depen',
        [fn('COUNT', col('id_transfer')), 'total_transfers'],
        [fn('MAX', col('id_transfer')),   'sample_id']
      ],
      group: [
        'funcionario_name',
        'funcionario_email',
        'funcionario_depen'
      ],
      raw: true
    });

    const sampleIds = groups.map(g => g.sample_id);

    // 2) Traemos los registros de muestra, excluyendo 'img'
    const samples = await Transfer.findAll({
      where: { id_transfer: { [Op.in]: sampleIds } },
      attributes: {
        exclude: ['img']
      },
      order: [['fecha_traslado', 'ASC']]
    });

    // 3) Mapeamos por id_transfer para unir con los grupos
    const sampleMap = new Map(samples.map(s => [s.id_transfer, s]));

    // 4) Construimos el resultado final
    const result = groups.map(g => {
      const sample = sampleMap.get(g.sample_id);
      return {
        funcionario: {
          name:  g.funcionario_name,
          email: g.funcionario_email,
          depen: g.funcionario_depen
        },
        total_transfers: Number(g.total_transfers),
        sample: sample
          ? {
              id_transfer:    sample.id_transfer,
              fecha_traslado: sample.fecha_traslado,
              tag:            sample.tag,
              location:       sample.location,
              details:        sample.details,
              item: {
                name:    sample.item_name,
                brand:   sample.item_brand,
                serial:  sample.item_serial,
                descrip: sample.item_descrip
              }
            }
          : null
      };
    });

    return res.json(result);
  } catch (error) {
    console.error('Error al obtener transferencias agrupadas:', error);
    return res
      .status(500)
      .json({ message: 'Error interno.', error: error.message });
  }
};


export const getTransferById = async (req, res) => {
  try {
    const { id } = req.params;

    const transfer = await Transfer.findByPk(id, {
      include: [
        { model: Position },
        { model: Item },
      ]
    });

    if (!transfer) {
      return res.status(404).json({ message: 'Traslado no encontrado.' });
    }

    res.json(transfer);
  } catch (error) {
    console.error('Error al obtener traslado por ID:', error);
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};

export const getTransferByIdByImg = async (req, res) => {
  try {
    const { id } = req.params;

    const transfer = await Transfer.findByPk(id, {
      include: [
        { model: Position },
        { model: Item },
      ]
    });

    if (!transfer) {
      return res.status(404).json({ message: 'Traslado no encontrado.' });
    }

    res.json(transfer);
  } catch (error) {
    console.error('Error al obtener traslado por ID:', error);
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};

export const getTransfersByPosition = async (req, res, next) => {
  const { id_pos } = req.params;

  try {
    const position = await Position.findByPk(id_pos);
    if (!position) {
      return res
        .status(404)
        .json({ message: `Posición con id ${id_pos} no encontrada.` });
    }

    const transfers = await Transfer.findAll({
      where: { id_pos },
      attributes: [
        'id_transfer',
        'details',
        'id_pos',
        'tag',
        'fecha_traslado',
        'funcionario_name',
        'funcionario_email',
        'funcionario_depen',
        'item_name',
        'item_brand',
        'item_serial',
        'item_descrip',
        'location'
      ],
      order: [['fecha_traslado', 'ASC']]
    });

    const response = {
      funcionario: {
        id_pos: position.id_pos,
        name: position.name,
        email: position.email,
        id_depen: position.id_depen
      },
      transfers: transfers.map(t => ({
        id_transfer: t.id_transfer,
        fecha_traslado: t.fecha_traslado,
        details: t.details,
        tag: t.tag,
        location: t.location,
        funcionario: {
          name: t.funcionario_name,
          email: t.funcionario_email,
          depen: t.funcionario_depen
        },
        item: {
          name: t.item_name,
          brand: t.item_brand,
          serial: t.item_serial,
          descrip: t.item_descrip
        }
      }))
    };

    return res.json(response);
  } catch (error) {
    console.error('Error al obtener transfers por posición:', error);
    return res
      .status(500)
      .json({ message: 'Error interno del servidor.' });
  }
};


export const deleteTransfer = async (req, res, next) => {
  const  id_transfer  = req.params.id;

  try {
    const existing = await Transfer.findByPk(id_transfer);
    if (!existing) {
      return res.status(404).json({ message: `No se encontró traslado con ID ${id_transfer}.` });
    }

    // Borra el registro (puede hacerse dentro de transacción si quieres guardar histórico u otros efectos)
    await sequelize.transaction(async (t) => {
      await existing.destroy({ transaction: t });
    });

    return res.status(200).json({ message: `Traslado con ID ${id_transfer} eliminado exitosamente.` });
  } catch (error) {
    console.error('Error al eliminar traslado:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};