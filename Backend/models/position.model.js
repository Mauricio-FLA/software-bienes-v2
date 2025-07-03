import  sequelize  from '../config/db.js';
import { DataTypes } from 'sequelize';
import Charge from './charge.model.js';
import Dependency from './dependency.model.js';
import Subgerence from './subgerence.model.js';
import Status from './status.model.js';

// DEFINE EL MODELO 'POSITION' QUE REPRESENTA UN USUARIO, CARGO O FUNCIONARIO
const Position = sequelize.define('position', 
    {
        // CAMPO 'id_posTION' COMO CLAVE PRIMARIA, ENTERO, AUTOINCREMENTAL
        id_pos: {
            type: DataTypes.BIGINT,
            primaryKey: true,
        },
        // CAMPO 'NAME' COMO CADENA DE HASTA 100 CARACTERES, NO NULO
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        // CAMPO 'EMAIL' COMO CADENA ÚNICA, NO NULO
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        // CAMPO 'PASSWORD' COMO CADENA, NO NULO
   
        // CLAVE FORÁNEA A LA TABLA 'CHARGE' MEDIANTE 'ID_CHARGE'
        id_charge: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'charge',
                key: 'id_charge'
            },
        },
        id_sub: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'subgerence',
                key: 'id_sub'
            }
        },
        // CLAVE FORÁNEA A LA TABLA 'DEPENDENCY' (HABÍA UN ERROR DE ESCRITURA EN 'DEPENDENDY')
        id_depen: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'dependency',
                key: 'id_depen'
            },
        },
        id_status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'status',
                key: 'id_status'
            }
        },
    },
    {
        // NOMBRE DE LA TABLA EN LA BASE DE DATOS
        tableName: 'position',
        // DESACTIVA LOS CAMPOS AUTOMÁTICOS 'CREATED_AT' Y 'UPDATED_AT'
        timestamps: false
    }
);

Position.belongsTo(Charge,     { foreignKey: 'id_charge', as: 'cargo' });
Position.belongsTo(Dependency,{ foreignKey: 'id_depen',  as: 'dependencia' });
Position.belongsTo(Subgerence,{ foreignKey: 'id_sub',  as: 'subgerencia' });
Position.belongsTo(Status, {foreignKey: 'id_status', as: 'status'})

// EXPORTA EL MODELO PARA SU USO EN OTROS ARCHIVOS
export default Position;
