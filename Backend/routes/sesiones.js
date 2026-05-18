const express = require('express');
const { createSesion, getSesionesByAsignacion } = require('../controllers/sesionController');

const router = express.Router();

router.post('/', createSesion);
router.get('/asignacion/:idAsignacion', getSesionesByAsignacion);

module.exports = router;
