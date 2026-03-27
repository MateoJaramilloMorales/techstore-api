import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000, 
});

// Prueba de conexión simplificada
pool.query('SELECT 1', (err) => {
  if (err) {
    console.error('❌ Todavía hay un bloqueo de red:', err.message);
  } else {
    console.log('✅ ¡CONECTADO A SUPABASE EXITOSAMENTE!');
  }
});