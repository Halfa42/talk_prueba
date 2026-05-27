const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const tutorStudentsRoutes = require('./routes/TutorStudents');
const materialsRoutes = require('./routes/materials');
const sesionesRoutes = require('./routes/sesiones');
const bitacorasRoutes = require('./routes/bitacoras');
const tareasRoutes = require('./routes/tareas');
const dashboardRoutes = require('./routes/dashboard');
const zoomRoutes = require('./routes/zoom');
const orgRoutes = require('./routes/org');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ mensaje: 'Backend funcionando' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tutor-students', tutorStudentsRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/sesiones', sesionesRoutes);
app.use('/api/bitacoras', bitacorasRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/zoom-link', zoomRoutes);
app.use('/api/org', orgRoutes);

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});