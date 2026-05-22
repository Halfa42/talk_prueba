const { query } = require('../Database/index');

const uploadMaterial = async (req, res) => {
  try {
    const { titulo, tema, nivel, descripcion, id_asignacion } = req.body;
    const idAsignacion = id_asignacion ? Number(id_asignacion) : null;
    const file = req.file;
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!titulo || !file) {
      return res.status(400).json({
        message: 'Archivo no subido, por favor complete todos los campos',
      });
    }

    if (idAsignacion !== null && (!Number.isInteger(idAsignacion) || idAsignacion <= 0)) {
      return res.status(400).json({
        message: 'id_asignacion debe ser valido si se proporciona',
      });
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({
        message: 'Archivo no subido, formato no permitido',
      });
    }

    const insertResult = await query(
      `
        INSERT INTO material (
          id_asignacion,
          titulo,
          tema,
          nivel,
          descripcion,
          archivo_nombre,
          archivo_tipo,
          archivo_tamano,
          archivo_datos,
          archivo_url
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id_material, titulo, tema, nivel, archivo_nombre, archivo_tipo, archivo_tamano, fecha_subida
      `,
      [
        idAsignacion,
        titulo,
        tema || null,
        nivel || null,
        descripcion || null,
        file.originalname,
        file.mimetype,
        file.size,
        file.buffer,
        file.originalname,
      ]
    );

    return res.status(201).json(insertResult.rows[0]);
  } catch (error) {
    console.error('Error en uploadMaterial:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getMaterials = async (req, res) => {
  try {
    const result = await query(
      `
        SELECT
          m.id_material,
          m.titulo,
          m.tema,
          m.nivel,
          m.descripcion,
          m.archivo_nombre,
          m.archivo_tipo,
          m.archivo_tamano,
          m.fecha_subida,
          a.id_beneficiario,
          u.nombre,
          u.apellido_paterno
        FROM material m
        LEFT JOIN asignacion a ON m.id_asignacion = a.id_asignacion
        LEFT JOIN beneficiario b ON a.id_beneficiario = b.id_beneficiario
        LEFT JOIN usuario u ON b.id_usuario = u.id_usuario
        ORDER BY m.fecha_subida DESC, m.id_material DESC
      `
    );

    return res.json(result.rows);
  } catch (error) {
    console.error('Error en getMaterials:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const downloadMaterial = async (req, res) => {
  try {
    const materialId = Number(req.params.materialId);

    if (!materialId) {
      return res.status(400).json({ message: 'materialId invalido' });
    }

    const result = await query(
      `
        SELECT archivo_nombre, archivo_tipo, archivo_datos
        FROM material
        WHERE id_material = $1
      `,
      [materialId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Material no encontrado' });
    }

    const material = result.rows[0];

    if (!material.archivo_datos) {
      return res.status(404).json({ message: 'El material no tiene archivo almacenado' });
    }

    res.setHeader('Content-Type', material.archivo_tipo || 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(material.archivo_nombre || 'material.bin')}"`
    );

    return res.send(material.archivo_datos);
  } catch (error) {
    console.error('Error en downloadMaterial:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const materialId = Number(req.params.materialId);

    if (!Number.isInteger(materialId) || materialId <= 0) {
      return res.status(400).json({ message: 'materialId invalido' });
    }

    const result = await query(
      `
        DELETE FROM material
        WHERE id_material = $1
        RETURNING id_material
      `,
      [materialId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Material no encontrado' });
    }

    return res.json({ message: 'Material eliminado correctamente' });
  } catch (error) {
    console.error('Error en deleteMaterial:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  uploadMaterial,
  getMaterials,
  downloadMaterial,
  deleteMaterial,
};