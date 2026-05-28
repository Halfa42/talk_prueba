const express = require('express');
const router = express.Router();
const { 
  createTarea, 
  getTareasByTutor, 
  getBeneficiariosByTutor, 
  getEntregasPendientes, 
  deleteTarea,
  getTareasByBeneficiario, 
  submitEntrega
} = require('../controllers/tareaController');

router.post('/', createTarea);
router.post('/entregas', submitEntrega);
router.get('/bytutor/:tutorId', getTareasByTutor);
router.get('/beneficiarios/:tutorId', getBeneficiariosByTutor);
router.get('/entregas/:tutorId', getEntregasPendientes);
router.get('/beneficiario/:usuarioId', getTareasByBeneficiario);
router.delete('/:tareaId', deleteTarea);

module.exports = router;