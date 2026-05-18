const express = require('express');
const multer = require('multer');

const {
  uploadMaterial,
  getMaterials,
  downloadMaterial,
  deleteMaterial,
} = require('../controllers/materialController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getMaterials);
router.get('/:materialId/download', downloadMaterial);
router.delete('/:materialId', deleteMaterial);
router.post('/upload', upload.single('file'), uploadMaterial);

module.exports = router;
