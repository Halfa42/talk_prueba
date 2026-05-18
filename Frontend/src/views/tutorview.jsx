import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom"; // Importamos las rutas
import TutorSidebar from "./tutor/TutorSidebar";
import TutorDashboard from "./tutor/TutorDashboard";
import TutorStudents from "./tutor/TutorStudents";
import TutorMaterials from "./tutor/TutorMaterials";
import TutorTasks from "./tutor/TutorTasks";
import TutorSession from "./tutor/TutorSession";
import TutorHours from "./tutor/TutorHours";
import { initialSelectedStudent } from "./tutor/tutorData";

export default function TutorView() {
  const navigate = useNavigate();
  
  // Mantenemos tus estados originales para el manejo del estudiante y la sesión
  const [sessionTab, setSessionTab] = useState("registro");
  const [selectedStudent, setSelectedStudent] = useState(initialSelectedStudent);

  // Tus clases de diseño originales
  const softCard = "bg-white rounded-2xl border border-slate-200 shadow-sm";
  const tabClass = (active) =>
    `px-4 py-2 rounded-xl text-sm border transition ${active ? "bg-blue-600 text-white border-blue-600" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`;

  // En lugar de setTutorModule, navegamos a la URL correspondiente
  const handleModuleChange = (module) => {
    navigate(`/tutor${module === 'dashboard' ? '' : `/${module}`}`);
  };

  const handleOpenStudent = (student, nextTab) => {
    setSelectedStudent(student);
    if (nextTab) {
      setSessionTab(nextTab);
    }
    // Redirigimos a la pestaña de sesión
    navigate("/tutor/session");
  };

  return (
    <div className="flex min-h-[860px] bg-slate-50">
      {/* Ya no necesitamos pasarle variables a la Sidebar porque usa sus propias rutas */}
      <TutorSidebar />
      <main className="flex-1 p-6 space-y-6">
        <Routes>
          <Route path="/" element={<TutorDashboard softCard={softCard} onModuleChange={handleModuleChange} />} />
          <Route path="beneficiarios" element={<TutorStudents softCard={softCard} onOpenStudent={handleOpenStudent} />} />
          <Route path="materiales" element={<TutorMaterials softCard={softCard} />} />
          <Route path="tareas" element={<TutorTasks softCard={softCard} />} />
          <Route path="sesiones" element={
            <TutorSession
              softCard={softCard}
              tabClass={tabClass}
              sessionTab={sessionTab}
              setSessionTab={setSessionTab}
              selectedStudent={selectedStudent}
              onBackStudents={() => navigate("/tutor/beneficiarios")} // Volvemos a cambiar el setTutorModule por navigate
            />
          } />
          <Route path="horas" element={<TutorHours softCard={softCard} />} />
        </Routes>
      </main>
    </div>
  );
}