import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
import Rol from './rol.model.js';

const Admin = sequelize.define('admin',
    
  {
    // numero de documento
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true, // tipo texto hasta 100 caracteres
        allowNull: false, // no se permite que sea nulo
        unique: true, // campo unico y no se pueda repetir
    },

    name_admin: {
      type: DataTypes.STRING(100), // tipo texto hasta 100 caracteres
      allowNull: false, // no se permite que sea nulo
      unique: true, // campo unico y no se pueda repetir
  },

    // correo
    email: {
      type: DataTypes.STRING(100), // texto, hasta 200 caracteres
      allowNull: false, // no se permite que sea nulo
      unique: true, // campo unico y no se pueda repetir
    },

    // contraseña
    password: {
      type: DataTypes.STRING(100), // Cadena
      allowNull: false,              // No acepta valor nulo
      trim: true
    },

    // llave foranea
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rol',
        key: 'id_rol'
      }
    }

  },
  {
    tableName: 'admin',
    timestamps: false
  });

  Admin.belongsTo(Rol, {foreignKey: 'id_rol', as: 'Rol'});

export default Admin;