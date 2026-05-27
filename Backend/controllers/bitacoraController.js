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
    } = req.body;

    const idAsignacion = Number(id_asignacion);

    if (!Number.isInteger(idAsignacion) || idAsignacion <= 0 || !descripcion) {
      return res.status(400).json({
        message: "id_asignacion y descripcion son requeridos",
      });
    }

    // Link to the most recent session for this asignacion
    const sesionResult = await query(
      `SELECT id_sesion FROM sesion
       WHERE id_asignacion = $1
       ORDER BY fecha_sesion DESC, hora_inicio DESC
       LIMIT 1`,
      [idAsignacion],
    );

    if (sesionResult.rows.length === 0) {
      return res.status(400).json({
        message:
          "No hay sesiones registradas para esta asignación. Registra una sesión primero.",
      });
    }

    const id_sesion = sesionResult.rows[0].id_sesion;

    // Handle uploaded images (multer puts them in req.files)
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
        descripcion,
        fecha || new Date(),
        hora || null,
        tema || null,
        planeacion_siguiente_sesion || null,
        tareas_asignadas || null,
        imagenRecordatorio ? imagenRecordatorio.buffer : null,
        imagenRecordatorio ? imagenRecordatorio.mimetype : null,
        imagenSesion ? imagenSesion.buffer : null,
        imagenSesion ? imagenSesion.mimetype : null,
        imagenIncidencia ? imagenIncidencia.buffer : null, // ← new
        imagenIncidencia ? imagenIncidencia.mimetype : null, // ← new
      ],
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error en createBitacora:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getBitacorasByAsignacion = async (req, res) => {
  try {
    const { idAsignacion } = req.params;

    const result = await query(
      `SELECT b.id_bitacora, b.tipo, b.descripcion, b.fecha, b.hora,
              b.tema, b.planeacion_siguiente_sesion, b.tareas_asignadas
       FROM bitacora b
       INNER JOIN sesion s ON b.id_sesion = s.id_sesion
       WHERE s.id_asignacion = $1
       ORDER BY b.fecha DESC
       LIMIT 10`,
      [idAsignacion],
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error en getBitacorasByAsignacion:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getPendingBitacoras = async (req, res) => {
  try {
    const result = await query(
      `SELECT b.id_bitacora,
              b.tipo,
              b.descripcion,
              b.fecha,
              b.hora,
              b.tema,
              b.planeacion_siguiente_sesion,
              b.tareas_asignadas,
              b.revisado,
              a.id_asignacion,
              CONCAT(ub.nombre, ' ', ub.apellido_paterno) AS beneficiario,
              CONCAT(ut.nombre, ' ', ut.apellido_paterno) AS tutor
       FROM bitacora b
       INNER JOIN sesion s ON b.id_sesion = s.id_sesion
       INNER JOIN asignacion a ON s.id_asignacion = a.id_asignacion
       INNER JOIN beneficiario bn ON a.id_beneficiario = bn.id_beneficiario
       INNER JOIN usuario ub ON bn.id_usuario = ub.id_usuario
       INNER JOIN tutortec tt ON a.id_tutor = tt.id_tutor
       INNER JOIN usuario ut ON tt.id_usuario = ut.id_usuario
       WHERE b.revisado = FALSE
       ORDER BY b.fecha DESC`,
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error en getPendingBitacoras:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getBitacoraById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "ID de bitácora inválido" });
    }

    const result = await query(
      `SELECT b.id_bitacora,
              b.tipo,
              b.descripcion,
              b.fecha,
              b.hora,
              b.tema,
              b.planeacion_siguiente_sesion,
              b.tareas_asignadas,
              b.revisado,
              b.comentario_revisor,
              encode(b.imagen_recordatorio, 'base64') AS imagen_recordatorio_base64,
              b.imagen_recordatorio_tipo,
              encode(b.imagen_sesion, 'base64') AS imagen_sesion_base64,
              b.imagen_sesion_tipo,
              encode(b.imagen_incidencia, 'base64') AS imagen_incidencia_base64,
              b.imagen_incidencia_tipo,
              a.id_asignacion,
              s.id_sesion,
              s.fecha_sesion,
              s.hora_inicio,
              s.hora_fin,
              s.asistencia,
              s.horas_registradas,
              s.observaciones,
              s.aprobado_padre_madre,
              CONCAT(ub.nombre, ' ', ub.apellido_paterno) AS beneficiario,
              CONCAT(ut.nombre, ' ', ut.apellido_paterno) AS tutor,
              bn.matricula_folio,
              bn.nivel,
              bn.idioma AS idioma_beneficiario
       FROM bitacora b
       INNER JOIN sesion s ON b.id_sesion = s.id_sesion
       INNER JOIN asignacion a ON s.id_asignacion = a.id_asignacion
       INNER JOIN beneficiario bn ON a.id_beneficiario = bn.id_beneficiario
       INNER JOIN usuario ub ON bn.id_usuario = ub.id_usuario
       INNER JOIN tutortec tt ON a.id_tutor = tt.id_tutor
       INNER JOIN usuario ut ON tt.id_usuario = ut.id_usuario
       WHERE b.id_bitacora = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Bitácora no encontrada" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error en getBitacoraById:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const markBitacoraReviewed = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "ID de bitácora inválido" });
    }

    const result = await query(
      `UPDATE bitacora
       SET revisado = TRUE
            , comentario_revisor = $2
       WHERE id_bitacora = $1
        RETURNING id_bitacora, revisado, comentario_revisor`,
        [id, req.body.comentario_revisor || null],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Bitácora no encontrada" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error en markBitacoraReviewed:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const rejectBitacora = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "ID de bitácora inválido" });
    }

    const result = await query(
      `UPDATE bitacora
       SET revisado = TRUE,
           comentario_revisor = $2
       WHERE id_bitacora = $1
        RETURNING id_bitacora, revisado, comentario_revisor`,
      [id, req.body.comentario_revisor || "Rechazada por el revisor"],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Bitácora no encontrada" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error en rejectBitacora:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const deleteBitacora = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "ID de bitácora inválido" });
    }

    const result = await query(
      `DELETE FROM bitacora
       WHERE id_bitacora = $1
       RETURNING id_bitacora`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Bitácora no encontrada" });
    }

    return res.json({ message: "Bitácora eliminada correctamente" });
  } catch (error) {
    console.error("Error en deleteBitacora:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { createBitacora, getBitacorasByAsignacion, getPendingBitacoras, getBitacoraById, markBitacoraReviewed, rejectBitacora, deleteBitacora };
