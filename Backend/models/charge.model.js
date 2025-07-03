import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

// DEFINE UN MODELO LLAMADO 'CHARGE' UTILIZANDO SEQUELIZE
const Charge = sequelize.define('charge', 
{
    // DEFINE EL CAMPO 'ID_CHARGE' COMO CLAVE PRIMARIA, ENTERO Y AUTOINCREMENTAL
    id_charge: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    // DEFINE EL CAMPO 'NAME_CHARGE' COMO UNA CADENA DE HASTA 100 CARACTERES, NO PERMITE NULOS Y DEBE SER ÚNICO
    name_charge: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    }
},
{
    // ESPECIFICA EL NOMBRE DE LA TABLA EN LA BASE DE DATOS
    tableName: 'charge',
    // DESACTIVA LA CREACIÓN AUTOMÁTICA DE LOS CAMPOS 'CREATED_AT' Y 'UPDATED_AT'
    timestamps: false,
}
)

// EXPORTA EL MODELO PARA PODER USARLO EN OTROS ARCHIVOS
export default Charge;
