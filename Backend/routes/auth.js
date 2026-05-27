const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { query } = require("../Database/index");

const router = express.Router();

function buildTokenPayload(usuario, perfilId) {
  return {
    id_usuario: usuario.id_usuario,
    correo: usuario.correo,
    rol: usuario.rol,
    perfilId,
  };
}

async function getProfileIdByRole(usuario) {
  if (usuario.rol === "tutor") {
    const result = await query(
      `
      SELECT id_tutor AS perfil_id
      FROM tutortec
      WHERE id_usuario = $1
      LIMIT 1
      `,
      [usuario.id_usuario]
    );
    return result.rows[0]?.perfil_id || null;
  }

  if (usuario.rol === "beneficiario") {
    const result = await query(
      `
      SELECT id_beneficiario AS perfil_id
      FROM beneficiario
      WHERE id_usuario = $1
      LIMIT 1
      `,
      [usuario.id_usuario]
    );
    return result.rows[0]?.perfil_id || null;
  }

  if (usuario.rol === "socio_formador") {
    const result = await query(
      `
      SELECT id_socio_formador AS perfil_id
      FROM socio_formador
      WHERE id_usuario = $1
      LIMIT 1
      `,
      [usuario.id_usuario]
    );
    return result.rows[0]?.perfil_id || null;
  }

  return null;
}

router.post("/login", async (req, res) => {
  try {
    const correo = String(req.body?.correo || "").trim().toLowerCase();
    const contrasena = String(req.body?.contrasena || "").trim();

    if (!correo || !contrasena) {
      return res.status(400).json({
        message: "Correo y contraseña son obligatorios.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("Falta configurar JWT_SECRET en Backend/.env");
      return res.status(500).json({
        message: "Configuración interna incompleta: JWT_SECRET no definido",
      });
    }

    const result = await query(
      `
      SELECT
        id_usuario,
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        contrasena,
        rol,
        estatus
      FROM usuario
      WHERE LOWER(correo) = $1
      LIMIT 1
      `,
      [correo]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Correo o contraseña incorrectos.",
      });
    }

    const usuario = result.rows[0];

    if (usuario.estatus !== "activo") {
      return res.status(403).json({
        message: "La cuenta no se encuentra activa.",
      });
    }

    const passwordOk = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!passwordOk) {
      return res.status(401).json({
        message: "Correo o contraseña incorrectos.",
      });
    }

    const perfilId = await getProfileIdByRole(usuario);
    const tokenPayload = buildTokenPayload(usuario, perfilId);

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    return res.json({
      message: "Inicio de sesión correcto.",
      token,
      user: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido_paterno: usuario.apellido_paterno,
        apellido_materno: usuario.apellido_materno,
        correo: usuario.correo,
        rol: usuario.rol,
        estatus: usuario.estatus,
        perfilId,
      },
    });
  } catch (error) {
    console.error("Error en /login:", error);
    return res.status(500).json({
      message: "Error interno al iniciar sesión.",
    });
  }
});

router.get("/validate", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({
        message: "Token no proporcionado.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("Falta configurar JWT_SECRET en Backend/.env");
      return res.status(500).json({
        message: "Configuración interna incompleta: JWT_SECRET no definido",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await query(
      `
      SELECT
        id_usuario,
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        rol,
        estatus
      FROM usuario
      WHERE id_usuario = $1
      LIMIT 1
      `,
      [decoded.id_usuario]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Usuario no válido.",
      });
    }

    const usuario = result.rows[0];
    const perfilId = await getProfileIdByRole(usuario);

    return res.json({
      valid: true,
      user: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido_paterno: usuario.apellido_paterno,
        apellido_materno: usuario.apellido_materno,
        correo: usuario.correo,
        rol: usuario.rol,
        estatus: usuario.estatus,
        perfilId,
      },
    });
  } catch (error) {
    console.error("Error en /validate:", error);
    return res.status(401).json({
      valid: false,
      message: "Token inválido o expirado.",
    });
  }
});

module.exports = router;