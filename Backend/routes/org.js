const express = require("express");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { pool, query } = require("../Database/index");

const router = express.Router();

function clean(value) {
  return String(value || "").trim();
}

function normalizeStatus(value) {
  const v = clean(value).toLowerCase();
  if (v === "activa" || v === "activo") return "activo";
  return "no activo";
}

function normalizeCourseLanguage(value) {
  const v = clean(value).toLowerCase();
  if (v === "ingles") return "ingles";
  if (v === "frances") return "frances";
  return "";
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function toCsv(headers, rows) {
  const headerLine = headers.map(csvEscape).join(",");
  const bodyLines = rows.map((row) => row.map(csvEscape).join(","));
  return "\uFEFF" + [headerLine, ...bodyLines].join("\n");
}

function sendCsv(res, filename, headers, rows) {
  const csv = toCsv(headers, rows);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(csv);
}

const uploadsDir = path.join(__dirname, "..", "uploads", "materiales");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    cb(null, `material-${unique}${extension}`);
  },
});

const upload = multer({ storage });

router.get("/beneficiarios", async (req, res) => {
  try {
    const result = await query(
      `
      SELECT
        b.id_beneficiario,
        u.id_usuario,
        u.nombre,
        u.apellido_paterno,
        u.apellido_materno,
        u.correo,
        u.estatus,
        b.nivel,
        b.matricula_folio,
        b.idioma,
        ultima_asignacion.id_asignacion,
        ultima_asignacion.id_tutor,
        ultima_asignacion.periodo,
        ultima_asignacion.fecha_inicio,
        ultima_asignacion.fecha_fin,
        ultima_asignacion.idioma AS idioma_asignacion,
        COALESCE(
          CONCAT(ut.nombre, ' ', ut.apellido_paterno),
          'Sin asignar'
        ) AS tutor
      FROM beneficiario b
      INNER JOIN usuario u
        ON u.id_usuario = b.id_usuario
      LEFT JOIN LATERAL (
        SELECT
          a.id_asignacion,
          a.id_tutor,
          a.periodo,
          a.fecha_inicio,
          a.fecha_fin,
          a.idioma
        FROM asignacion a
        WHERE a.id_beneficiario = b.id_beneficiario
        ORDER BY a.id_asignacion DESC
        LIMIT 1
      ) ultima_asignacion
        ON TRUE
      LEFT JOIN tutortec tt
        ON tt.id_tutor = ultima_asignacion.id_tutor
      LEFT JOIN usuario ut
        ON ut.id_usuario = tt.id_usuario
      WHERE u.rol = 'beneficiario'
      ORDER BY u.nombre ASC, u.apellido_paterno ASC
      `
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al consultar beneficiarios:", error);
    res.status(500).json({ message: "Error al consultar beneficiarios." });
  }
});

router.get("/beneficiarios-simple", async (req, res) => {
  try {
    const result = await query(
      `
      SELECT
        b.id_beneficiario,
        CONCAT(u.nombre, ' ', u.apellido_paterno) AS nombre
      FROM beneficiario b
      INNER JOIN usuario u
        ON u.id_usuario = b.id_usuario
      WHERE u.rol = 'beneficiario'
      ORDER BY u.nombre ASC, u.apellido_paterno ASC
      `
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al consultar lista simple de beneficiarios:", error);
    res.status(500).json({ message: "Error al consultar beneficiarios." });
  }
});

router.get("/tutores", async (req, res) => {
  try {
    const result = await query(
      `
      SELECT
        tt.id_tutor,
        u.id_usuario,
        u.nombre,
        u.apellido_paterno,
        u.apellido_materno,
        u.correo,
        u.estatus,
        tt.idioma,
        tt.periodo,
        tt.fecha_inicio,
        tt.fecha_fin,
        tt.horas_acumuladas,
        COUNT(a.id_asignacion) AS beneficiarios_asignados
      FROM tutortec tt
      INNER JOIN usuario u
        ON u.id_usuario = tt.id_usuario
      LEFT JOIN asignacion a
        ON a.id_tutor = tt.id_tutor
      WHERE u.rol = 'tutor'
      GROUP BY
        tt.id_tutor,
        u.id_usuario,
        u.nombre,
        u.apellido_paterno,
        u.apellido_materno,
        u.correo,
        u.estatus,
        tt.idioma,
        tt.periodo,
        tt.fecha_inicio,
        tt.fecha_fin,
        tt.horas_acumuladas
      ORDER BY u.nombre ASC, u.apellido_paterno ASC
      `
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al consultar tutores:", error);
    res.status(500).json({ message: "Error al consultar tutores." });
  }
});

router.get("/tutores-simple", async (req, res) => {
  try {
    const result = await query(
      `
      SELECT
        tt.id_tutor,
        CONCAT(u.nombre, ' ', u.apellido_paterno) AS nombre
      FROM tutortec tt
      INNER JOIN usuario u
        ON u.id_usuario = tt.id_usuario
      WHERE u.rol = 'tutor'
      ORDER BY u.nombre ASC, u.apellido_paterno ASC
      `
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al consultar lista simple de tutores:", error);
    res.status(500).json({ message: "Error al consultar tutores." });
  }
});

router.get("/asignaciones", async (req, res) => {
  try {
    const result = await query(
      `
      SELECT
        a.id_asignacion,
        a.periodo,
        a.fecha_inicio,
        a.fecha_fin,
        a.estatus,
        a.idioma,
        b.id_beneficiario,
        tt.id_tutor,
        CONCAT(ub.nombre, ' ', ub.apellido_paterno) AS beneficiario,
        CONCAT(ut.nombre, ' ', ut.apellido_paterno) AS tutor,
        COALESCE(b.nivel, 'Sin nivel') AS nivel
      FROM asignacion a
      INNER JOIN beneficiario b
        ON b.id_beneficiario = a.id_beneficiario
      INNER JOIN usuario ub
        ON ub.id_usuario = b.id_usuario
      INNER JOIN tutortec tt
        ON tt.id_tutor = a.id_tutor
      INNER JOIN usuario ut
        ON ut.id_usuario = tt.id_usuario
      ORDER BY a.id_asignacion DESC
      `
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al consultar asignaciones:", error);
    res.status(500).json({ message: "Error al consultar asignaciones." });
  }
});

router.post("/asignaciones", async (req, res) => {
  try {
    const {
      tutorId,
      beneficiarioId,
      periodo,
      fecha_inicio,
      fecha_fin,
      estatus,
      idioma,
    } = req.body;

    const tutorIdNumero = Number(tutorId);
    const beneficiarioIdNumero = Number(beneficiarioId);
    const idiomaNormalizado = normalizeCourseLanguage(idioma);

    if (!tutorIdNumero || !beneficiarioIdNumero || !idiomaNormalizado) {
      return res.status(400).json({
        message: "Selecciona tutor, beneficiario e idioma.",
      });
    }

    await query(
      `
      INSERT INTO asignacion (
        id_tutor,
        id_beneficiario,
        periodo,
        fecha_inicio,
        fecha_fin,
        estatus,
        idioma
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        tutorIdNumero,
        beneficiarioIdNumero,
        clean(periodo) || "2026-A",
        fecha_inicio || null,
        fecha_fin || null,
        clean(estatus) || "Activa",
        idiomaNormalizado,
      ]
    );

    res.status(201).json({
      message: "Asignación creada correctamente.",
    });
  } catch (error) {
    console.error("Error al crear asignación:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        message:
          "Ese tutor ya tiene asignado a ese beneficiario para ese mismo idioma.",
      });
    }

    res.status(500).json({ message: "Error al crear asignación." });
  }
});

router.put("/asignaciones/:id", async (req, res) => {
  try {
    const idAsignacion = Number(req.params.id);
    const {
      tutorId,
      beneficiarioId,
      periodo,
      fecha_inicio,
      fecha_fin,
      estatus,
      idioma,
    } = req.body;

    const tutorIdNumero = Number(tutorId);
    const beneficiarioIdNumero = Number(beneficiarioId);
    const idiomaNormalizado = normalizeCourseLanguage(idioma);

    if (
      !idAsignacion ||
      !tutorIdNumero ||
      !beneficiarioIdNumero ||
      !idiomaNormalizado
    ) {
      return res.status(400).json({
        message: "Completa los datos obligatorios de la asignación.",
      });
    }

    const existente = await query(
      `SELECT id_asignacion FROM asignacion WHERE id_asignacion = $1 LIMIT 1`,
      [idAsignacion]
    );

    if (existente.rows.length === 0) {
      return res.status(404).json({ message: "Asignación no encontrada." });
    }

    await query(
      `
      UPDATE asignacion
      SET
        id_tutor = $1,
        id_beneficiario = $2,
        periodo = $3,
        fecha_inicio = $4,
        fecha_fin = $5,
        estatus = $6,
        idioma = $7
      WHERE id_asignacion = $8
      `,
      [
        tutorIdNumero,
        beneficiarioIdNumero,
        clean(periodo) || "2026-A",
        fecha_inicio || null,
        fecha_fin || null,
        clean(estatus) || "Activa",
        idiomaNormalizado,
        idAsignacion,
      ]
    );

    res.json({ message: "Asignación actualizada correctamente." });
  } catch (error) {
    console.error("Error al actualizar asignación:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        message:
          "Ese tutor ya tiene asignado a ese beneficiario para ese mismo idioma.",
      });
    }

    res.status(500).json({ message: "Error al actualizar asignación." });
  }
});

router.delete("/asignaciones/:id", async (req, res) => {
  try {
    const idAsignacion = Number(req.params.id);

    if (!idAsignacion) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const result = await query(
      `DELETE FROM asignacion WHERE id_asignacion = $1 RETURNING id_asignacion`,
      [idAsignacion]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Asignación no encontrada." });
    }

    res.json({ message: "Asignación eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar asignación:", error);
    res.status(500).json({ message: "Error al eliminar asignación." });
  }
});

router.get("/seguimiento", async (req, res) => {
  try {
    const result = await query(
      `
      SELECT
        st.id_seguimiento,
        st.id_tutor,
        st.observacion,
        st.fecha_registro,
        st.estatus,
        CONCAT(u.nombre, ' ', u.apellido_paterno) AS tutor
      FROM seguimiento_tutor st
      INNER JOIN tutortec tt
        ON tt.id_tutor = st.id_tutor
      INNER JOIN usuario u
        ON u.id_usuario = tt.id_usuario
      ORDER BY st.fecha_registro DESC, st.id_seguimiento DESC
      `
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al consultar seguimiento:", error);
    res.status(500).json({ message: "Error al consultar seguimiento." });
  }
});

router.post("/seguimiento", async (req, res) => {
  try {
    const { tutorId, observacion } = req.body;

    const tutorIdNumero = Number(tutorId);
    const observacionLimpia = clean(observacion);

    if (!tutorIdNumero || !observacionLimpia) {
      return res.status(400).json({
        message: "Selecciona un tutor y escribe una observación.",
      });
    }

    await query(
      `
      INSERT INTO seguimiento_tutor (
        id_tutor,
        observacion,
        estatus
      )
      VALUES ($1, $2, 'registrado')
      `,
      [tutorIdNumero, observacionLimpia]
    );

    res.status(201).json({
      message: "Observación guardada correctamente.",
    });
  } catch (error) {
    console.error("Error al guardar seguimiento:", error);
    res.status(500).json({ message: "Error al guardar seguimiento." });
  }
});

router.get("/horas-evidencias", async (req, res) => {
  try {
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
      ORDER BY he.id_registro DESC
      `
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al consultar horas y evidencias:", error);
    res.status(500).json({ message: "Error al consultar horas y evidencias." });
  }
});

router.post("/horas-evidencias", async (req, res) => {
  try {
    const { tutorId, horas, sesiones, estado } = req.body;

    const tutorIdNumero = Number(tutorId);
    const horasNumero = Number(horas);
    const sesionesNumero = Number(sesiones);

    if (!tutorIdNumero || Number.isNaN(horasNumero) || Number.isNaN(sesionesNumero)) {
      return res.status(400).json({
        message: "Completa los datos obligatorios del registro.",
      });
    }

    await query(
      `
      INSERT INTO horas_evidencias (
        id_tutor,
        horas,
        sesiones,
        estado
      )
      VALUES ($1, $2, $3, $4)
      `,
      [
        tutorIdNumero,
        horasNumero,
        sesionesNumero,
        clean(estado) || "Pendiente",
      ]
    );

    res.status(201).json({ message: "Registro creado correctamente." });
  } catch (error) {
    console.error("Error al crear registro de horas y evidencias:", error);
    res.status(500).json({ message: "Error al crear el registro." });
  }
});

router.put("/horas-evidencias/:id", async (req, res) => {
  try {
    const idRegistro = Number(req.params.id);
    const { tutorId, horas, sesiones, estado } = req.body;

    const tutorIdNumero = Number(tutorId);
    const horasNumero = Number(horas);
    const sesionesNumero = Number(sesiones);

    if (!idRegistro || !tutorIdNumero || Number.isNaN(horasNumero) || Number.isNaN(sesionesNumero)) {
      return res.status(400).json({
        message: "Completa los datos obligatorios del registro.",
      });
    }

    const existente = await query(
      `SELECT id_registro FROM horas_evidencias WHERE id_registro = $1 LIMIT 1`,
      [idRegistro]
    );

    if (existente.rows.length === 0) {
      return res.status(404).json({ message: "Registro no encontrado." });
    }

    await query(
      `
      UPDATE horas_evidencias
      SET
        id_tutor = $1,
        horas = $2,
        sesiones = $3,
        estado = $4
      WHERE id_registro = $5
      `,
      [
        tutorIdNumero,
        horasNumero,
        sesionesNumero,
        clean(estado) || "Pendiente",
        idRegistro,
      ]
    );

    res.json({ message: "Registro actualizado correctamente." });
  } catch (error) {
    console.error("Error al actualizar horas y evidencias:", error);
    res.status(500).json({ message: "Error al actualizar el registro." });
  }
});

router.delete("/horas-evidencias/:id", async (req, res) => {
  try {
    const idRegistro = Number(req.params.id);

    if (!idRegistro) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const result = await query(
      `DELETE FROM horas_evidencias WHERE id_registro = $1 RETURNING id_registro`,
      [idRegistro]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Registro no encontrado." });
    }

    res.json({ message: "Registro eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar horas y evidencias:", error);
    res.status(500).json({ message: "Error al eliminar el registro." });
  }
});

router.get("/materiales", async (req, res) => {
  try {
    const result = await query(
      `
      SELECT
        id_material,
        titulo,
        descripcion,
        nombre_archivo_original,
        nombre_archivo_guardado,
        ruta_archivo,
        mime_type,
        tamano_bytes,
        fecha_registro
      FROM material
      ORDER BY fecha_registro DESC, id_material DESC
      `
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al consultar materiales:", error);
    res.status(500).json({ message: "Error al consultar materiales." });
  }
});

router.post("/materiales", upload.single("archivo"), async (req, res) => {
  try {
    const titulo = clean(req.body.titulo);
    const descripcion = clean(req.body.descripcion);
    const archivo = req.file;

    if (!archivo) {
      return res.status(400).json({
        message: "Selecciona un archivo antes de guardar el material.",
      });
    }

    const rutaRelativa = `/uploads/materiales/${archivo.filename}`;

    const result = await query(
      `
      INSERT INTO material (
        titulo,
        descripcion,
        nombre_archivo_original,
        nombre_archivo_guardado,
        ruta_archivo,
        mime_type,
        tamano_bytes,
        archivo_nombre,
        archivo_tipo,
        archivo_tamano,
        archivo_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id_material
      `,
      [
        titulo || null,
        descripcion || null,
        archivo.originalname,
        archivo.filename,
        rutaRelativa,
        archivo.mimetype || null,
        archivo.size || null,
        archivo.originalname,
        archivo.mimetype || null,
        archivo.size || null,
        rutaRelativa,
      ]
    );

    res.status(201).json({
      message: "Material guardado correctamente.",
      id_material: result.rows[0].id_material,
    });
  } catch (error) {
    console.error("Error al guardar material:", error);
    res.status(500).json({ message: "Error al guardar material." });
  }
});

router.get("/reportes/beneficiarios", async (req, res) => {
  try {
    const result = await query(
      `
      SELECT
        b.id_beneficiario,
        u.nombre,
        u.apellido_paterno,
        u.apellido_materno,
        u.correo,
        u.estatus,
        b.nivel,
        b.matricula_folio,
        b.idioma,
        COALESCE(CONCAT(ut.nombre, ' ', ut.apellido_paterno), 'Sin asignar') AS tutor_asignado,
        COALESCE(a.periodo, 'Sin periodo') AS periodo,
        COALESCE(a.idioma, 'Sin idioma') AS idioma_asignacion,
        a.fecha_inicio,
        a.fecha_fin
      FROM beneficiario b
      INNER JOIN usuario u
        ON u.id_usuario = b.id_usuario
      LEFT JOIN LATERAL (
        SELECT *
        FROM asignacion a
        WHERE a.id_beneficiario = b.id_beneficiario
        ORDER BY a.id_asignacion DESC
        LIMIT 1
      ) a
        ON TRUE
      LEFT JOIN tutortec tt
        ON tt.id_tutor = a.id_tutor
      LEFT JOIN usuario ut
        ON ut.id_usuario = tt.id_usuario
      ORDER BY u.nombre ASC, u.apellido_paterno ASC
      `
    );

    const headers = [
      "ID Beneficiario",
      "Nombre",
      "Apellido paterno",
      "Apellido materno",
      "Correo",
      "Estado",
      "Nivel",
      "Matricula/Folio",
      "Idioma perfil",
      "Tutor asignado",
      "Periodo",
      "Idioma asignacion",
      "Fecha inicio",
      "Fecha fin",
    ];

    const rows = result.rows.map((row) => [
      row.id_beneficiario,
      row.nombre,
      row.apellido_paterno,
      row.apellido_materno || "",
      row.correo,
      row.estatus,
      row.nivel || "",
      row.matricula_folio || "",
      row.idioma || "",
      row.tutor_asignado,
      row.periodo,
      row.idioma_asignacion,
      row.fecha_inicio ? String(row.fecha_inicio).slice(0, 10) : "",
      row.fecha_fin ? String(row.fecha_fin).slice(0, 10) : "",
    ]);

    sendCsv(res, "reporte_beneficiarios.csv", headers, rows);
  } catch (error) {
    console.error("Error al generar reporte de beneficiarios:", error);
    res.status(500).json({ message: "Error al generar reporte de beneficiarios." });
  }
});

router.get("/reportes/tutores", async (req, res) => {
  try {
    const result = await query(
      `
      SELECT
        tt.id_tutor,
        u.nombre,
        u.apellido_paterno,
        u.apellido_materno,
        u.correo,
        u.estatus,
        tt.idioma,
        tt.horas_acumuladas,
        COUNT(a.id_asignacion) AS beneficiarios_asignados
      FROM tutortec tt
      INNER JOIN usuario u
        ON u.id_usuario = tt.id_usuario
      LEFT JOIN asignacion a
        ON a.id_tutor = tt.id_tutor
      GROUP BY
        tt.id_tutor,
        u.nombre,
        u.apellido_paterno,
        u.apellido_materno,
        u.correo,
        u.estatus,
        tt.idioma,
        tt.horas_acumuladas
      ORDER BY u.nombre ASC, u.apellido_paterno ASC
      `
    );

    const headers = [
      "ID Tutor",
      "Nombre",
      "Apellido paterno",
      "Apellido materno",
      "Correo",
      "Estado",
      "Idioma perfil",
      "Beneficiarios asignados",
      "Horas acumuladas",
    ];

    const rows = result.rows.map((row) => [
      row.id_tutor,
      row.nombre,
      row.apellido_paterno,
      row.apellido_materno || "",
      row.correo,
      row.estatus,
      row.idioma || "",
      row.beneficiarios_asignados,
      row.horas_acumuladas || 0,
    ]);

    sendCsv(res, "reporte_tutores.csv", headers, rows);
  } catch (error) {
    console.error("Error al generar reporte de tutores:", error);
    res.status(500).json({ message: "Error al generar reporte de tutores." });
  }
});

router.get("/reportes/horas", async (req, res) => {
  try {
    const result = await query(
      `
      SELECT
        tt.id_tutor,
        CONCAT(u.nombre, ' ', u.apellido_paterno, COALESCE(' ' || u.apellido_materno, '')) AS tutor,
        u.correo,
        u.estatus,
        tt.idioma,
        tt.horas_acumuladas,
        COUNT(a.id_asignacion) AS beneficiarios_asignados
      FROM tutortec tt
      INNER JOIN usuario u
        ON u.id_usuario = tt.id_usuario
      LEFT JOIN asignacion a
        ON a.id_tutor = tt.id_tutor
      GROUP BY
        tt.id_tutor,
        u.nombre,
        u.apellido_paterno,
        u.apellido_materno,
        u.correo,
        u.estatus,
        tt.idioma,
        tt.horas_acumuladas
      ORDER BY tt.horas_acumuladas DESC, tutor ASC
      `
    );

    const headers = [
      "ID Tutor",
      "Tutor",
      "Correo",
      "Estado",
      "Idioma perfil",
      "Horas acumuladas",
      "Beneficiarios asignados",
    ];

    const rows = result.rows.map((row) => [
      row.id_tutor,
      row.tutor,
      row.correo,
      row.estatus,
      row.idioma || "",
      row.horas_acumuladas || 0,
      row.beneficiarios_asignados,
    ]);

    sendCsv(res, "reporte_horas_tutores.csv", headers, rows);
  } catch (error) {
    console.error("Error al generar reporte de horas:", error);
    res.status(500).json({ message: "Error al generar reporte de horas." });
  }
});

router.post("/beneficiarios", async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      correo,
      contrasena,
      nivel,
      estatus,
      tutorId,
      matricula_folio,
      idioma,
      periodo,
      fecha_inicio,
      fecha_fin,
    } = req.body;

    const nombreLimpio = clean(nombre);
    const apellidoPaternoLimpio = clean(apellido_paterno);
    const apellidoMaternoLimpio = clean(apellido_materno);
    const correoLimpio = clean(correo).toLowerCase();
    const contrasenaLimpia = clean(contrasena);
    const nivelLimpio = clean(nivel);
    const estatusNormalizado = normalizeStatus(estatus);
    const matriculaLimpia = clean(matricula_folio);
    const idiomaLimpio = clean(idioma);
    const periodoLimpio = clean(periodo);
    const tutorIdNumero = Number(tutorId);

    if (
      !nombreLimpio ||
      !apellidoPaternoLimpio ||
      !correoLimpio ||
      !contrasenaLimpia ||
      !nivelLimpio ||
      !tutorIdNumero
    ) {
      return res.status(400).json({
        message: "Completa los campos obligatorios del beneficiario.",
      });
    }

    const correoExistente = await client.query(
      `SELECT id_usuario FROM usuario WHERE correo = $1 LIMIT 1`,
      [correoLimpio]
    );

    if (correoExistente.rows.length > 0) {
      return res.status(409).json({
        message: "Ese correo ya se encuentra registrado.",
      });
    }

    await client.query("BEGIN");

    const hashedPassword = await bcrypt.hash(contrasenaLimpia, 10);

    const usuarioInsertado = await client.query(
      `
      INSERT INTO usuario (
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        contrasena,
        rol,
        estatus
      )
      VALUES ($1, $2, $3, $4, $5, 'beneficiario', $6)
      RETURNING id_usuario
      `,
      [
        nombreLimpio,
        apellidoPaternoLimpio,
        apellidoMaternoLimpio || null,
        correoLimpio,
        hashedPassword,
        estatusNormalizado,
      ]
    );

    const idUsuario = usuarioInsertado.rows[0].id_usuario;

    const beneficiarioInsertado = await client.query(
      `
      INSERT INTO beneficiario (
        id_usuario,
        matricula_folio,
        nivel,
        idioma
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id_beneficiario
      `,
      [
        idUsuario,
        matriculaLimpia || null,
        nivelLimpio,
        idiomaLimpio || null,
      ]
    );

    const idBeneficiario = beneficiarioInsertado.rows[0].id_beneficiario;

    await client.query(
      `
      INSERT INTO asignacion (
        id_tutor,
        id_beneficiario,
        periodo,
        fecha_inicio,
        fecha_fin,
        estatus,
        idioma
      )
      VALUES ($1, $2, $3, $4, $5, 'Activa', 'ingles')
      `,
      [
        tutorIdNumero,
        idBeneficiario,
        periodoLimpio || "2026-A",
        fecha_inicio || null,
        fecha_fin || null,
      ]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Beneficiario creado correctamente.",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al crear beneficiario:", error);
    res.status(500).json({ message: "Error al crear beneficiario." });
  } finally {
    client.release();
  }
});

router.put("/beneficiarios/:id", async (req, res) => {
  const client = await pool.connect();

  try {
    const idBeneficiario = Number(req.params.id);

    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      correo,
      contrasena,
      nivel,
      estatus,
      tutorId,
      matricula_folio,
      idioma,
      periodo,
      fecha_inicio,
      fecha_fin,
      id_asignacion,
    } = req.body;

    const nombreLimpio = clean(nombre);
    const apellidoPaternoLimpio = clean(apellido_paterno);
    const apellidoMaternoLimpio = clean(apellido_materno);
    const correoLimpio = clean(correo).toLowerCase();
    const contrasenaLimpia = clean(contrasena);
    const nivelLimpio = clean(nivel);
    const estatusNormalizado = normalizeStatus(estatus);
    const tutorIdNumero = Number(tutorId);
    const idAsignacionNumero = Number(id_asignacion);

    if (
      !idBeneficiario ||
      !nombreLimpio ||
      !apellidoPaternoLimpio ||
      !correoLimpio ||
      !nivelLimpio ||
      !tutorIdNumero
    ) {
      return res.status(400).json({
        message: "Completa los campos obligatorios del beneficiario.",
      });
    }

    await client.query("BEGIN");

    const actualResult = await client.query(
      `
      SELECT b.id_usuario
      FROM beneficiario b
      WHERE b.id_beneficiario = $1
      LIMIT 1
      `,
      [idBeneficiario]
    );

    if (actualResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Beneficiario no encontrado." });
    }

    const idUsuario = actualResult.rows[0].id_usuario;

    const correoExistente = await client.query(
      `
      SELECT id_usuario
      FROM usuario
      WHERE correo = $1
        AND id_usuario <> $2
      LIMIT 1
      `,
      [correoLimpio, idUsuario]
    );

    if (correoExistente.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        message: "Ese correo ya se encuentra registrado.",
      });
    }

    if (contrasenaLimpia) {
      const hashedPassword = await bcrypt.hash(contrasenaLimpia, 10);

      await client.query(
        `
        UPDATE usuario
        SET
          nombre = $1,
          apellido_paterno = $2,
          apellido_materno = $3,
          correo = $4,
          contrasena = $5,
          estatus = $6
        WHERE id_usuario = $7
        `,
        [
          nombreLimpio,
          apellidoPaternoLimpio,
          apellidoMaternoLimpio || null,
          correoLimpio,
          hashedPassword,
          estatusNormalizado,
          idUsuario,
        ]
      );
    } else {
      await client.query(
        `
        UPDATE usuario
        SET
          nombre = $1,
          apellido_paterno = $2,
          apellido_materno = $3,
          correo = $4,
          estatus = $5
        WHERE id_usuario = $6
        `,
        [
          nombreLimpio,
          apellidoPaternoLimpio,
          apellidoMaternoLimpio || null,
          correoLimpio,
          estatusNormalizado,
          idUsuario,
        ]
      );
    }

    await client.query(
      `
      UPDATE beneficiario
      SET
        matricula_folio = $1,
        nivel = $2,
        idioma = $3
      WHERE id_beneficiario = $4
      `,
      [
        clean(matricula_folio) || null,
        nivelLimpio,
        clean(idioma) || null,
        idBeneficiario,
      ]
    );

    if (idAsignacionNumero) {
      await client.query(
        `
        UPDATE asignacion
        SET
          id_tutor = $1,
          periodo = $2,
          fecha_inicio = $3,
          fecha_fin = $4
        WHERE id_asignacion = $5
        `,
        [
          tutorIdNumero,
          clean(periodo) || "2026-A",
          fecha_inicio || null,
          fecha_fin || null,
          idAsignacionNumero,
        ]
      );
    } else {
      await client.query(
        `
        INSERT INTO asignacion (
          id_tutor,
          id_beneficiario,
          periodo,
          fecha_inicio,
          fecha_fin,
          estatus,
          idioma
        )
        VALUES ($1, $2, $3, $4, $5, 'Activa', 'ingles')
        `,
        [
          tutorIdNumero,
          idBeneficiario,
          clean(periodo) || "2026-A",
          fecha_inicio || null,
          fecha_fin || null,
        ]
      );
    }

    await client.query("COMMIT");

    res.json({ message: "Beneficiario actualizado correctamente." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al actualizar beneficiario:", error);
    res.status(500).json({ message: "Error al actualizar beneficiario." });
  } finally {
    client.release();
  }
});

router.post("/tutores", async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      correo,
      contrasena,
      idioma,
      periodo,
      fecha_inicio,
      fecha_fin,
      estatus,
    } = req.body;

    const nombreLimpio = clean(nombre);
    const apellidoPaternoLimpio = clean(apellido_paterno);
    const apellidoMaternoLimpio = clean(apellido_materno);
    const correoLimpio = clean(correo).toLowerCase();
    const contrasenaLimpia = clean(contrasena);
    const idiomaLimpio = clean(idioma);
    const estatusNormalizado = normalizeStatus(estatus);

    if (
      !nombreLimpio ||
      !apellidoPaternoLimpio ||
      !correoLimpio ||
      !contrasenaLimpia
    ) {
      return res.status(400).json({
        message: "Completa los campos obligatorios del tutor.",
      });
    }

    const correoExistente = await client.query(
      `SELECT id_usuario FROM usuario WHERE correo = $1 LIMIT 1`,
      [correoLimpio]
    );

    if (correoExistente.rows.length > 0) {
      return res.status(409).json({
        message: "Ese correo ya se encuentra registrado.",
      });
    }

    await client.query("BEGIN");

    const hashedPassword = await bcrypt.hash(contrasenaLimpia, 10);

    const usuarioInsertado = await client.query(
      `
      INSERT INTO usuario (
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        contrasena,
        rol,
        estatus
      )
      VALUES ($1, $2, $3, $4, $5, 'tutor', $6)
      RETURNING id_usuario
      `,
      [
        nombreLimpio,
        apellidoPaternoLimpio,
        apellidoMaternoLimpio || null,
        correoLimpio,
        hashedPassword,
        estatusNormalizado,
      ]
    );

    const idUsuario = usuarioInsertado.rows[0].id_usuario;

    await client.query(
      `
      INSERT INTO tutortec (
        id_usuario,
        idioma,
        periodo,
        fecha_inicio,
        fecha_fin,
        horas_acumuladas
      )
      VALUES ($1, $2, $3, $4, $5, 0)
      `,
      [
        idUsuario,
        idiomaLimpio || null,
        clean(periodo) || null,
        fecha_inicio || null,
        fecha_fin || null,
      ]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Tutor creado correctamente.",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al crear tutor:", error);
    res.status(500).json({ message: "Error al crear tutor." });
  } finally {
    client.release();
  }
});

router.put("/tutores/:id", async (req, res) => {
  const client = await pool.connect();

  try {
    const idTutor = Number(req.params.id);

    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      correo,
      contrasena,
      idioma,
      periodo,
      fecha_inicio,
      fecha_fin,
      estatus,
    } = req.body;

    const nombreLimpio = clean(nombre);
    const apellidoPaternoLimpio = clean(apellido_paterno);
    const apellidoMaternoLimpio = clean(apellido_materno);
    const correoLimpio = clean(correo).toLowerCase();
    const contrasenaLimpia = clean(contrasena);
    const idiomaLimpio = clean(idioma);
    const estatusNormalizado = normalizeStatus(estatus);

    if (!idTutor || !nombreLimpio || !apellidoPaternoLimpio || !correoLimpio) {
      return res.status(400).json({
        message: "Completa los campos obligatorios del tutor.",
      });
    }

    await client.query("BEGIN");

    const actualResult = await client.query(
      `
      SELECT id_usuario
      FROM tutortec
      WHERE id_tutor = $1
      LIMIT 1
      `,
      [idTutor]
    );

    if (actualResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Tutor no encontrado." });
    }

    const idUsuario = actualResult.rows[0].id_usuario;

    const correoExistente = await client.query(
      `
      SELECT id_usuario
      FROM usuario
      WHERE correo = $1
        AND id_usuario <> $2
      LIMIT 1
      `,
      [correoLimpio, idUsuario]
    );

    if (correoExistente.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        message: "Ese correo ya se encuentra registrado.",
      });
    }

    if (contrasenaLimpia) {
      const hashedPassword = await bcrypt.hash(contrasenaLimpia, 10);

      await client.query(
        `
        UPDATE usuario
        SET
          nombre = $1,
          apellido_paterno = $2,
          apellido_materno = $3,
          correo = $4,
          contrasena = $5,
          estatus = $6
        WHERE id_usuario = $7
        `,
        [
          nombreLimpio,
          apellidoPaternoLimpio,
          apellidoMaternoLimpio || null,
          correoLimpio,
          hashedPassword,
          estatusNormalizado,
          idUsuario,
        ]
      );
    } else {
      await client.query(
        `
        UPDATE usuario
        SET
          nombre = $1,
          apellido_paterno = $2,
          apellido_materno = $3,
          correo = $4,
          estatus = $5
        WHERE id_usuario = $6
        `,
        [
          nombreLimpio,
          apellidoPaternoLimpio,
          apellidoMaternoLimpio || null,
          correoLimpio,
          estatusNormalizado,
          idUsuario,
        ]
      );
    }

    await client.query(
      `
      UPDATE tutortec
      SET
        idioma = $1,
        periodo = $2,
        fecha_inicio = $3,
        fecha_fin = $4
      WHERE id_tutor = $5
      `,
      [
        idiomaLimpio || null,
        clean(periodo) || null,
        fecha_inicio || null,
        fecha_fin || null,
        idTutor,
      ]
    );

    await client.query("COMMIT");

    res.json({ message: "Tutor actualizado correctamente." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al actualizar tutor:", error);
    res.status(500).json({ message: "Error al actualizar tutor." });
  } finally {
    client.release();
  }
});

router.delete("/beneficiarios/:id", async (req, res) => {
  const client = await pool.connect();

  try {
    const idBeneficiario = Number(req.params.id);

    if (!idBeneficiario) {
      return res.status(400).json({ message: "ID inválido." });
    }

    await client.query("BEGIN");

    const usuarioResult = await client.query(
      `
      SELECT id_usuario
      FROM beneficiario
      WHERE id_beneficiario = $1
      LIMIT 1
      `,
      [idBeneficiario]
    );

    if (usuarioResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Beneficiario no encontrado." });
    }

    const idUsuario = usuarioResult.rows[0].id_usuario;

    await client.query(`DELETE FROM asignacion WHERE id_beneficiario = $1`, [
      idBeneficiario,
    ]);

    await client.query(`DELETE FROM avance WHERE id_beneficiario = $1`, [
      idBeneficiario,
    ]);

    await client.query(`DELETE FROM beneficiario WHERE id_beneficiario = $1`, [
      idBeneficiario,
    ]);

    await client.query(`DELETE FROM usuario WHERE id_usuario = $1`, [idUsuario]);

    await client.query("COMMIT");

    res.json({ message: "Beneficiario eliminado correctamente." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al eliminar beneficiario:", error);
    res.status(500).json({ message: "Error al eliminar beneficiario." });
  } finally {
    client.release();
  }
});

router.delete("/tutores/:id", async (req, res) => {
  const client = await pool.connect();

  try {
    const idTutor = Number(req.params.id);

    if (!idTutor) {
      return res.status(400).json({ message: "ID inválido." });
    }

    await client.query("BEGIN");

    const usuarioResult = await client.query(
      `
      SELECT id_usuario
      FROM tutortec
      WHERE id_tutor = $1
      LIMIT 1
      `,
      [idTutor]
    );

    if (usuarioResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Tutor no encontrado." });
    }

    const idUsuario = usuarioResult.rows[0].id_usuario;

    await client.query(`DELETE FROM seguimiento_tutor WHERE id_tutor = $1`, [
      idTutor,
    ]);

    await client.query(`DELETE FROM asignacion WHERE id_tutor = $1`, [idTutor]);

    await client.query(`DELETE FROM horas_evidencias WHERE id_tutor = $1`, [idTutor]);

    await client.query(`DELETE FROM tutortec WHERE id_tutor = $1`, [idTutor]);

    await client.query(`DELETE FROM usuario WHERE id_usuario = $1`, [idUsuario]);

    await client.query("COMMIT");

    res.json({ message: "Tutor eliminado correctamente." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al eliminar tutor:", error);
    res.status(500).json({ message: "Error al eliminar tutor." });
  } finally {
    client.release();
  }
});

module.exports = router;