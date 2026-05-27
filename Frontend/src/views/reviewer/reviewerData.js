export const sampleBeneficiarios = [
  {
    id: 1,
    nombre: "Lucía Torres",
    nivel: "A2",
    tutor: "Marta Ríos",
    correo: "lucia.torres@talk.com",
    estatus: "Activo",
  },
  {
    id: 2,
    nombre: "Diego Medina",
    nivel: "A1",
    tutor: "Carlos Vega",
    correo: "diego.medina@talk.com",
    estatus: "En revisión",
  },
  {
    id: 3,
    nombre: "Sara Jiménez",
    nivel: "B1",
    tutor: "Marta Ríos",
    correo: "sara.jimenez@talk.com",
    estatus: "Activo",
  },
];

export const sampleTutores = [
  {
    id: 1,
    nombre: "Marta Ríos",
    correo: "marta.rios@talk.com",
    beneficiarios: 8,
    horas: 42,
    estatus: "Activo",
  },
  {
    id: 2,
    nombre: "Carlos Vega",
    correo: "carlos.vega@talk.com",
    beneficiarios: 6,
    horas: 34,
    estatus: "Activo",
  },
  {
    id: 3,
    nombre: "Natalia López",
    correo: "natalia.lopez@talk.com",
    beneficiarios: 5,
    horas: 28,
    estatus: "Activo",
  },
];

export const sampleBitacoras = [
  {
    id: 1,
    beneficiario: "Lucía Torres",
    tutor: "Marta Ríos",
    tema: "Progreso en comprensión auditiva",
    fecha: "2026-05-25",
    tipo: "Seguimiento",
    resumen: "Revisión de objetivos A2 y comentarios sobre tareas pendientes.",
    estado: "Pendiente",
  },
  {
    id: 2,
    beneficiario: "Diego Medina",
    tutor: "Carlos Vega",
    tema: "Tarea de vocabulario",
    fecha: "2026-05-24",
    tipo: "Evaluación",
    resumen: "Se detectó avance en pronunciación, se solicita retroalimentación adicional.",
    estado: "Pendiente",
  },
  {
    id: 3,
    beneficiario: "Sara Jiménez",
    tutor: "Marta Ríos",
    tema: "Planeación de próxima sesión",
    fecha: "2026-05-23",
    tipo: "Registro",
    resumen: "Se solicita revisar el plan de actividades y tareas asignadas.",
    estado: "Pendiente",
  },
];
