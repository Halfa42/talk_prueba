import React, { useState } from "react";
import TutorSidebar from "./tutor/TutorSidebar";
import TutorDashboard from "./tutor/TutorDashboard";
import TutorStudents from "./tutor/TutorStudents";
import TutorMaterials from "./tutor/TutorMaterials";
import TutorTasks from "./tutor/TutorTasks";
import TutorSession from "./tutor/TutorSession";
import TutorHours from "./tutor/TutorHours";

export default function TutorView({ onLogout, initialModule = "dashboard" }) {
  const [tutorModule, setTutorModule] = useState(initialModule);
  const [sessionTab, setSessionTab] = useState("registro");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const softCard = "bg-white rounded-2xl border border-slate-200 shadow-sm";
  const tabClass = (active) =>
    `px-4 py-2 rounded-xl text-sm border transition ${active ? "bg-blue-600 text-white border-blue-600" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`;

  const handleModuleChange = (module) => {
    setTutorModule(module);
  };

  const handleOpenStudent = (student, nextTab) => {
    const mapped = {
      id_asignacion: student.id_asignacion,
      name: `${student.nombre} ${student.apellido_paterno}`,
      level: student.nivel,
      status: student.estatus,
      attendance: "N/A",
      program: student.idioma,
      diagnostic: student.nivel,
      current: student.nivel,
    };
    setSelectedStudent(mapped);
    setTutorModule("session");
    if (nextTab) {
      setSessionTab(nextTab);
    }
  };

  const renderContent = () => {
    if (tutorModule === "dashboard") {
      return <TutorDashboard softCard={softCard} onModuleChange={handleModuleChange} />;
    }

    if (tutorModule === "students") {
      return <TutorStudents softCard={softCard} onOpenStudent={handleOpenStudent} />;
    }

    if (tutorModule === "materials") {
      return <TutorMaterials softCard={softCard} />;
    }

    if (tutorModule === "tasks") {
      return <TutorTasks softCard={softCard} />;
    }

    if (tutorModule === "session") {
      if (!selectedStudent?.id_asignacion) {
        return (
          <div className={softCard + " p-6"}>
            <h3 className="text-lg font-semibold">Selecciona un alumno</h3>
            <p className="text-sm text-slate-600 mt-2">
              Para abrir Seguimiento de sesión primero elige un alumno desde el módulo de alumnos.
            </p>
            <button
              onClick={() => setTutorModule("students")}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm"
            >
              Ir a alumnos
            </button>
          </div>
        );
      }

      return (
        <TutorSession
          softCard={softCard}
          tabClass={tabClass}
          sessionTab={sessionTab}
          setSessionTab={setSessionTab}
          selectedStudent={selectedStudent}
          onBackStudents={() => setTutorModule("students")}
        />
      );
    }

    if (tutorModule === "hours") {
      return <TutorHours softCard={softCard} />;
    }

    return null;
  };

  return (
    <div className="flex min-h-[860px] bg-slate-50">
      <TutorSidebar
        tutorModule={tutorModule}
        onModuleChange={handleModuleChange}
        onLogout={onLogout}
      />
      <main className="flex-1 p-6 space-y-6">{renderContent()}</main>
    </div>
  );
}
