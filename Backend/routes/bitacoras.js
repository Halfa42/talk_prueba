const express  = require('express');
const multer   = require('multer');
const { createBitacora, getBitacorasByAsignacion } = require('../controllers/bitacoraController');

const router  = express.Router();
const upload  = multer({ storage: multer.memoryStorage() });

router.post(
  '/',
  upload.fields([
    { name: 'imagen_recordatorio', maxCount: 1 },
    { name: 'imagen_sesion',       maxCount: 1 },
    { name: 'imagen_incidencia',   maxCount: 1 },  
  ]),
  createBitacora
);

router.get('/asignacion/:idAsignacion', getBitacorasByAsignacion);

module.exports = router;