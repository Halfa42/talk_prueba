const express  = require('express');
const multer   = require('multer');
const {
  createBitacora,
  getBitacorasByAsignacion,
  getPendingBitacoras,
  getBitacoraById,
  markBitacoraReviewed,
  rejectBitacora,
  deleteBitacora,
} = require('../controllers/bitacoraController');

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
router.get('/pendientes', getPendingBitacoras);
router.patch('/:id/revisar', markBitacoraReviewed);
router.patch('/:id/rechazar', rejectBitacora);
router.delete('/:id', deleteBitacora);
router.get('/:id', getBitacoraById);

module.exports = router;