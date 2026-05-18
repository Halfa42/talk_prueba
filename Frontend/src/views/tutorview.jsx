import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom"; // Importamos las rutas
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
    navigate(`/tutor${module === 'dashboard' ? '' : `/${module}`}`);
  };

  const handleOpenStudent = (student, nextTab) => {
    setSelectedStudent(student);
    if (nextTab) {
      setSessionTab(nextTab);
    }
    navigate("/tutor/session");
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
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
              onBackStudents={() => navigate("/tutor/beneficiarios")} 
            />
          } />
          <Route path="horas" element={<TutorHours softCard={softCard} />} />
        </Routes>
      </main>
    </div>
  );
}