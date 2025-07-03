import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const databaseConnection = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false, // para desactivar los logs de maysql en la consola
    }
);

// Funcon para validar errores al conectarse a la base de datos
export async function testConnection() {
    try {
      await databaseConnection.authenticate();
      console.log('Conexión a MySQL exitosa');
    } catch (err) {
      console.error('Error al conectar a MySQL:', err);
    }
  }
  
export default databaseConnection;