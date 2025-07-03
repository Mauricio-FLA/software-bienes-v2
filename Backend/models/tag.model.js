import { DataTypes } from 'sequelize';

// IMPORTA LA CONFIGURACIÓN DE LA CONEXIÓN A LA BASE DE DATOS
import sequelize from '../config/db.js';

// DEFINE EL MODELO 'TAG', QUE REPRESENTA TIPOS DE ETIQUETAS O CATEGORÍAS PARA LOS ÍTEMS
const Tag = sequelize.define('tags', {
    // CAMPO 'ID_TAG' COMO CLAVE PRIMARIA, AUTOINCREMENTAL Y NO NULO
    id_tag: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    // CAMPO 'TAGTYPE' PARA ALMACENAR EL TIPO DE ETIQUETA, NO NULO
    TagType: {
        type: DataTypes.STRING(200),
        allowNull: false
    }
},
{
    // NOMBRE DE LA TABLA EN LA BASE DE DATOS
    tableName: 'tags',
    // DESACTIVA LA CREACIÓN AUTOMÁTICA DE 'CREATED_AT' Y 'UPDATED_AT'
    timestamps: false
});

// EXPORTA EL MODELO PARA SU USO EN OTROS ARCHIVOS
export default Tag;