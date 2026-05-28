const { query } = require('../Database/index');

const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

async function getRealBeneficiarioId(providedId) {
  if (!providedId) return null;
  const res = await query('SELECT id_beneficiario FROM beneficiario WHERE id_beneficiario = $1 OR id_usuario = $1 LIMIT 1', [providedId]);
  return res.rows.length > 0 ? res.rows[0].id_beneficiario : providedId;
}

const getStudentSummary = async (req, res) => {
  try {
    const rawId = Number(req.params.studentId);
    if (!Number.isInteger(rawId) || rawId <= 0) return res.status(400).json({ message: 'studentId inválido' });
    
    const beneficiarioId = await getRealBeneficiarioId(rawId);

    const [kpiNivel, kpiAsistencia] = await Promise.all([
      query(`SELECT nivel FROM beneficiario WHERE id_beneficiario = $1`, [beneficiarioId]),
      query(`
        SELECT 
           COUNT(s.id_sesion)::int AS total_sesiones,
           COUNT(CASE WHEN LOWER(s.asistencia) = 'asistio' THEN 1 END)::int AS asistidas
        FROM sesion s
        INNER JOIN asignacion a ON s.id_asignacion = a.id_asignacion
        WHERE a.id_beneficiario = $1 
          AND s.asistencia IS NOT NULL 
          AND s.asistencia != ''
      `, [beneficiarioId])
    ]);

    const total = kpiAsistencia.rows[0]?.total_sesiones || 0;
    const asistidas = kpiAsistencia.rows[0]?.asistidas || 0;
    const porcentajeAsistencia = total > 0 ? Math.round((asistidas / total) * 100) : 100;

    return res.json({
      nivel: kpiNivel.rows[0]?.nivel || 'N/A',
      asistencia: porcentajeAsistencia
    });
  } catch (error) {
    console.error('Error en getStudentSummary:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getPendingTasks = async (req, res) => {
  try {
    const rawId = Number(req.params.studentId);
    const beneficiarioId = await getRealBeneficiarioId(rawId);

    const result = await query(
      `SELECT t.id_tarea, t.titulo, t.fecha_limite
       FROM tarea t
       INNER JOIN asignacion a ON t.id_asignacion = a.id_asignacion
       LEFT JOIN entrega e ON t.id_tarea = e.id_tarea
       WHERE a.id_beneficiario = $1 AND e.id_entrega IS NULL
       ORDER BY t.fecha_limite ASC`,
      [beneficiarioId]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error('Error en getPendingTasks:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getUpcomingSessions = async (req, res) => {
  try {
    const rawId = Number(req.params.studentId);
    const beneficiarioId = await getRealBeneficiarioId(rawId);

    const result = await query(
      `SELECT 
         s.id_sesion,
         s.fecha_sesion,
         s.hora_inicio,
         s.hora_fin,
         u.nombre AS tutor_nombre,
         u.apellido_paterno AS tutor_apellido,
         zl.zoom_link
       FROM sesion s
       INNER JOIN asignacion a ON s.id_asignacion = a.id_asignacion
       INNER JOIN tutortec t ON a.id_tutor = t.id_tutor
       INNER JOIN usuario u ON t.id_usuario = u.id_usuario
       LEFT JOIN tutor_zoom_link zl ON (zl.id_tutor = a.id_tutor OR zl.id_tutor = t.id_usuario)
       WHERE a.id_beneficiario = $1
         AND (s.tema = 'Sesion programada' OR s.fecha_sesion >= CURRENT_DATE)
       ORDER BY s.fecha_sesion ASC, s.hora_inicio ASC`,
      [beneficiarioId]
    );

    const rows = result.rows.map((row) => {
      const date = new Date(row.fecha_sesion);
      const dayIndex = Number.isNaN(date.getTime()) ? null : new Date(date.getTime() + Math.abs(date.getTimezoneOffset() * 60000)).getDay();
      
      return {
        id_sesion: row.id_sesion,
        tutor: `${row.tutor_nombre} ${row.tutor_apellido}`,
        dia: dayIndex === null ? 'N/A' : dayNames[dayIndex],
        hora_inicio: row.hora_inicio,
        hora_fin: row.hora_fin,
        zoom_link: row.zoom_link || null
      };
    });

    return res.json(rows);
  } catch (error) {
    console.error('Error en getUpcomingSessions:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getStudentMaterials = async (req, res) => {
  try {
    const rawId = Number(req.params.studentId);
    const benRes = await query('SELECT nivel FROM beneficiario WHERE id_beneficiario = $1 OR id_usuario = $1 LIMIT 1', [rawId]);
    
    if (benRes.rows.length === 0) return res.json([]);
    
    const studentLevel = benRes.rows[0].nivel || 'A1';

    const result = await query(
      `SELECT id_material, titulo, tema, nivel, descripcion, archivo_nombre, archivo_url, fecha_subida
       FROM material
       ORDER BY fecha_subida DESC`
    );

    const levelRank = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6 };
    const sRank = levelRank[studentLevel.toUpperCase()] || 1;

    const filteredMaterials = result.rows.filter((m) => {
      const mLevel = m.nivel ? m.nivel.toUpperCase() : 'A1';
      const mRank = levelRank[mLevel] || 1;
      return mRank <= sRank;
    });

    return res.json(filteredMaterials);
  } catch (error) {
    console.error('Error en getStudentMaterials:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getStudentSummary,
  getPendingTasks,
  getUpcomingSessions,
  getStudentMaterials
};