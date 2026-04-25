import React, { useState } from "react";
import "./styles/App.css";

// Vistas modulares
import HomeLogin from "./views/login";
import TutorView from "./views/tutorview";
import OrgView from "./views/orgview";
import StudentView from "./views/studentview";

export default function App() {
  // Maneja si vemos el Home/Login ("home") o la plataforma en sí ("app")
  const [appScreen, setAppScreen] = useState("home");
  // Maneja el rol global para la demo
  const [roleView, setRoleView] = useState("tutor");

  const shell = "min-h-screen bg-slate-100 text-slate-800 p-6";
  const card = "bg-white rounded-3xl shadow-sm border border-slate-200";
  const topSelector = (active) =>
    `px-4 py-2 rounded-2xl text-sm border transition ${active ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`;

  return (
    <div className={shell}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Vista Home / Login fusionada */}
        {appScreen === "home" && (
          <HomeLogin 
            setAppScreen={setAppScreen} 
            roleView={roleView} 
            setRoleView={setRoleView} 
          />
        )}

        {/* Vista de Plataforma */}
        {appScreen === "app" && (
          <>
            {/* Selector de Roles solo visible en el entorno "app"*/}
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setRoleView("tutor")} className={topSelector(roleView === "tutor")}>Vista Tutor</button>
              <button onClick={() => setRoleView("org")} className={topSelector(roleView === "org")}>Vista Organización</button>
              <button onClick={() => setRoleView("student")} className={topSelector(roleView === "student")}>Vista Beneficiario</button>
            </div>

            <div className={card + " overflow-hidden"}>
              {roleView === "tutor" && <TutorView />}
              {roleView === "org" && <OrgView />}
              {roleView === "student" && <StudentView />}
            </div>
          </>
        )}

      </div>
    </div>
  );
}