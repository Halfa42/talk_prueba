import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ReviewerSidebar from "./reviewer/ReviewerSidebar";
import ReviewerDashboard from "./reviewer/ReviewerDashboard";
import ReviewerBeneficiarios from "./reviewer/ReviewerBeneficiarios";
import ReviewerTutores from "./reviewer/ReviewerTutores";
import ReviewerBitacoras from "./reviewer/ReviewerBitacoras";
import ReviewerReports from "./reviewer/ReviewerReports";

export default function ReviewerView({ onLogout }) {
  const { tab } = useParams();
  const navigate = useNavigate();
  const activeTab = tab || "dashboard";

  const setRevisorModule = (module) => {
    navigate(`/revisor${module ? `/${module}` : ""}`);
  };

  const [beneficiarios, setBeneficiarios] = useState([]);
  const [tutores, setTutores] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [hoursEvidence, setHoursEvidence] = useState([]);
  const [bitacoras, setBitacoras] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  const softCard = "bg-white rounded-2xl border border-slate-200 shadow-sm";

  const loadAllData = async () => {
    try {
      const [resBen, resTut, resAsig, resHrs, resBit] = await Promise.allSettled([
        axios.get("http://localhost:3000/api/org/beneficiarios"),
        axios.get("http://localhost:3000/api/org/tutores"),
        axios.get("http://localhost:3000/api/org/asignaciones"),
        axios.get("http://localhost:3000/api/org/horas-evidencias"),
        axios.get("http://localhost:3000/api/org/bitacoras"),
      ]);

      if (resBen.status === "fulfilled") setBeneficiarios(resBen.value.data);
      if (resTut.status === "fulfilled") setTutores(resTut.value.data);
      if (resAsig.status === "fulfilled") setAsignaciones(resAsig.value.data);
      if (resHrs.status === "fulfilled") setHoursEvidence(resHrs.value.data);
      if (resBit.status === "fulfilled") setBitacoras(resBit.value.data);
    } catch (error) {
      console.error("Error crítico al cargar datos:", error);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (!statusMessage) return;
    const timer = setTimeout(() => {
      setStatusMessage("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [statusMessage]);

  const handleReviewBitacora = async (idBitacora, estatus, tutorId, horas) => {
    try {
      await axios.put(`http://localhost:3000/api/org/bitacoras/${idBitacora}/review`, {
        estatus,
        tutorId,
        horas
      });
      await loadAllData();
      setStatusMessage("✅ Bitácora procesada correctamente.");
    } catch (error) {
      console.error(error);
      setStatusMessage("❌ No se pudo procesar la revisión.");
    }
  };

  const renderContent = () => {
    if (activeTab === "dashboard") {
      return (
        <ReviewerDashboard
          beneficiarios={beneficiarios}
          tutores={tutores}
          asignaciones={asignaciones}
          softCard={softCard}
          bitacoras={bitacoras}
        />
      );
    }
    if (activeTab === "beneficiarios") {
      return <ReviewerBeneficiarios beneficiarios={beneficiarios} softCard={softCard} />;
    }
    if (activeTab === "tutores") {
      return <ReviewerTutores tutores={tutores} softCard={softCard} />;
    }
    if (activeTab === "bitacoras") {
      return (
        <ReviewerBitacoras
          softCard={softCard}
          hoursEvidence={hoursEvidence}
          bitacoras={bitacoras}
          onReviewBitacora={handleReviewBitacora}
        />
      );
    }
    if (activeTab === "reportes") {
      return <ReviewerReports softCard={softCard} setStatusMessage={setStatusMessage} />;
    }
    return (
      <ReviewerDashboard
        beneficiarios={beneficiarios}
        tutores={tutores}
        asignaciones={asignaciones}
        softCard={softCard}
        bitacoras={bitacoras}
      />
    );
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-100">
      <ReviewerSidebar 
        activeTab={activeTab} 
        setRevisorModule={setRevisorModule} 
        onLogout={onLogout} 
      />
      <main className="flex-1 min-h-screen p-6 space-y-6 bg-slate-100">
        {statusMessage && (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium">
            {statusMessage}
          </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
}