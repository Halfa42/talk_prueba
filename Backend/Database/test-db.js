const { query } = require('./index');

async function testConnection() {
  try {
    console.log('🔄 Probando conexión a la base de datos...');
    const result = await query('SELECT NOW()');
    console.log('✅ Conexión exitosa!');
    console.log('Timestamp del servidor:', result.rows[0].now);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testConnection();
