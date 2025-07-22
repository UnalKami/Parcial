const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión a la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupDatabase() {
  try {
    console.log('Iniciando configuración de la base de datos...');
    
    // Leer el archivo SQL
    const sqlFilePath = path.join(__dirname, 'sql', 'setup-db.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Ejecutar el script SQL
    await pool.query(sqlScript);
    
    console.log('Base de datos configurada correctamente');
    
    // Verificar que la tabla existe
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'transacciones'
      );
    `);
    
    if (result.rows[0].exists) {
      console.log('La tabla "transacciones" existe en la base de datos');
    } else {
      console.error('Error: La tabla "transacciones" no se creó correctamente');
    }
    
  } catch (error) {
    console.error('Error al configurar la base de datos:', error);
  } finally {
    // Cerrar la conexión
    await pool.end();
  }
}

// Ejecutar la configuración
setupDatabase();