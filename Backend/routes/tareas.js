const express = require('express');
const { createTarea, getTareasByTutor, getBeneficiariosByTutor, getEntregasPendientes, deleteTarea } = require('../controllers/tareaController');

const router = express.Router();

router.post('/', createTarea);
router.get('/bytutor/:tutorId', getTareasByTutor);
router.get('/beneficiarios/:tutorId', getBeneficiariosByTutor);
router.get('/entregas/:tutorId', getEntregasPendientes);
router.delete('/:tareaId', deleteTarea);

module.exports = router;
