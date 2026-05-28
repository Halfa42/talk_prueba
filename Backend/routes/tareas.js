const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads/tareas');
if (!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});

const upload = multer({ storage: storage });

const { 
  createTarea, 
  getTareasByTutor, 
  getBeneficiariosByTutor, 
  getEntregasPendientes, 
  deleteTarea,
  getTareasByBeneficiario, 
  submitEntrega,
  downloadArchivoApoyo
} = require('../controllers/tareaController');

router.post('/', upload.single('archivo_apoyo'), createTarea);
router.post('/entregas', upload.single('archivo_entregado'), submitEntrega);
router.get('/bytutor/:tutorId', getTareasByTutor);
router.get('/beneficiarios/:tutorId', getBeneficiariosByTutor);
router.get('/entregas/:tutorId', getEntregasPendientes);
router.get('/beneficiario/:usuarioId', getTareasByBeneficiario);
router.delete('/:tareaId', deleteTarea);
router.get('/:tareaId/download', downloadArchivoApoyo);

module.exports = router;