import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const Rol = sequelize.define('rol', {
    id_rol : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name_rol: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true
    }
},{
    tableName: 'rol',
    timestamps: false
})

export default Rol;