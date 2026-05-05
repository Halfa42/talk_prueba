export const initialSelectedStudent = {
  name: "María López",
  level: "Nivel A2",
  program: "Inglés",
  status: "Activo",
  attendance: "92%",
  diagnostic: "A1",
  current: "A2",
};

export const tutorStudents = [
  ["María López", "Nivel A2", "Buen avance"],
  ["Carlos Vega", "Nivel A1", "Requiere seguimiento"],
  ["Fernanda Gil", "Nivel B1", "Entrega constante"],
  ["Diego Lara", "Nivel A2", "Asistencia regular"],
  ["Sofía Cruz", "Nivel A1", "Material pendiente"],
  ["Luis Peña", "Nivel A2", "Sesión programada"],
];

export const upcomingSessions = [
  ["María López", "10:00 - 11:00"],
  ["Carlos Vega", "12:00 - 13:00"],
  ["Fernanda Gil", "16:00 - 17:00"],
];

export const sessionTabs = [
  ["registro", "Registro"],
  ["bitacora", "Bitácora"],
  ["evidencias", "Evidencias"],
  ["tareas", "Tareas"],
  ["materiales", "Materiales"],
];

export function buildSelectedStudent(name, level, status) {
  return {
    name,
    level,
    program: "Inglés",
    status: status.includes("seguimiento") ? "Seguimiento" : "Activo",
    attendance: name === "Carlos Vega" ? "78%" : "92%",
    diagnostic: level.includes("A1") ? "A1" : "A2",
    current: level.replace("Nivel ", ""),
  };
}