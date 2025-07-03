import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
import Rol from './rol.model.js';

const Practice = sequelize.define('practice', {
    id_practi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
        document: {
        type:DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },

    name_practice: {
        type: DataTypes.STRING(200),
        allowNull: false
    },

    email: {
        type: DataTypes.STRING(200),
        allowNull: false
        },

    password: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    id_rol: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'rol',
            key: 'id_rol'
        }
    }
},{
    tableName: 'practice',
    timestamps: false
});

Practice.belongsTo(Rol, {foreignKey: 'id_rol', as: 'Rol'});

export default Practice;