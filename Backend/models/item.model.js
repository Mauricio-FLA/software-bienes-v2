import sequelize from '../config/db.js';
import { DataTypes, literal } from 'sequelize';
import Tag from './tag.model.js';
import Contract from './contract.model.js';
import Status from './status.model.js';

const Item = sequelize.define('item', {
  tag: {
    type: DataTypes.STRING(100),
    primaryKey: true,
    allowNull: false,
    //  Quitar espacios al inicio y final
    set(value) {
      if (typeof value === 'string') {
        this.setDataValue('tag', value.trim());
      }
    }
  },
  name_item: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING(100),
  },
  serialNumber: {
    type: DataTypes.STRING(100),
  },

  id_contra: {
    type: DataTypes.STRING(200),
    allowNull: true,
    references: {
      model: 'contract',
      key: 'id_contra'
    }
  },

  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: literal('CURRENT_TIMESTAMP')
  },

  img: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
  id_tag: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tags',
      key: 'id_tag'
    },
  },
  id_status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'status',
      key: 'id_status'
    }
  }
  

}, {
  tableName: 'item',
  timestamps: false,
});

Item.belongsTo(Tag, { foreignKey: 'id_tag', as: 'tags' });
Item.belongsTo(Contract, { foreignKey: 'id_contra', as: 'Contracto' });
Item.belongsTo(Status, {foreignKey: 'id_status', as: 'status'})
Contract.hasMany(Item, { foreignKey: 'id_contra'});

export default Item;
