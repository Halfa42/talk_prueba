import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  FileText,
  Clock3,
  FolderOpen,
  CheckCircle2,
  Upload,
} from "lucide-react";
import KpiCard from "../components/KpiCard";

export default function TutorView() {
  const [tutorModule, setTutorModule] = useState("dashboard");
  const [sessionTab, setSessionTab] = useState("registro");
  const [selectedStudent, setSelectedStudent] = useState({
    name: "María López",
    level: "Nivel A2",
    program: "Inglés",
    status: "Activo",
    attendance: "92%",
    diagnostic: "A1",
    current: "A2",
  });

  const softCard = "bg-white rounded-2xl border border-slate-200 shadow-sm";
  const menuClass = (active) =>
    `w-full flex items-center gap-3 text-left px-4 py-3 rounded-2xl text-sm border transition ${active ? "bg-blue-600 text-white border-blue-600 font-medium shadow-sm" : "bg-white border-transparent hover:bg-slate-50"}`;
  const tabClass = (active) =>
    `px-4 py-2 rounded-xl text-sm border transition ${active ? "bg-blue-600 text-white border-blue-600" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`;

  const renderContent = () => {
    if (tutorModule === "dashboard")
      return (
        <div className="space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <KpiCard
              title="Alumnos asignados"
              value="8"
              hint="2 con seguimiento prioritario"
            />
            <KpiCard
              title="Sesiones esta semana"
              value="11"
              hint="3 pendientes de registrar"
            />
            <KpiCard title="Tareas por revisar" value="6" hint="4 vencen hoy" />
            <KpiCard
              title="Horas acumuladas"
              value="47.5 h"
              hint="41 h ya validadas"
            />
          </div>
          <div className="grid xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <div className={softCard + " p-5"}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">Panel operativo</h2>
                    <p className="text-sm text-slate-500">
                      Accesos rápidos para continuar con tus actividades del
                      día.
                    </p>
                  </div>
                  <button
                    onClick={() => setTutorModule("session")}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm"
                  >
                    Nueva sesión
                  </button>
                </div>
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <button
                    onClick={() => setTutorModule("students")}
                    className="p-4 rounded-2xl border bg-slate-50 text-left hover:border-blue-300 transition"
                  >
                    <Users className="mb-3" size={18} />
                    <div className="font-medium">Mis alumnos</div>
                    <div className="text-slate-500 mt-1">
                      Consulta perfiles y avance.
                    </div>
                  </button>
                  <button
                    onClick={() => setTutorModule("materials")}
                    className="p-4 rounded-2xl border bg-slate-50 text-left hover:border-blue-300 transition"
                  >
                    <FolderOpen className="mb-3" size={18} />
                    <div className="font-medium">Materiales</div>
                    <div className="text-slate-500 mt-1">
                      Sube recursos por tema.
                    </div>
                  </button>
                  <button
                    onClick={() => setTutorModule("tasks")}
                    className="p-4 rounded-2xl border bg-slate-50 text-left hover:border-blue-300 transition"
                  >
                    <ClipboardList className="mb-3" size={18} />
                    <div className="font-medium">Tareas</div>
                    <div className="text-slate-500 mt-1">
                      Asigna y revisa entregas.
                    </div>
                  </button>
                  <button
                    onClick={() => setTutorModule("hours")}
                    className="p-4 rounded-2xl border bg-slate-50 text-left hover:border-blue-300 transition"
                  >
                    <Clock3 className="mb-3" size={18} />
                    <div className="font-medium">Horas</div>
                    <div className="text-slate-500 mt-1">
                      Consulta horas registradas.
                    </div>
                  </button>
                </div>
              </div>
              <div className={softCard + " p-5"}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Próximas sesiones</h3>
                  <button className="text-sm text-blue-600">
                    Ver calendario
                  </button>
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="text-left p-3">Alumno</th>
                        <th className="text-left p-3">Tema</th>
                        <th className="text-left p-3">Horario</th>
                        <th className="text-left p-3">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        [
                          "María López",
                          "Speaking practice",
                          "10:00 - 11:00",
                          "Confirmada",
                        ],
                        [
                          "Carlos Vega",
                          "Vocabulary review",
                          "12:00 - 13:00",
                          "Pendiente",
                        ],
                        [
                          "Fernanda Gil",
                          "Reading comprehension",
                          "16:00 - 17:00",
                          "Confirmada",
                        ],
                      ].map((row, i) => (
                        <tr
                          key={i}
                          className="border-t border-slate-200 bg-white"
                        >
                          {row.map((cell) => (
                            <td key={cell} className="p-3">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className={softCard + " p-5"}>
                <h3 className="font-semibold text-lg mb-4">Pendientes</h3>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                    3 sesiones aún no tienen bitácora.
                  </div>
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                    2 entregas requieren calificación hoy.
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                    5 materiales nuevos fueron compartidos por organización.
                  </div>
                </div>
              </div>
              <div className={softCard + " p-5"}>
                <h3 className="font-semibold text-lg mb-4">
                  Actividad reciente
                </h3>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex gap-3">
                    <CheckCircle2 size={16} className="mt-0.5 text-green-600" />
                    Se validó la sesión de María López.
                  </div>
                  <div className="flex gap-3">
                    <Upload size={16} className="mt-0.5 text-blue-600" />
                    Subiste material de listening A2.
                  </div>
                  <div className="flex gap-3">
                    <FileText size={16} className="mt-0.5 text-slate-600" />
                    Registraste bitácora de Carlos Vega.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    if (tutorModule === "students")
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Mis alumnos</h2>
              <p className="text-sm text-slate-500">
                Consulta información general, progreso y accesos rápidos.
              </p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm">
              Exportar lista
            </button>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[
              ["María López", "Nivel A2", "Buen avance"],
              ["Carlos Vega", "Nivel A1", "Requiere seguimiento"],
              ["Fernanda Gil", "Nivel B1", "Entrega constante"],
              ["Diego Lara", "Nivel A2", "Asistencia regular"],
              ["Sofía Cruz", "Nivel A1", "Material pendiente"],
              ["Luis Peña", "Nivel A2", "Sesión programada"],
            ].map(([name, level, status]) => (
              <div key={name} className={softCard + " p-5"}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-lg">{name}</div>
                    <div className="text-sm text-slate-500 mt-1">{level}</div>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                    {name[0]}
                  </div>
                </div>
                <div className="mt-4 inline-block text-sm px-3 py-2 rounded-xl bg-slate-100">
                  {status}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
                  <button
                    onClick={() => {
                      setSelectedStudent({
                        name,
                        level,
                        program: "Inglés",
                        status: status.includes("seguimiento")
                          ? "Seguimiento"
                          : "Activo",
                        attendance: name === "Carlos Vega" ? "78%" : "92%",
                        diagnostic: level.includes("A1") ? "A1" : "A2",
                        current: level.replace("Nivel ", ""),
                      });
                      setTutorModule("session");
                      setSessionTab("registro");
                    }}
                    className="px-3 py-2 rounded-xl bg-blue-600 text-white"
                  >
                    Ver ficha
                  </button>
                  <button
                    onClick={() => {
                      setSelectedStudent({
                        name,
                        level,
                        program: "Inglés",
                        status: status.includes("seguimiento")
                          ? "Seguimiento"
                          : "Activo",
                        attendance: name === "Carlos Vega" ? "78%" : "92%",
                        diagnostic: level.includes("A1") ? "A1" : "A2",
                        current: level.replace("Nivel ", ""),
                      });
                      setTutorModule("session");
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-100"
                  >
                    Abrir sesión
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    if (tutorModule === "materials")
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Material para beneficiario</h2>
            <p className="text-sm text-slate-500">
              Carga recursos por tema, nivel y alumno.
            </p>
          </div>
          <div className="grid xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <div className={softCard + " p-5"}>
                <h3 className="font-semibold text-lg mb-4">Nuevo material</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    className="rounded-xl border border-slate-300 px-4 py-3"
                    placeholder="Título del material"
                  />
                  <input
                    className="rounded-xl border border-slate-300 px-4 py-3"
                    placeholder="Tema"
                  />
                  <input
                    className="rounded-xl border border-slate-300 px-4 py-3"
                    placeholder="Nivel"
                  />
                  <select className="rounded-xl border border-slate-300 px-4 py-3 bg-white">
                    <option>Asignar a beneficiario</option>
                  </select>
                </div>
                <textarea
                  className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3"
                  rows="4"
                  placeholder="Descripción del recurso"
                />
                <div className="mt-4 flex gap-3">
                  <button className="px-4 py-2 rounded-xl bg-blue-600 text-white">
                    Subir archivo
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-slate-100">
                    Guardar material
                  </button>
                </div>
              </div>
            </div>
            <div className={softCard + " p-5"}>
              <h3 className="font-semibold text-lg mb-4">Recientes</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-xl bg-slate-50 border">
                  Tema 1 — Presentaciones
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border">
                  Tema 2 — Rutinas diarias
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border">
                  Listening practice A2
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    if (tutorModule === "tasks")
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Tareas y evaluación</h2>
            <p className="text-sm text-slate-500">
              Publica actividades y revisa entregas.
            </p>
          </div>
          <div className="grid xl:grid-cols-2 gap-6">
            <div className={softCard + " p-5"}>
              <h3 className="font-semibold text-lg mb-4">Asignar tarea</h3>
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3"
                placeholder="Título de la tarea"
              />
              <textarea
                className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3"
                rows="4"
                placeholder="Instrucciones"
              />
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  className="rounded-xl border border-slate-300 px-4 py-3"
                  placeholder="Beneficiario"
                />
                <input
                  className="rounded-xl border border-slate-300 px-4 py-3"
                  placeholder="Fecha límite"
                />
              </div>
              <button className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white">
                Publicar tarea
              </button>
            </div>
            <div className={softCard + " p-5"}>
              <h3 className="font-semibold text-lg mb-4">
                Entregas por revisar
              </h3>
              <div className="space-y-3">
                {[
                  "Vocabulary worksheet — María López",
                  "Reading practice — Carlos Vega",
                  "Listening exercise — Sofía Cruz",
                ].map((item) => (
                  <div
                    key={item}
                    className="p-3 rounded-xl bg-slate-50 border flex items-center justify-between text-sm"
                  >
                    <span>{item}</span>
                    <button className="px-3 py-2 rounded-xl bg-white border">
                      Calificar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    if (tutorModule === "session") {
      const SessionMainPanel = () => {
        if (sessionTab === "registro")
          return (
            <div className={softCard + " p-5"}>
              <h3 className="font-semibold text-lg mb-4">Registro de sesión</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  className="rounded-xl border border-slate-300 px-4 py-3"
                  placeholder="Beneficiario"
                  value={selectedStudent.name}
                  readOnly
                />
                <input
                  className="rounded-xl border border-slate-300 px-4 py-3"
                  placeholder="Fecha"
                />
                <input
                  className="rounded-xl border border-slate-300 px-4 py-3"
                  placeholder="Hora inicio"
                />
                <input
                  className="rounded-xl border border-slate-300 px-4 py-3"
                  placeholder="Hora fin"
                />
              </div>
              <textarea
                className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3"
                rows="5"
                placeholder="Tema abordado y observaciones"
              />
              <div className="mt-4 flex gap-3">
                <button className="px-4 py-2 rounded-xl bg-blue-600 text-white">
                  Guardar sesión
                </button>
                <button className="px-4 py-2 rounded-xl bg-slate-100">
                  Marcar asistencia
                </button>
              </div>
            </div>
          );
        if (sessionTab === "bitacora")
          return (
            <div className={softCard + " p-5"}>
              <h3 className="font-semibold text-lg mb-4">Bitácora</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <select className="rounded-xl border border-slate-300 px-4 py-3 bg-white">
                  <option>Tipo de registro</option>
                  <option>Seguimiento</option>
                  <option>Incidencia</option>
                  <option>Acuerdo</option>
                </select>
                <input
                  className="rounded-xl border border-slate-300 px-4 py-3"
                  placeholder="Fecha"
                />
              </div>
              <textarea
                className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3"
                rows="6"
                placeholder="Describe la incidencia, acuerdo u observación relevante"
              />
              <button className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white">
                Guardar bitácora
              </button>
            </div>
          );
        if (sessionTab === "evidencias")
          return (
            <div className={softCard + " p-5"}>
              <h3 className="font-semibold text-lg mb-4">Evidencias</h3>
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center bg-slate-50">
                <Upload className="mx-auto mb-3 text-slate-500" />
                <div className="font-medium">
                  Arrastra archivos o imágenes aquí
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  También puedes cargar enlaces o documentos PDF.
                </div>
                <button className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white">
                  Seleccionar archivo
                </button>
              </div>
            </div>
          );
        if (sessionTab === "tareas")
          return (
            <div className={softCard + " p-5"}>
              <h3 className="font-semibold text-lg mb-4">
                Tareas derivadas de la sesión
              </h3>
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3"
                placeholder="Título de la actividad"
              />
              <textarea
                className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3"
                rows="5"
                placeholder="Indicación para el beneficiario"
              />
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  className="rounded-xl border border-slate-300 px-4 py-3"
                  placeholder="Fecha límite"
                />
                <input
                  className="rounded-xl border border-slate-300 px-4 py-3"
                  placeholder="Adjuntar apoyo opcional"
                />
              </div>
              <button className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white">
                Asignar tarea
              </button>
            </div>
          );
        return (
          <div className={softCard + " p-5"}>
            <h3 className="font-semibold text-lg mb-4">
              Materiales usados en sesión
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border bg-slate-50">
                Vocabulary list A2
              </div>
              <div className="p-4 rounded-2xl border bg-slate-50">
                Reading worksheet
              </div>
              <div className="p-4 rounded-2xl border bg-slate-50">
                Listening practice
              </div>
              <div className="p-4 rounded-2xl border bg-slate-50">
                Guide for speaking exercise
              </div>
            </div>
          </div>
        );
      };

      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Seguimiento de sesión</h2>
              <p className="text-sm text-slate-500">
                Workspace central del tutor.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTutorModule("students")}
                className="px-4 py-2 rounded-xl bg-slate-100 text-sm"
              >
                Volver a alumnos
              </button>
              <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm">
                Guardar progreso
              </button>
            </div>
          </div>
          <div className="grid xl:grid-cols-[300px,1fr,320px] gap-6">
            <div className="space-y-4">
              <div className={softCard + " p-5"}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                    {selectedStudent.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold">{selectedStudent.name}</div>
                    <div className="text-sm text-slate-500">
                      {selectedStudent.level}
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Estado</span>
                    <span className="font-medium text-blue-700">
                      {selectedStudent.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Asistencia</span>
                    <span>{selectedStudent.attendance}</span>
                  </div>
                </div>
              </div>
              <div className={softCard + " p-5"}>
                <h3 className="font-semibold mb-3">Atajos</h3>
                <div className="space-y-2 text-sm">
                  <button
                    onClick={() => setSessionTab("registro")}
                    className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 border"
                  >
                    Registrar sesión
                  </button>
                  <button
                    onClick={() => setSessionTab("bitacora")}
                    className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 border"
                  >
                    Agregar bitácora
                  </button>
                  <button
                    onClick={() => setSessionTab("evidencias")}
                    className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 border"
                  >
                    Subir evidencia
                  </button>
                  <button
                    onClick={() => setSessionTab("tareas")}
                    className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 border"
                  >
                    Asignar tarea
                  </button>
                  <button
                    onClick={() => setSessionTab("materiales")}
                    className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 border"
                  >
                    Ver materiales
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {[
                  ["registro", "Registro"],
                  ["bitacora", "Bitácora"],
                  ["evidencias", "Evidencias"],
                  ["tareas", "Tareas"],
                  ["materiales", "Materiales"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSessionTab(key)}
                    className={tabClass(sessionTab === key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <SessionMainPanel />
            </div>
            <div className="space-y-4">
              <div className={softCard + " p-5"}>
                <h3 className="font-semibold mb-4">Horas</h3>
                <div className="h-28 rounded-2xl bg-slate-50 border flex items-center justify-center text-slate-500">
                  1.5 h en esta sesión
                </div>
              </div>
              <div className={softCard + " p-5"}>
                <h3 className="font-semibold mb-4">Bitácoras recientes</h3>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-xl bg-slate-50 border">
                    Seguimiento: mejorar fluidez oral.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border">
                    Acuerdo: repasar verbos.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (tutorModule === "hours")
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Horas acumuladas</h2>
            <p className="text-sm text-slate-500">
              Consulta horas registradas, validadas y pendientes.
            </p>
          </div>
          <div className={softCard + " p-5"}>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Horas registradas</span>
                <span className="font-semibold">47.5 h</span>
              </div>
              <div className="flex justify-between">
                <span>Horas validadas</span>
                <span className="font-semibold">41 h</span>
              </div>
              <div className="flex justify-between">
                <span>Pendientes</span>
                <span className="font-semibold">6.5 h</span>
              </div>
            </div>
          </div>
          <div className={softCard + " p-5"}>
            <div className="h-72 rounded-2xl bg-slate-50 border flex items-center justify-center text-slate-500">
              Gráfica o historial de horas por sesión
            </div>
          </div>
        </div>
      );
  };

  return (
    <div className="flex min-h-[860px] bg-slate-50">
      <aside className="w-72 bg-white border-r border-slate-200 p-4 space-y-2">
        <button
          onClick={() => setTutorModule("dashboard")}
          className={menuClass(tutorModule === "dashboard")}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>
        <button
          onClick={() => setTutorModule("students")}
          className={menuClass(tutorModule === "students")}
        >
          <Users size={18} />
          Mis alumnos
        </button>
        <button
          onClick={() => setTutorModule("materials")}
          className={menuClass(tutorModule === "materials")}
        >
          <BookOpen size={18} />
          Materiales
        </button>
        <button
          onClick={() => setTutorModule("tasks")}
          className={menuClass(tutorModule === "tasks")}
        >
          <ClipboardList size={18} />
          Tareas y evaluación
        </button>
        <button
          onClick={() => setTutorModule("session")}
          className={menuClass(tutorModule === "session")}
        >
          <FileText size={18} />
          Seguimiento de sesión
        </button>
        <button
          onClick={() => setTutorModule("hours")}
          className={menuClass(tutorModule === "hours")}
        >
          <Clock3 size={18} />
          Horas acumuladas
        </button>
      </aside>
      <main className="flex-1 p-6 space-y-6">{renderContent()}</main>
    </div>
  );
}
