const express = require("express");
const bcrypt = require("bcrypt");
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
        COALESCE(
          CONCAT(ut.nombre, ' ', ut.apellido_paterno),
          'Sin asignar'
        ) AS tutor
      FROM beneficiario b
      INNER JOIN usuario u
        ON u.id_usuario = b.id_usuario
      LEFT JOIN LATERAL (
        SELECT a.id_tutor
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
    } = req.body;

    const tutorIdNumero = Number(tutorId);
    const beneficiarioIdNumero = Number(beneficiarioId);

    if (!tutorIdNumero || !beneficiarioIdNumero) {
      return res.status(400).json({
        message: "Selecciona un tutor y un beneficiario.",
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
        estatus
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        tutorIdNumero,
        beneficiarioIdNumero,
        clean(periodo) || "2026-A",
        fecha_inicio || null,
        fecha_fin || null,
        clean(estatus) || "Activa",
      ]
    );

    res.status(201).json({
      message: "Asignación creada correctamente.",
    });
  } catch (error) {
    console.error("Error al crear asignación:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Esa asignación ya existe para el periodo seleccionado.",
      });
    }

    res.status(500).json({ message: "Error al crear asignación." });
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
        estatus
      )
      VALUES ($1, $2, $3, $4, $5, 'Activa')
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
        horas_acumuladas
      )
      VALUES ($1, $2, 0)
      `,
      [idUsuario, idiomaLimpio || null]
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

    await client.query(`DELETE FROM asignacion WHERE id_tutor = $1`, [idTutor]);

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