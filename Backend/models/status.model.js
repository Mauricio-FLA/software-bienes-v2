import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const Status = sequelize.define('status', {
    id_status: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name_status: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
},{
    tableName: 'status',
    timestamps: false
});

export default Status;