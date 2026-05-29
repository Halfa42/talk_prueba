const { query } = require('../Database/index');
const bcrypt = require('bcrypt');

const getStudentProfile = async (req, res) => {
  try {
    const usuarioId = Number(req.params.usuarioId);

    const result = await query(
      `SELECT 
         u.nombre, 
         u.apellido_paterno, 
         u.apellido_materno,
         b.idioma AS programa, 
         b.nivel,
         ut.nombre AS tutor_nombre,
         ut.apellido_paterno AS tutor_apellido,
         ut.apellido_materno AS tutor_materno
       FROM beneficiario b
       INNER JOIN usuario u ON b.id_usuario = u.id_usuario
       LEFT JOIN asignacion a ON b.id_beneficiario = a.id_beneficiario
       LEFT JOIN tutortec t ON a.id_tutor = t.id_tutor
       LEFT JOIN usuario ut ON t.id_usuario = ut.id_usuario
       WHERE u.id_usuario = $1
       ORDER BY a.id_asignacion DESC
       LIMIT 1`,
      [usuarioId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const changePassword = async (req, res) => {
  try {
    const usuarioId = Number(req.params.usuarioId);
    const { matricula, nueva_contrasena } = req.body;

    if (!matricula || !nueva_contrasena) {
      return res.status(400).json({ message: 'Matrícula y nueva contraseña son requeridas' });
    }

    const userRes = await query(
      `SELECT matricula_folio FROM beneficiario WHERE id_usuario = $1`,
      [usuarioId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const matriculaDB = userRes.rows[0].matricula_folio;

    if (matriculaDB !== matricula) {
      return res.status(401).json({ message: 'La matrícula/folio ingresada es incorrecta' });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(nueva_contrasena, saltRounds);

    await query(
      `UPDATE usuario SET contrasena = $1 WHERE id_usuario = $2`,
      [hashedPassword, usuarioId]
    );

    return res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getStudentProfile,
  changePassword
};