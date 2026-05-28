const { query } = require('../Database/index');
const path = require('path');
const fs = require('fs');

const createTarea = async (req, res) => {
  try {
    const { id_asignacion, titulo, descripcion, fecha_limite } = req.body;
    let archivo_apoyo = req.body.archivo_apoyo || null;

    if (req.file) {
      archivo_apoyo = `/uploads/tareas/${req.file.filename}`;
    }

    if (!id_asignacion || !titulo) {
      return res.status(400).json({ message: 'id_asignacion y titulo son requeridos' });
    }
    const result = await query(
      `INSERT INTO tarea (id_asignacion, titulo, descripcion, fecha_asignacion, fecha_limite, archivo_apoyo, estatus)
       VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, 'pendiente') RETURNING *`,
      [id_asignacion, titulo, descripcion || null, fecha_limite || null, archivo_apoyo]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getTareasByTutor = async (req, res) => {
  try {
    const tutorId = Number(req.params.tutorId);
    const result = await query(
      `SELECT t.*, b.id_beneficiario, u.nombre, u.apellido_paterno
       FROM tarea t
       INNER JOIN asignacion a ON t.id_asignacion = a.id_asignacion
       INNER JOIN beneficiario b ON a.id_beneficiario = b.id_beneficiario
       INNER JOIN usuario u ON b.id_usuario = u.id_usuario
       WHERE a.id_tutor = $1 OR a.id_tutor = (SELECT id_tutor FROM tutortec WHERE id_usuario = $1 LIMIT 1)
       ORDER BY t.fecha_asignacion DESC, t.id_tarea DESC`,
      [tutorId]
    );
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getBeneficiariosByTutor = async (req, res) => {
  try {
    const tutorId = Number(req.params.tutorId);
    const result = await query(
      `SELECT a.id_asignacion, b.id_beneficiario, u.nombre, u.apellido_paterno
       FROM asignacion a
       INNER JOIN beneficiario b ON a.id_beneficiario = b.id_beneficiario
       INNER JOIN usuario u ON b.id_usuario = u.id_usuario
       WHERE a.id_tutor = $1 OR a.id_tutor = (SELECT id_tutor FROM tutortec WHERE id_usuario = $1 LIMIT 1)`,
      [tutorId]
    );
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getEntregasPendientes = async (req, res) => {
  try {
    const tutorId = Number(req.params.tutorId);
    const result = await query(
      `SELECT e.*, t.titulo, u.nombre, u.apellido_paterno
       FROM entrega e
       INNER JOIN tarea t ON e.id_tarea = t.id_tarea
       INNER JOIN asignacion a ON t.id_asignacion = a.id_asignacion
       INNER JOIN beneficiario b ON a.id_beneficiario = b.id_beneficiario
       INNER JOIN usuario u ON b.id_usuario = u.id_usuario
       WHERE (a.id_tutor = $1 OR a.id_tutor = (SELECT id_tutor FROM tutortec WHERE id_usuario = $1 LIMIT 1)) 
       AND (e.calificacion IS NULL OR e.calificacion = 0)
       ORDER BY e.fecha_entrega DESC`,
      [tutorId]
    );
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
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
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getTareasByBeneficiario = async (req, res) => {
  try {
    const usuarioId = Number(req.params.usuarioId);
    const result = await query(
      `SELECT t.*
       FROM tarea t
       INNER JOIN asignacion a ON t.id_asignacion = a.id_asignacion
       INNER JOIN beneficiario b ON a.id_beneficiario = b.id_beneficiario
       WHERE b.id_usuario = $1
       ORDER BY t.fecha_limite ASC`,
      [usuarioId]
    );
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const submitEntrega = async (req, res) => {
  try {
    const { id_tarea, comentario_entrega } = req.body;
    let archivo_entregado = req.body.archivo_entregado || null;

    if (req.file) {
      archivo_entregado = `/uploads/tareas/${req.file.filename}`;
    }
    
    if (!id_tarea || !archivo_entregado) {
      return res.status(400).json({ message: 'Seleccionar una tarea y adjuntar un archivo es obligatorio' });
    }

    const result = await query(
      `INSERT INTO entrega (id_tarea, fecha_entrega, archivo_entregado, comentario_entrega)
       VALUES ($1, CURRENT_TIMESTAMP, $2, $3) RETURNING *`,
      [id_tarea, archivo_entregado, comentario_entrega || '']
    );

    await query(`UPDATE tarea SET estatus = 'entregada' WHERE id_tarea = $1`, [id_tarea]);

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al subir la entrega' });
  }
};

const downloadArchivoApoyo = async (req, res) => {
  try {
    const tareaId = Number(req.params.tareaId);
    
    const result = await query(
      'SELECT archivo_apoyo FROM tarea WHERE id_tarea = $1', 
      [tareaId]
    );

    if (result.rows.length === 0 || !result.rows[0].archivo_apoyo) {
      return res.status(404).json({ message: 'Archivo de apoyo no encontrado' });
    }

    const archivoRuta = result.rows[0].archivo_apoyo;
    const normalizedPath = archivoRuta.startsWith('/') ? archivoRuta.slice(1) : archivoRuta;
    const filePath = path.join(__dirname, '..', normalizedPath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'El archivo fisico no existe en el servidor' });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    let mimeType = 'application/octet-stream';
    if (fileName.endsWith('.pdf')) mimeType = 'application/pdf';
    else if (fileName.endsWith('.png')) mimeType = 'image/png';
    else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) mimeType = 'image/jpeg';
    else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) mimeType = 'application/msword';

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);

    return res.send(fileBuffer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor al descargar' });
  }
};

module.exports = { 
  createTarea, 
  getTareasByTutor, 
  getBeneficiariosByTutor, 
  getEntregasPendientes, 
  deleteTarea, 
  getTareasByBeneficiario, 
  submitEntrega,
  downloadArchivoApoyo
};