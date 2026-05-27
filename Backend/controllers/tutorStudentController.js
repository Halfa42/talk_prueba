const { query } = require('../Database/index');

const getTutorStudents = async (req, res) => {
  try {
    const providedId = Number(req.query.tutorId);

    if (!providedId || isNaN(providedId)) {
      return res.json([]); 
    }

    const result = await query(
      `
      SELECT 
        b.id_beneficiario, a.id_asignacion, u.nombre, u.apellido_paterno, u.apellido_materno, u.correo, b.nivel, b.idioma, b.matricula_folio, a.estatus
      FROM asignacion a
      INNER JOIN beneficiario b 
        ON a.id_beneficiario = b.id_beneficiario
      INNER JOIN usuario u 
        ON b.id_usuario = u.id_usuario
      WHERE a.id_tutor = $1 
         OR a.id_tutor = (SELECT id_tutor FROM tutortec WHERE id_usuario = $1 LIMIT 1)
      `,
      [providedId]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTutorStudents
};