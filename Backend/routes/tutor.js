const express = require("express");
const { query } = require("../Database/index");

const router = express.Router();

router.get("/dashboard/:idTutor", async (req, res) => {
  try {
    const idTutor = Number(req.params.idTutor);

    if (!idTutor) {
      return res.status(400).json({ message: "ID de tutor inválido." });
    }

    const [studentsResult, materialsResult, trackingResult, hoursResult] =
      await Promise.all([
        query(
          `
          SELECT COUNT(DISTINCT a.id_beneficiario) AS total
          FROM asignacion a
          WHERE a.id_tutor = $1
          `,
          [idTutor]
        ),
        query(
          `
          SELECT COUNT(*) AS total
          FROM material
          `
        ),
        query(
          `
          SELECT COUNT(*) AS total
          FROM seguimiento_tutor
          WHERE id_tutor = $1
          `,
          [idTutor]
        ),
        query(
          `
          SELECT
            COALESCE(SUM(horas), 0) AS total_horas,
            COALESCE(SUM(sesiones), 0) AS total_sesiones
          FROM horas_evidencias
          WHERE id_tutor = $1
          `,
          [idTutor]
        ),
      ]);

    res.json({
      alumnos_asignados: Number(studentsResult.rows[0]?.total || 0),
      materiales_disponibles: Number(materialsResult.rows[0]?.total || 0),
      observaciones: Number(trackingResult.rows[0]?.total || 0),
      horas_acumuladas: Number(hoursResult.rows[0]?.total_horas || 0),
      sesiones_registradas: Number(hoursResult.rows[0]?.total_sesiones || 0),
    });
  } catch (error) {
    console.error("Error al consultar dashboard del tutor:", error);
    res.status(500).json({ message: "Error al consultar dashboard del tutor." });
  }
});

router.get("/students/:idTutor", async (req, res) => {
  try {
    const idTutor = Number(req.params.idTutor);

    if (!idTutor) {
      return res.status(400).json({ message: "ID de tutor inválido." });
    }

    const result = await query(
      `
      SELECT DISTINCT ON (b.id_beneficiario)
        b.id_beneficiario,
        a.id_asignacion,
        CONCAT(u.nombre, ' ', u.apellido_paterno) AS nombre,
        b.nivel,
        b.idioma,
        b.matricula_folio,
        u.estatus,
        a.idioma AS idioma_asignacion,
        a.periodo,
        a.fecha_inicio,
        a.fecha_fin,
        a.estatus AS estado_asignacion
      FROM asignacion a
      INNER JOIN beneficiario b
        ON b.id_beneficiario = a.id_beneficiario
      INNER JOIN usuario u
        ON u.id_usuario = b.id_usuario
      WHERE a.id_tutor = $1
      ORDER BY b.id_beneficiario, a.id_asignacion DESC
      `,
      [idTutor]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al consultar alumnos del tutor:", error);
    res.status(500).json({ message: "Error al consultar alumnos del tutor." });
  }
});

router.get("/student/:idTutor/:idBeneficiario", async (req, res) => {
  try {
    const idTutor = Number(req.params.idTutor);
    const idBeneficiario = Number(req.params.idBeneficiario);

    if (!idTutor || !idBeneficiario) {
      return res.status(400).json({ message: "Parámetros inválidos." });
    }

    const result = await query(
      `
      SELECT
        b.id_beneficiario,
        CONCAT(u.nombre, ' ', u.apellido_paterno, COALESCE(' ' || u.apellido_materno, '')) AS nombre,
        u.correo,
        u.estatus,
        b.nivel,
        b.idioma,
        b.matricula_folio,
        a.id_asignacion,
        a.periodo,
        a.fecha_inicio,
        a.fecha_fin,
        a.idioma AS idioma_asignacion,
        a.estatus AS estado_asignacion
      FROM asignacion a
      INNER JOIN beneficiario b
        ON b.id_beneficiario = a.id_beneficiario
      INNER JOIN usuario u
        ON u.id_usuario = b.id_usuario
      WHERE a.id_tutor = $1
        AND b.id_beneficiario = $2
      ORDER BY a.id_asignacion DESC
      LIMIT 1
      `,
      [idTutor, idBeneficiario]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Alumno no encontrado para este tutor." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al consultar ficha del alumno:", error);
    res.status(500).json({ message: "Error al consultar ficha del alumno." });
  }
});

router.get("/materials/:idTutor", async (req, res) => {
  try {
    const idTutor = Number(req.params.idTutor);

    if (!idTutor) {
      return res.status(400).json({ message: "ID de tutor inválido." });
    }

    const result = await query(
      `
      SELECT
        id_material,
        titulo,
        tema,
        nivel,
        descripcion,
        COALESCE(nombre_archivo_original, archivo_nombre) AS archivo_nombre,
        COALESCE(ruta_archivo, archivo_url) AS archivo_url,
        COALESCE(fecha_registro, fecha_subida) AS fecha_publicacion
      FROM material
      ORDER BY COALESCE(fecha_registro, fecha_subida) DESC, id_material DESC
      `
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al consultar materiales para tutor:", error);
    res.status(500).json({ message: "Error al consultar materiales." });
  }
});

router.get("/tracking/:idTutor", async (req, res) => {
  try {
    const idTutor = Number(req.params.idTutor);

    if (!idTutor) {
      return res.status(400).json({ message: "ID de tutor inválido." });
    }

    const result = await query(
      `
      SELECT
        id_seguimiento,
        id_tutor,
        observacion,
        fecha_registro,
        estatus
      FROM seguimiento_tutor
      WHERE id_tutor = $1
      ORDER BY fecha_registro DESC, id_seguimiento DESC
      `,
      [idTutor]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al consultar seguimiento del tutor:", error);
    res.status(500).json({ message: "Error al consultar seguimiento." });
  }
});

router.get("/hours-evidence/:idTutor", async (req, res) => {
  try {
    const idTutor = Number(req.params.idTutor);

    if (!idTutor) {
      return res.status(400).json({ message: "ID de tutor inválido." });
    }

    const result = await query(
      `
      SELECT
        he.id_registro,
        he.id_tutor,
        he.horas,
        he.sesiones,
        he.estado,
        he.fecha_registro,
        CONCAT(u.nombre, ' ', u.apellido_paterno) AS tutor
      FROM horas_evidencias he
      INNER JOIN tutortec tt
        ON tt.id_tutor = he.id_tutor
      INNER JOIN usuario u
        ON u.id_usuario = tt.id_usuario
      WHERE he.id_tutor = $1
      ORDER BY he.id_registro DESC
      `,
      [idTutor]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al consultar horas y evidencias del tutor:", error);
    res.status(500).json({ message: "Error al consultar horas y evidencias." });
  }
});

module.exports = router;