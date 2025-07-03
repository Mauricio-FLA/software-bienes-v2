// IMPORTA LOS TIPOS DE DATOS DESDE SEQUELIZE
import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
import Position from './position.model.js';
import Item from './item.model.js';

// DEFINE EL MODELO 'TRANSFER', QUE REPRESENTA UN REGISTRO DE TRANSFERENCIA DE ÍTEMS ENTRE USUARIOS O ÁREAS
const Transfer = sequelize.define('transfer',
  {
    // CLAVE PRIMARIA DE LA TRANSFERENCIA, AUTOINCREMENTAL
    id_transfer: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // DETALLES DE LA TRANSFERENCIA (DESCRIPCIÓN O OBSERVACIÓN)
    details: {
      type: DataTypes.TEXT(300),
      allowNull: false
    },
    // CLAVE FORÁNEA A LA TABLA 'POSITION', INDICA QUIÉN RECIBE O GESTIONA LA TRANSFERENCIA
    id_pos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'position',
        key: 'id_pos'
      }
    },
    // CLAVE FORÁNEA A LA TABLA 'ITEM', INDICA EL OBJETO QUE SE TRANSFIERE
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'item',
        key: 'tag'
      }
    },
    // FECHA DE TRASLADO
    fecha_traslado: {
      type: DataTypes.DATE,
      allowNull: false
    },
    img: {
      type: DataTypes.STRING(200),
    },

    funcionario_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    funcionario_email: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    funcionario_depen: {
      type: DataTypes.STRING,
      allowNull: false
    },
    item_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    item_brand: {
      type: DataTypes.STRING,
      allowNull: false
    },
    item_serial: {
      type: DataTypes.STRING,
      allowNull: false
    },
       item_descrip: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    location: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
  },
  {
    // NOMBRE DE LA TABLA EN LA BASE DE DATOS
    tableName: 'transfer',
    timestamps: false,
  }
);

// RELACIONES
Transfer.belongsTo(Position, { foreignKey: 'id_pos' });
Transfer.belongsTo(Item, { foreignKey: 'tag' });
Position.hasMany(Transfer, { foreignKey: 'id_pos' });
Item.hasMany(Transfer, { foreignKey: 'tag' });

export default Transfer;
