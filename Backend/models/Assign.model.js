import { DataTypes, literal } from 'sequelize'
import sequelize from '../config/db.js'
import Position from './position.model.js';
import Item from './item.model.js';

const Assign = sequelize.define('assign', {
    id_assi : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date_assi: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: literal('CURRENT_TIMESTAMP')
    },
    details: {
        type: DataTypes.STRING(300),
        allowNull: true
    },
    location: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    img: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    id_pos: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'position',
            key: 'id_pos',
        }
    },
    tag: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'item',
            key: 'tag'
        }
    }
}, {
    tableName: 'assign',
    timestamps: false
});

Assign.belongsTo(Position, { foreignKey: 'id_pos', as: 'position' });
Assign.belongsTo(Item, { foreignKey: 'tag' });
Position.hasMany(Assign, { foreignKey: 'id_pos' });
Item.hasMany(Assign, { foreignKey: 'tag' });

export default Assign;