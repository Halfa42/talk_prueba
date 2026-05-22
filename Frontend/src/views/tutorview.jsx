import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import TutorSidebar from "./tutor/TutorSidebar";
import TutorDashboard from "./tutor/TutorDashboard";
import TutorStudents from "./tutor/TutorStudents";
import TutorMaterials from "./tutor/TutorMaterials";
import TutorTasks from "./tutor/TutorTasks";
import TutorSession from "./tutor/TutorSession";
import TutorHours from "./tutor/TutorHours";

export default function TutorView() {
  const navigate = useNavigate();
  const [sessionTab, setSessionTab] = useState("registro");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const softCard = "bg-white rounded-2xl border border-slate-200 shadow-sm";
  const tabClass = (active) =>
    `px-4 py-2 rounded-xl text-sm border transition ${active ? "bg-blue-600 text-white border-blue-600" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`;

  const handleModuleChange = (module) => {
    navigate(`/tutor${module === "dashboard" ? "" : `/${module}`}`);
  };

  const handleOpenStudent = (student, nextTab) => {
  // Map whatever shape TutorStudents passes into what TutorSession expects
  const mapped = {
    id_asignacion: student.id_asignacion,
    name: student.name ?? `${student.nombre ?? ""} ${student.apellido_paterno ?? ""}`.trim(),
    level: student.level ?? student.nivel ?? "",
    status: student.status ?? student.estatus ?? "",
    program: student.program ?? student.idioma ?? "",
  };
  setSelectedStudent(mapped);
  if (nextTab) setSessionTab(nextTab);
  navigate("/tutor/sesiones");
};

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <TutorSidebar />
      <main className="flex-1 p-6 space-y-6">
        <Routes>
          <Route
            path="/"
            element={<TutorDashboard softCard={softCard} onModuleChange={handleModuleChange} />}
          />
          <Route
            path="beneficiarios"
            element={<TutorStudents softCard={softCard} onOpenStudent={handleOpenStudent} />}
          />
          <Route
            path="materiales"
            element={<TutorMaterials softCard={softCard} />}
          />
          <Route
            path="tareas"
            element={<TutorTasks softCard={softCard} />}
          />
          <Route
            path="sesiones"
            element={
              selectedStudent ? (
                <TutorSession
                  softCard={softCard}
                  tabClass={tabClass}
                  sessionTab={sessionTab}
                  setSessionTab={setSessionTab}
                  selectedStudent={selectedStudent}
                  onBackStudents={() => navigate("/tutor/beneficiarios")}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <p className="text-slate-500 text-sm">
                    Selecciona un alumno para iniciar una sesión.
                  </p>
                  <button
                    onClick={() => navigate("/tutor/beneficiarios")}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm"
                  >
                    Ir a Mis alumnos
                  </button>
                </div>
              )
            }
          />
          <Route
            path="horas"
            element={<TutorHours softCard={softCard} />}
          />
        </Routes>
      </main>
    </div>
  );
}