const { query } = require("../Database/index");

const saveZoomLink = async (req, res) => {
  try {
    const { id_tutor, zoom_link } = req.body;

    const result = await query(
      `
      INSERT INTO tutor_zoom_link
      (id_tutor, zoom_link)
      VALUES ($1,$2)
      ON CONFLICT (id_tutor)
      DO UPDATE
      SET zoom_link = EXCLUDED.zoom_link
      RETURNING *
      `,
      [id_tutor, zoom_link]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error interno",
    });
  }
};

const getZoomLink = async (req, res) => {
  try {
    const result = await query(
      `
      SELECT zoom_link
      FROM tutor_zoom_link
      WHERE id_tutor = $1
      `,
      [req.params.idTutor]
    );

    res.json(result.rows[0] || {});
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error interno",
    });
  }
};

module.exports = {
  saveZoomLink,
  getZoomLink,
};