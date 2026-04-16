const express = require('express')
const cors = require('cors')
const { query } = require('./Database/index')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/test', (req, res) => {
  res.json({ mensaje: 'Backend funcionando' })
})

app.get('/api/db-check', async (req, res) => {
  try {
    const result = await query('SELECT NOW()')
    res.json({ 
      status: '✅ Conectado a la base de datos',
      timestamp: result.rows[0].now 
    })
  } catch (error) {
    res.status(500).json({ 
      status: '❌ Error de conexión',
      error: error.message 
    })
  }
})

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000')
})