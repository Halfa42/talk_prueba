const express = require('express');
const router = express.Router();
const {
  getStudentSummary,
  getPendingTasks,
  getUpcomingSessions,
  getStudentMaterials
} = require('../controllers/studentDashboardController');

// Rutas base: /api/student-dashboard/:studentId/...
router.get('/:studentId/summary', getStudentSummary);
router.get('/:studentId/tasks', getPendingTasks);
router.get('/:studentId/sessions', getUpcomingSessions);
router.get('/:studentId/materials', getStudentMaterials);

module.exports = router;    