const express = require('express')
const cors = require('cors')
const { query } = require('./Database/index')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/test', (req, res) => {
  res.json({ mensaje: 'Backend funcionando' })
})

const fetchDatabaseNow = async () => {
  const result = await query('SELECT NOW()')
  return result.rows[0].now
}

const DBsuccess = (res, timestamp) => {
  res.json({
    status: '✅ Conectado a la base de datos',
    timestamp,
  })
}

const DBerror = (res, error) => {
  res.status(500).json({
    status: '❌ Error de conexión',
    error: error.message,
  })
}

const handleDbCheck = async (req, res) => {
  try {
    const timestamp = await fetchDatabaseNow()
    DBsuccess(res, timestamp)
  } catch (error) {
    DBerror(res, error)
  }
}

app.get('/api/db-check', handleDbCheck)

const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000')
})