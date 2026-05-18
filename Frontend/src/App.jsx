import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/App.css";

import HomeLogin from "./views/login";
import TutorView from "./views/tutorview";
import OrgView from "./views/orgview";
import StudentView from "./views/studentview";

const RutaProtegida = ({ children, rolPermitido }) => {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  if (!token) return <Navigate to="/" replace />;
  if (rolPermitido && rol !== rolPermitido) return <Navigate to="/" replace />;

  return children;
};

export default function App() {
  const shell = "min-h-screen w-full bg-slate-100 text-slate-800";

  return (
    <div className={shell}>
      <div className="w-full h-full">
        <BrowserRouter>
          <Routes>
            {/* Login */}
            <Route path="/" element={<HomeLogin />} />

            {/* Rutas Privadas */}
            <Route 
              path="/tutor/*" 
              element={
                <RutaProtegida rolPermitido="tutor">
                  <TutorView />
                </RutaProtegida>
              } 
            />
            
            <Route 
              path="/org/*" 
              element={
                <RutaProtegida rolPermitido="socio_formador">
                  <OrgView />
                </RutaProtegida>
              } 
            />
            
            <Route 
              path="/estudiante/*" 
              element={
                <RutaProtegida rolPermitido="beneficiario">
                  <StudentView />
                </RutaProtegida>
              } 
            />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}