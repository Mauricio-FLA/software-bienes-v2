// controllers/position.controller.js
import Position from '../models/position.model.js';
import Charge from '../models/charge.model.js';
import Dependency from '../models/dependency.model.js';
import { createAccessToken } from '../libs/jwt.js';
import Subgerence from '../models/subgerence.model.js';
import Status from '../models/status.model.js';

// CREAR FUNCIONARIO
export const createPosition = async (req, res) => {
  try {
    const { id_pos, name,  email,  id_charge, id_sub, id_depen, id_status } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }
    // verificar email y id_pos únicos
    const existsEmail = await Position.findOne({ where: { email } });
    if (existsEmail) return res.status(400).json({ message: 'Correo en uso.' });

    if(!id_status){
      id_status = 'Activo';
    }

    const newPos = await Position.create({
      id_pos,
      name,
      email,
      id_charge,
      id_sub,
      id_depen,
      id_status 
      
    });
    res.status(201).json(newPos);
  } catch (error) {
    console.error('Error al crear funcionario:', error);
    res.status(500).json({ message: 'Error interno.', error: error.message });
  }
};

export const getAllPositions = async (req, res) => {
  try {
    const positions = await Position.findAll({
      include: [
        { model: Charge, attributes: ['name_charge'], as: 'cargo' },
        { model: Subgerence, attributes: ['name_sub'], as: 'subgerencia' },
        { model: Dependency, attributes: ['name_depen'], as: 'dependencia' },
        { model: Status, attributes: ['name_status'], as: 'status' }
      ],
      attributes: { exclude: ['id_charge', 'id_sub', 'id_depen', 'id_status'] }
    });
    res.status(200).json(positions);
  } catch (error) {
    console.error('Error al obtener posiciones:', error);
    res.status(500).json({ message: 'Error interno.', error: error.message });
  }
};

// Obtener una posición por ID incluyendo 
export const getPositionById = async (req, res) => {
  try {
    const { id } = req.params;
    const position = await Position.findByPk(id, {
      include: [
        { model: Charge, attributes: ['name_charge'], as: 'cargo' },
        { model: Subgerence, attributes: ['name_sub'], as: 'subgerencia' },
        { model: Dependency, attributes: ['name_depen'], as: 'dependencia' },
        { model: Status, attributes: ['name_status'], as : 'status'}
      ],
      attributes: { exclude: ['id_charge', 'id_sub', 'id_depen', 'id_status'] }
    });
    if (!position) {
      return res.status(404).json({ message: 'Posición no encontrada.' });
    }
    res.status(200).json(position);
  } catch (error) {
    console.error('Error al obtener posición:', error);
    res.status(500).json({ message: 'Error interno.', error: error.message });
  }
};

// Actualizar una posición
export const updatePosition = async (req, res) => {
  // Se asume que el middleware de autenticación ha colocado el id del usuario en req.user.id
  const {id} = req.params;
  const { name, email, id_charge, id_sub, id_depen, id_status } = req.body;

  try {
    const position = await Position.findByPk(id);
    if (!position)
      return res.status(404).json({ message: "Funcionario no encontrado" });

    // Verificar si se intenta actualizar el correo y que no esté en uso por otro usuario
    if (email && email !== position.email) {
      const emailExists = await Position.findOne({ email });
      if (emailExists)
        return res.status(400).json({ message: "El correo ya está en uso" });
    }

    // Actualizar los campos si se reciben en el request
    if (name) position.name = name;
    if (email) position.email = email;
    if (id_charge) position.id_charge = id_charge;
    if (id_sub) position.id_sub = id_sub;
    if (id_depen) position.id_depen = id_depen;
    if(id_status) position.id_status = id_status;

    const updatedPosi = await position.save();
    res.json({
      id_pos: updatedPosi.id_pos,
      name: updatedPosi.name,
      email: updatedPosi.email,
      id_charge: updatedPosi.id_charge,
      id_sub: updatedPosi.id_sub,
      id_depen: updatedPosi.id_depen,
      id_status: updatedPosi.id_status,
    });
  } catch (error) {
    console.log("Error al actualizar el funcionario.", error.message);
    return res.status(500).json({ message: error.message });
  }
};