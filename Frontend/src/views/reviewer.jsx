import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, useNavigate } from "react-router-dom";
import ReviewerSidebar from "./reviewer/ReviewerSidebar";

import DashboardSection from "./socio/DashboardSection";
import BeneficiariesSection from "./socio/BeneficiariesSection";
import TutorsSection from "./socio/TutorsSection";
import HoursEvidenceSection from "./socio/HoursEvidenceSection";
import ReportsSection from "./socio/ReportsSection";

export default function ReviewerView({ onLogout }) {
  const navigate = useNavigate();
  const softCard = "bg-white rounded-2xl border border-slate-200 shadow-sm";

  const [beneficiarios, setBeneficiarios] = useState([]);
  const [tutores, setTutores] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [horasEvidencia, setHorasEvidencia] = useState([]);
  const [bitacoras, setBitacoras] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          axios.get("http://localhost:3000/api/org/beneficiarios"),
          axios.get("http://localhost:3000/api/org/tutores"),
          axios.get("http://localhost:3000/api/org/asignaciones"),
          axios.get("http://localhost:3000/api/org/horas-evidencias"),
          axios.get("http://localhost:3000/api/org/bitacoras"),
        ];

        const [resBen, resTut, resAsig, resHoras, resBit] = await Promise.all(endpoints);

        setBeneficiarios(resBen.data);
        setTutores(resTut.data);
        setAsignaciones(resAsig.data);
        setHorasEvidencia(resHoras.data);
        setBitacoras(resBit.data);
      } catch (error) {
        console.error("Error al cargar datos del revisor:", error);
      }
    };
    fetchData();
  }, []);

  const handleReviewBitacora = async (idBitacora, estatus, tutorId, horas) => {
    try {
      await axios.put(`http://localhost:3000/api/org/bitacoras/${idBitacora}/review`, {
        estatus,
        tutorId,
        horas
      });
      const [resHoras, resBit] = await Promise.all([
        axios.get("http://localhost:3000/api/org/horas-evidencias"),
        axios.get("http://localhost:3000/api/org/bitacoras")
      ]);
      setHorasEvidencia(resHoras.data);
      setBitacoras(resBit.data);
    } catch (error) {
      console.error("Error al procesar la revisión:", error);
      alert("Error al guardar la revisión.");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-800 font-sans">
      <ReviewerSidebar onLogout={onLogout} />
      
      <main className="flex-1 overflow-y-auto p-8 lg:px-12 xl:px-16 pb-24 h-screen">
        <Routes>
          <Route
            path="/"
            element={
              <DashboardSection
                beneficiarios={beneficiarios}
                tutores={tutores}
                asignaciones={asignaciones}
                softCard={softCard}
                isReviewer={true} 
              />
            }
          />
          <Route 
            path="beneficiarios" 
            element={
              <BeneficiariesSection 
                beneficiarios={beneficiarios} 
                softCard={softCard} 
                isReviewer={true} 
              />
            } 
          />
          <Route 
            path="tutores" 
            element={
              <TutorsSection 
                tutores={tutores} 
                softCard={softCard} 
                isReviewer={true} 
              />
            } 
          />
          <Route 
            path="bitacoras" 
            element={
              <HoursEvidenceSection 
                hoursEvidence={horasEvidencia}
                bitacoras={bitacoras}
                softCard={softCard}
                onReviewBitacora={handleReviewBitacora}
                isReviewer={true} 
              />
            } 
          />
          <Route 
            path="reportes" 
            element={
              <ReportsSection 
                softCard={softCard} 
                setStatusMessage={() => {}} 
              />
            } 
          />
        </Routes>
      </main>
    </div>
  );
}