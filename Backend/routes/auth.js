const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../Database/index');

const router = express.Router();


router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;
  console.log('Datos recibidos:', { correo, contrasena }); 

  try {
    const result = await query('SELECT * FROM usuario WHERE correo = $1', [correo]);
    console.log('Resultado de la consulta:', result.rows); 

    if (result.rows.length === 0) {
      console.log('Usuario no encontrado');
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    console.log('Resultado de comparación de contraseñas:', isMatch); 
    if (!isMatch) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const token = jwt.sign({ id: user.id_usuario, rol: user.rol }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token, rol: user.rol });
  } catch (error) {
    console.error('Error en /login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;