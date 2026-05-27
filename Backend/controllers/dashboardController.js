const { query } = require('../Database/index');

const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

function timeToMinutes(timeValue) {
  if (typeof timeValue !== 'string' || !timeValue.includes(':')) return null;
  const [hoursStr, minutesStr] = timeValue.split(':');
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
}

function getNextDateForDay(targetDay) {
  const today = new Date();
  const currentDay = today.getDay();
  let diff = targetDay - currentDay;
  if (diff < 0) diff += 7;
  const next = new Date(today);
  next.setDate(today.getDate() + diff);
  return next.toISOString().split('T')[0];
}

async function getRealTutorId(providedId) {
  if (!providedId) return null;
  const res = await query('SELECT id_tutor FROM tutortec WHERE id_tutor = $1 OR id_usuario = $1 LIMIT 1', [providedId]);
  return res.rows.length > 0 ? res.rows[0].id_tutor : providedId;
}

const getTutorDashboardSummary = async (req, res) => {
  try {
    const rawId = Number(req.params.tutorId);
    if (!Number.isInteger(rawId) || rawId <= 0) return res.status(400).json({ message: 'tutorId invalido' });
    
    const tutorId = await getRealTutorId(rawId);

    const [pendingReviews, accumulatedHours] = await Promise.all([
      query(
        `SELECT COUNT(*)::int AS total
         FROM entrega e
         INNER JOIN tarea t ON e.id_tarea = t.id_tarea
         INNER JOIN asignacion a ON t.id_asignacion = a.id_asignacion
         WHERE a.id_tutor = $1 AND (e.calificacion IS NULL OR e.calificacion = 0)`,
        [tutorId]
      ),
      query(
        `SELECT COALESCE(SUM(s.horas_registradas), 0)::numeric(10,2) AS total_horas
         FROM sesion s
         INNER JOIN asignacion a ON s.id_asignacion = a.id_asignacion
         WHERE a.id_tutor = $1
           AND s.tema IS DISTINCT FROM 'Sesion programada'`,
        [tutorId]
      ),
    ]);

    return res.json({
      tareas_por_revisar: pendingReviews.rows[0]?.total || 0,
      horas_acumuladas: Number(accumulatedHours.rows[0]?.total_horas || 0),
    });
  } catch (error) {
    console.error('Error en getTutorDashboardSummary:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getTutorCalendar = async (req, res) => {
  try {
    const rawId = Number(req.params.tutorId);
    if (!Number.isInteger(rawId) || rawId <= 0) return res.status(400).json({ message: 'tutorId invalido' });
    
    const tutorId = await getRealTutorId(rawId);

    const result = await query(
      `SELECT 
         s.id_sesion,
         s.fecha_sesion,
         s.hora_inicio,
         s.hora_fin,
         u.nombre,
         u.apellido_paterno
       FROM sesion s
       INNER JOIN asignacion a ON s.id_asignacion = a.id_asignacion
       INNER JOIN beneficiario b ON a.id_beneficiario = b.id_beneficiario
       INNER JOIN usuario u ON b.id_usuario = u.id_usuario
       WHERE a.id_tutor = $1
         AND s.tema = 'Sesion programada'
       ORDER BY s.fecha_sesion ASC, s.hora_inicio ASC`,
      [tutorId]
    );

    const rows = result.rows.map((row) => {
      const date = new Date(row.fecha_sesion);
      const dayIndex = Number.isNaN(date.getTime()) ? null : date.getDay();
      return {
        id_sesion: row.id_sesion,
        alumno: `${row.nombre} ${row.apellido_paterno}`,
        dia: dayIndex === null ? 'N/A' : dayNames[dayIndex],
        fecha: row.fecha_sesion,
        hora_inicio: row.hora_inicio,
        hora_fin: row.hora_fin,
      };
    });

    return res.json(rows);
  } catch (error) {
    console.error('Error en getTutorCalendar:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const createCalendarSession = async (req, res) => {
  try {
    const rawId = Number(req.params.tutorId);
    const tutorId = await getRealTutorId(rawId);
    const { id_asignacion, dia_semana, hora_inicio, hora_fin } = req.body;

    const idAsignacion = Number(id_asignacion);
    const dayNumber = Number(dia_semana);

    if (!Number.isInteger(rawId) || rawId <= 0) return res.status(400).json({ message: 'tutorId invalido' });
    if (!Number.isInteger(idAsignacion) || idAsignacion <= 0) return res.status(400).json({ message: 'id_asignacion invalido' });
    if (!Number.isInteger(dayNumber) || dayNumber < 0 || dayNumber > 6) return res.status(400).json({ message: 'dia_semana invalido (0-6)' });
    if (!hora_inicio || !hora_fin) return res.status(400).json({ message: 'hora_inicio y hora_fin son requeridos' });

    const startMinutes = timeToMinutes(hora_inicio);
    const endMinutes = timeToMinutes(hora_fin);

    if (startMinutes === null || endMinutes === null) return res.status(400).json({ message: 'Formato de hora invalido. Usa HH:MM' });
    if (endMinutes <= startMinutes) return res.status(400).json({ message: 'La hora_fin debe ser mayor que hora_inicio' });

    const asignacionValidation = await query(
      'SELECT id_asignacion FROM asignacion WHERE id_asignacion = $1 AND id_tutor = $2',
      [idAsignacion, tutorId]
    );

    if (asignacionValidation.rows.length === 0) {
      return res.status(400).json({ message: 'La asignacion no pertenece a este tutor' });
    }

    const fechaSesion = getNextDateForDay(dayNumber);

    const insertResult = await query(
      `INSERT INTO sesion (id_asignacion, fecha_sesion, hora_inicio, hora_fin, tema, observaciones, asistencia, horas_registradas)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [idAsignacion, fechaSesion, hora_inicio, hora_fin, 'Sesion programada', null, null, 0]
    );

    return res.status(201).json(insertResult.rows[0]);
  } catch (error) {
    console.error('Error en createCalendarSession:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const deleteCalendarSession = async (req, res) => {
  try {
    const rawId = Number(req.params.tutorId);
    const tutorId = await getRealTutorId(rawId);
    const sessionId = Number(req.params.sessionId);

    if (!Number.isInteger(rawId) || rawId <= 0) return res.status(400).json({ message: 'tutorId invalido' });
    if (!Number.isInteger(sessionId) || sessionId <= 0) return res.status(400).json({ message: 'sessionId invalido' });

    const result = await query(
      `DELETE FROM sesion s
       USING asignacion a
       WHERE s.id_sesion = $1
         AND s.id_asignacion = a.id_asignacion
         AND a.id_tutor = $2
         AND s.tema = 'Sesion programada'
       RETURNING s.id_sesion`,
      [sessionId, tutorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Sesion no encontrada' });
    }

    return res.json({ message: 'Sesion eliminada correctamente' });
  } catch (error) {
    console.error('Error en deleteCalendarSession:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getTutorHours = async (req, res) => {
  try {
    const rawId = Number(req.params.tutorId);
    if (!Number.isInteger(rawId) || rawId <= 0) return res.status(400).json({ message: 'tutorId invalido' });
    
    const tutorId = await getRealTutorId(rawId);

    const [totalsResult, sessionsResult] = await Promise.all([
      query(
        `SELECT
           COALESCE(SUM(s.horas_registradas), 0)::numeric(10,2) AS horas_registradas,
           COALESCE(MAX(t.horas_acumuladas), 0)::numeric(10,2) AS horas_validadas
         FROM tutortec t
         LEFT JOIN asignacion a ON a.id_tutor = t.id_tutor
         LEFT JOIN sesion s ON s.id_asignacion = a.id_asignacion
         WHERE t.id_tutor = $1
           AND s.tema IS DISTINCT FROM 'Sesion programada'`,
        [tutorId]
      ),
      query(
        `SELECT
           s.id_sesion,
           s.fecha_sesion,
           s.hora_inicio,
           s.hora_fin,
           s.horas_registradas,
           u.nombre,
           u.apellido_paterno
         FROM sesion s
         INNER JOIN asignacion a ON s.id_asignacion = a.id_asignacion
         INNER JOIN beneficiario b ON a.id_beneficiario = b.id_beneficiario
         INNER JOIN usuario u ON b.id_usuario = u.id_usuario
         WHERE a.id_tutor = $1
           AND s.tema IS DISTINCT FROM 'Sesion programada'
         ORDER BY s.fecha_sesion DESC, s.hora_inicio DESC
         LIMIT 50`,
        [tutorId]
      ),
    ]);

    const horasRegistradas = Number(totalsResult.rows[0]?.horas_registradas || 0);
    const horasValidadas = Number(totalsResult.rows[0]?.horas_validadas || 0);
    const pendientes = Math.max(0, horasRegistradas - horasValidadas);

    const sesiones = sessionsResult.rows.map((row) => ({
      id_sesion: row.id_sesion,
      fecha_sesion: row.fecha_sesion,
      alumno: `${row.nombre} ${row.apellido_paterno}`,
      horario: `${String(row.hora_inicio || '').slice(0, 5)} - ${String(row.hora_fin || '').slice(0, 5)}`,
      horas_registradas: Number(row.horas_registradas || 0),
    }));

    return res.json({
      horas_registradas: horasRegistradas,
      horas_validadas: horasValidadas,
      pendientes,
      sesiones,
    });
  } catch (error) {
    console.error('Error en getTutorHours:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getTutorDashboardSummary,
  getTutorCalendar,
  createCalendarSession,
  deleteCalendarSession,
  getTutorHours,
};