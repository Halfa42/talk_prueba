const express = require('express');
const router = express.Router();
const { getStudentProfile, changePassword } = require('../controllers/studentProfileController');

router.get('/:usuarioId', getStudentProfile);
router.put('/:usuarioId/change-password', changePassword);

module.exports = router;