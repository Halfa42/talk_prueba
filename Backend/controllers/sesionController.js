const { query } = require('../Database/index');

const createSesion = async (req, res) => {
  try {
    const {
      id_asignacion, fecha_sesion, hora_inicio, hora_fin,
      tema, observaciones, asistencia, aprobado_padre_madre  // ← add this
    } = req.body;

    const idAsignacion = Number(id_asignacion);
    if (!Number.isInteger(idAsignacion) || idAsignacion <= 0 || !fecha_sesion) {
      return res.status(400).json({ message: 'id_asignacion y fecha_sesion son requeridos' });
    }

    let horas_registradas = 0;
    if (hora_inicio && hora_fin) {
      const [h1, m1] = hora_inicio.split(':').map(Number);
      const [h2, m2] = hora_fin.split(':').map(Number);
      horas_registradas = ((h2 * 60 + m2) - (h1 * 60 + m1)) / 60;
      if (horas_registradas < 0) horas_registradas = 0;
    }

    const result = await query(
      `INSERT INTO sesion
        (id_asignacion, fecha_sesion, hora_inicio, hora_fin, tema, observaciones, asistencia, horas_registradas, aprobado_padre_madre)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        idAsignacion, fecha_sesion, hora_inicio || null, hora_fin || null,
        tema || null, observaciones || null, asistencia || null,
        horas_registradas,
        aprobado_padre_madre ?? null   // ← add this
      ]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error en createSesion:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getSesionesByAsignacion = async (req, res) => {
  try {
    const { idAsignacion } = req.params;

    const result = await query(
      `SELECT * FROM sesion WHERE id_asignacion = $1 ORDER BY fecha_sesion DESC, hora_inicio DESC`,
      [idAsignacion]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error('Error en getSesionesByAsignacion:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { createSesion, getSesionesByAsignacion };