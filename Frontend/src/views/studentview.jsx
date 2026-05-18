import React from "react";
import { Routes, Route } from "react-router-dom";

import StudentSidebar from "./student/StudentSidebar";
import StudentDashboard from "./student/StudentDashboard";
import StudentProgress from "./student/StudentProgress";
import StudentMaterials from "./student/StudentMaterials";
import StudentTasks from "./student/StudentTasks";
import StudentClasses from "./student/StudentClasses";
import StudentProfile from "./student/StudentProfile";

export default function StudentView() {
  const softCard = "bg-white rounded-2xl border border-slate-200 shadow-sm";

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <StudentSidebar />
      <main className="flex-1 p-6 space-y-6">
        <Routes>
          <Route path="/" element={<StudentDashboard softCard={softCard} />} />
          <Route path="avance" element={<StudentProgress softCard={softCard} />} />
          <Route path="materiales" element={<StudentMaterials softCard={softCard} />} />
          <Route path="tareas" element={<StudentTasks softCard={softCard} />} />
          <Route path="clases" element={<StudentClasses softCard={softCard} />} />
          <Route path="perfil" element={<StudentProfile softCard={softCard} />} />
        </Routes>
      </main>
    </div>
  );
}