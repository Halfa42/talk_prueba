const express = require('express');
const {
  getSocioDashboardSummary,
  getTutorDashboardSummary,
  getTutorCalendar,
  createCalendarSession,
  deleteCalendarSession,
  getTutorHours,
} = require('../controllers/dashboardController');

const router = express.Router();

router.get('/socio/summary', getSocioDashboardSummary);
router.get('/:tutorId/summary', getTutorDashboardSummary);
router.get('/:tutorId/calendario', getTutorCalendar);
router.post('/:tutorId/calendario', createCalendarSession);
router.delete('/:tutorId/calendario/:sessionId', deleteCalendarSession);
router.get('/:tutorId/hours', getTutorHours);

module.exports = router;