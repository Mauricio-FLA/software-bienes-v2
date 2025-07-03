import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const Subgerence = sequelize.define('sungerence', {
    id_sub: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name_sub: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
},{
    tableName: 'subgerence',
    timestamps: false
});

export default Subgerence;