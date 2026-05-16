import React, { useState } from "react";
import "./styles/App.css";

// Vistas modulares
import HomeLogin from "./views/login";
import TutorView from "./views/tutorview";
import OrgView from "./views/orgview";
import StudentView from "./views/studentview";

export default function App() {
  const currentPath = window.location.pathname;
  const openTutorMaterialsFromPath = currentPath === "/tutor/TutorMaterials";

  // Maneja si vemos el Home/Login ("home") o la plataforma en sí ("app")
  const [appScreen, setAppScreen] = useState(openTutorMaterialsFromPath ? "app" : "home");
  // Rol activo del usuario autenticado
  const [roleView, setRoleView] = useState("tutor");

  const shell = "min-h-screen w-full bg-slate-100 text-slate-800";

  const handleLogout = () => {
    localStorage.removeItem("token");
    setRoleView("tutor");
    setAppScreen("home");
  };

  return (
    <div className={shell}>
      <div className="w-full h-full">
        {/* Vista Home / Login fusionada */}
        {appScreen === "home" && (
          <HomeLogin
            setAppScreen={setAppScreen}
            setRoleView={setRoleView}
          />
        )}

        {/* Vista de Plataforma */}
        {appScreen === "app" && (
          <div className="w-full min-h-screen">
            {roleView === "tutor" && (
              <TutorView
                onLogout={handleLogout}
                initialModule={openTutorMaterialsFromPath ? "materials" : "dashboard"}
              />
            )}
            {roleView === "org" && <OrgView onLogout={handleLogout} />}
            {roleView === "student" && (
              <StudentView onLogout={handleLogout} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}