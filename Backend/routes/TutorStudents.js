const express = require('express');
const router = express.Router();

const {
  getTutorStudents
} = require('../controllers/tutorStudentController');

router.get('/', getTutorStudents);

module.exports = router;