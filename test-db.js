const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión a la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log('Probando conexión a la base de datos...');
    console.log('URL de conexión:', process.env.DATABASE_URL);
    
    // Probar la conexión
    const client = await pool.connect();
    console.log('Conexión exitosa a la base de datos');
    
    // Verificar que la tabla existe
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'transacciones'
      );
    `);
    
    if (result.rows[0].exists) {
      console.log('La tabla "transacciones" existe en la base de datos');
      
      // Contar registros
      const countResult = await client.query('SELECT COUNT(*) FROM transacciones');
      console.log(`Número de transacciones en la base de datos: ${countResult.rows[0].count}`);
    } else {
      console.log('La tabla "transacciones" no existe en la base de datos');
    }
    
    client.release();
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  } finally {
    // Cerrar la conexión
    await pool.end();
  }
}

// Ejecutar la prueba
testConnection();