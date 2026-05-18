const { query } = require('../Database/index');

const createBitacora = async (req, res) => {
  try {
    const { id_asignacion, tipo, descripcion, fecha } = req.body;
    const idAsignacion = Number(id_asignacion);

    if (!Number.isInteger(idAsignacion) || idAsignacion <= 0 || !descripcion) {
      return res.status(400).json({ message: 'id_asignacion y descripcion son requeridos' });
    }

    // Link to the most recent session for this asignacion
    const sesionResult = await query(
      `SELECT id_sesion FROM sesion WHERE id_asignacion = $1 ORDER BY fecha_sesion DESC, hora_inicio DESC LIMIT 1`,
      [idAsignacion]
    );

    if (sesionResult.rows.length === 0) {
      return res.status(400).json({ message: 'No hay sesiones registradas para esta asignación. Registra una sesión primero.' });
    }

    const id_sesion = sesionResult.rows[0].id_sesion;

    const result = await query(
      `INSERT INTO bitacora (id_sesion, tipo, descripcion, fecha)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id_sesion, tipo || null, descripcion, fecha || new Date()]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error en createBitacora:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getBitacorasByAsignacion = async (req, res) => {
  try {
    const { idAsignacion } = req.params;

    const result = await query(
      `SELECT b.id_bitacora, b.tipo, b.descripcion, b.fecha
       FROM bitacora b
       INNER JOIN sesion s ON b.id_sesion = s.id_sesion
       WHERE s.id_asignacion = $1
       ORDER BY b.fecha DESC
       LIMIT 10`,
      [idAsignacion]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error('Error en getBitacorasByAsignacion:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { createBitacora, getBitacorasByAsignacion };
