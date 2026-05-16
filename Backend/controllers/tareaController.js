const { query } = require('../Database/index');

const createTarea = async (req, res) => {
  try {
    const { id_asignacion, titulo, descripcion, fecha_limite, archivo_apoyo } = req.body;
    if (!id_asignacion || !titulo) {
      return res.status(400).json({ message: 'id_asignacion y titulo son requeridos' });
    }
    const result = await query(
      `INSERT INTO tarea (id_asignacion, titulo, descripcion, fecha_asignacion, fecha_limite, archivo_apoyo, estatus)
       VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, 'pendiente') RETURNING *`,
      [id_asignacion, titulo, descripcion || null, fecha_limite || null, archivo_apoyo || null]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error en createTarea:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getTareasByTutor = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const result = await query(
      `SELECT t.*, b.id_beneficiario, u.nombre, u.apellido_paterno
       FROM tarea t
       INNER JOIN asignacion a ON t.id_asignacion = a.id_asignacion
       INNER JOIN beneficiario b ON a.id_beneficiario = b.id_beneficiario
       INNER JOIN usuario u ON b.id_usuario = u.id_usuario
       WHERE a.id_tutor = $1
       ORDER BY t.fecha_asignacion DESC, t.id_tarea DESC`,
      [tutorId]
    );
    return res.json(result.rows);
  } catch (error) {
    console.error('Error en getTareasByTutor:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getBeneficiariosByTutor = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const result = await query(
      `SELECT a.id_asignacion, b.id_beneficiario, u.nombre, u.apellido_paterno
       FROM asignacion a
       INNER JOIN beneficiario b ON a.id_beneficiario = b.id_beneficiario
       INNER JOIN usuario u ON b.id_usuario = u.id_usuario
       WHERE a.id_tutor = $1`,
      [tutorId]
    );
    return res.json(result.rows);
  } catch (error) {
    console.error('Error en getBeneficiariosByTutor:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getEntregasPendientes = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const result = await query(
      `SELECT e.*, t.titulo, u.nombre, u.apellido_paterno
       FROM entrega e
       INNER JOIN tarea t ON e.id_tarea = t.id_tarea
       INNER JOIN asignacion a ON t.id_asignacion = a.id_asignacion
       INNER JOIN beneficiario b ON a.id_beneficiario = b.id_beneficiario
       INNER JOIN usuario u ON b.id_usuario = u.id_usuario
       WHERE a.id_tutor = $1 AND (e.calificacion IS NULL OR e.calificacion = 0)
       ORDER BY e.fecha_entrega DESC`,
      [tutorId]
    );
    return res.json(result.rows);
  } catch (error) {
    console.error('Error en getEntregasPendientes:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const deleteTarea = async (req, res) => {
  try {
    const tareaId = Number(req.params.tareaId);

    if (!Number.isInteger(tareaId) || tareaId <= 0) {
      return res.status(400).json({ message: 'tareaId invalido' });
    }

    const result = await query(
      `DELETE FROM tarea
       WHERE id_tarea = $1
       RETURNING id_tarea`,
      [tareaId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    return res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error('Error en deleteTarea:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { createTarea, getTareasByTutor, getBeneficiariosByTutor, getEntregasPendientes, deleteTarea };
