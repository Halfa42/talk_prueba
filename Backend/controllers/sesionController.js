const { query } = require('../Database/index');

const createSesion = async (req, res) => {
  try {
    const {
      id_asignacion, fecha_sesion, hora_inicio, hora_fin,
      tema, observaciones, asistencia, aprobado_padre_madre  // ← add this
    } = req.body;

    const idAsignacion = Number(id_asignacion);
    if (!Number.isInteger(idAsignacion) || idAsignacion <= 0) {
      return res.status(400).json({ message: 'El identificador de asignación no es válido.' });
    }

    if (!fecha_sesion || typeof fecha_sesion !== 'string' || fecha_sesion.trim() === '') {
      return res.status(400).json({ message: 'Por favor selecciona la fecha de la sesión.' });
    }

    if ((hora_inicio && !hora_fin) || (!hora_inicio && hora_fin)) {
      return res.status(400).json({ message: 'Por favor selecciona tanto la hora de inicio como la hora de fin.' });
    }

    let horas_registradas = 0;
    if (hora_inicio && hora_fin) {
      const [h1, m1] = hora_inicio.split(':').map(Number);
      const [h2, m2] = hora_fin.split(':').map(Number);

      if (
        !Number.isInteger(h1) || !Number.isInteger(m1) ||
        !Number.isInteger(h2) || !Number.isInteger(m2) ||
        h1 < 0 || h1 > 23 || m1 < 0 || m1 > 59 ||
        h2 < 0 || h2 > 23 || m2 < 0 || m2 > 59
      ) {
        return res.status(400).json({ message: 'Por favor ingresa una hora de inicio y fin válidas.' });
      }

      horas_registradas = ((h2 * 60 + m2) - (h1 * 60 + m1)) / 60;
      if (horas_registradas < 0) {
        return res.status(400).json({ message: 'La hora de fin debe ser mayor a la hora de inicio.' });
      }
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
