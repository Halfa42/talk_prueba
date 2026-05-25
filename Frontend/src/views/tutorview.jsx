import React, { useState } from "react";
import TutorSidebar from "./tutor/TutorSidebar";
import TutorDashboard from "./tutor/TutorDashboard";
import TutorStudents from "./tutor/TutorStudents";
import TutorMaterials from "./tutor/TutorMaterials";
import TutorTasks from "./tutor/TutorTasks";
import TutorSession from "./tutor/TutorSession";
import TutorHours from "./tutor/TutorHours";
import { initialSelectedStudent } from "./tutor/tutorData";

export default function TutorView({ onLogout }) {
  const [tutorModule, setTutorModule] = useState("dashboard");
  const [sessionTab, setSessionTab] = useState("registro");
  const [selectedStudent, setSelectedStudent] = useState(initialSelectedStudent);

  const softCard = "bg-white rounded-2xl border border-slate-200 shadow-sm";
  const tabClass = (active) =>
    `px-4 py-2 rounded-xl text-sm border transition ${active ? "bg-blue-600 text-white border-blue-600" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`;

  const handleModuleChange = (module) => {
    setTutorModule(module);
  };

  const handleOpenStudent = (student, nextTab) => {
    setSelectedStudent(student);
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