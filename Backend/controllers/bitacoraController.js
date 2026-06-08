const { query } = require("../Database/index");

const createBitacora = async (req, res) => {
  try {
    const {
      id_asignacion,
      tipo,
      descripcion,
      fecha,
      hora,
      tema,
      planeacion_siguiente_sesion,
      tareas_asignadas,
      horas
    } = req.body;

    const idAsignacion = Number(id_asignacion);

    if (!Number.isInteger(idAsignacion) || idAsignacion <= 0) {
      return res.status(400).json({
        message: "id_asignacion es requerido",
      });
    }

    if (!fecha) {
      return res.status(400).json({
        message: "La fecha es requerida para vincular la bitacora con la sesion correspondiente.",
      });
    }

    const fechaLimpia = fecha.split('T')[0];

    const sesionResult = await query(
      `SELECT id_sesion FROM sesion
       WHERE id_asignacion = $1 AND fecha_sesion = $2::DATE
       ORDER BY id_sesion DESC
       LIMIT 1`,
      [idAsignacion, fechaLimpia]
    );

    if (sesionResult.rows.length === 0) {
      return res.status(400).json({
        message: `No hay sesion registrada el ${fechaLimpia}. Por favor, ve a la pestaña de Registro y guarda la sesion primero.`,
      });
    }

    const id_sesion = sesionResult.rows[0].id_sesion;

    if (horas !== undefined && horas !== null) {
      await query(
        `UPDATE sesion SET horas_registradas = $1 WHERE id_sesion = $2`,
        [Number(horas), id_sesion]
      );
    }

    const imagenRecordatorio = req.files?.imagen_recordatorio?.[0] ?? null;
    const imagenSesion = req.files?.imagen_sesion?.[0] ?? null;
    const imagenIncidencia = req.files?.imagen_incidencia?.[0] ?? null;

    const result = await query(
      `INSERT INTO bitacora
     (id_sesion, tipo, descripcion, fecha, hora, tema,
      planeacion_siguiente_sesion, tareas_asignadas,
      imagen_recordatorio,      imagen_recordatorio_tipo,
      imagen_sesion,            imagen_sesion_tipo,
      imagen_incidencia,        imagen_incidencia_tipo)
   VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
   RETURNING *`,
      [
        id_sesion,
        tipo || null,
        descripcion || null,
        fecha,
        hora || null,
        tema || null,
        planeacion_siguiente_sesion || null,
        tareas_asignadas || null,
        imagenRecordatorio ? imagenRecordatorio.buffer : null,
        imagenRecordatorio ? imagenRecordatorio.mimetype : null,
        imagenSesion ? imagenSesion.buffer : null,
        imagenSesion ? imagenSesion.mimetype : null,
        imagenIncidencia ? imagenIncidencia.buffer : null,
        imagenIncidencia ? imagenIncidencia.mimetype : null,
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getBitacorasByAsignacion = async (req, res) => {
  try {
    const { idAsignacion } = req.params;

    const result = await query(
      `SELECT b.id_bitacora, b.tipo, b.descripcion, b.fecha, b.hora,
              b.tema, b.planeacion_siguiente_sesion, b.tareas_asignadas,
              TO_CHAR(s.fecha_sesion, 'DD/MM/YYYY') AS fecha_sesion_formateada
       FROM bitacora b
       INNER JOIN sesion s ON b.id_sesion = s.id_sesion
       WHERE s.id_asignacion = $1
       ORDER BY b.fecha DESC
       LIMIT 10`,
      [idAsignacion]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { createBitacora, getBitacorasByAsignacion };