import sequelise from '../config/db.js';
import { DataTypes } from 'sequelize';
import Subgerence from './subgerence.model.js';


const Dependency = sequelise.define('dependency', {
    id_depen: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name_depen: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    id_sub: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'subgerence',
            key: 'id_sub'
        }
    }
},   {
    tableName: 'dependency',
    timestamps: false
  });

  Dependency.belongsTo(Subgerence, {foreignKey: 'id_sub', as: 'subgerencia'})

export default Dependency;