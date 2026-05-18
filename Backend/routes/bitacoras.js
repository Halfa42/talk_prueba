const express = require('express');
const { createBitacora, getBitacorasByAsignacion } = require('../controllers/bitacoraController');

const router = express.Router();

router.post('/', createBitacora);
router.get('/asignacion/:idAsignacion', getBitacorasByAsignacion);

module.exports = router;
