import React, { useEffect, useState } from "react";
import KpiCard from "../../components/kpicard";
import { Users, UserCheck, FileText } from "lucide-react";
import "../../styles/reviewer/ReviewerDashboard.css";

const API_BASE = "http://localhost:3000/api";

const quickActions = [
  ["beneficiarios", "Beneficiarios", "Revisa los perfiles.",           Users],
  ["tutores",       "Tutores",        "Consulta tutores activos.",      UserCheck],
  ["bitacoras",     "Bitácoras",      "Revisa entradas pendientes.",    FileText],
];

export default function ReviewerDashboard({ softCard, onModuleChange }) {
  const [stats,   setStats]   = useState({ beneficiarios: 0, tutores: 0, bitacoras: 0 });
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const [beneficiariosRes, tutoresRes, bitacorasRes] = await Promise.all([
          fetch(`${API_BASE}/org/beneficiarios-simple`),
          fetch(`${API_BASE}/org/tutores-simple`),
          fetch(`${API_BASE}/bitacoras/pendientes`),
        ]);

        if (!beneficiariosRes.ok) throw new Error("No se pudieron cargar los beneficiarios");
        if (!tutoresRes.ok)       throw new Error("No se pudieron cargar los tutores");
        if (!bitacorasRes.ok)     throw new Error("No se pudieron cargar las bitácoras pendientes");

        const beneficiarios = await beneficiariosRes.json();
        const tutores       = await tutoresRes.json();
        const bitacoras     = await bitacorasRes.json();

        setStats({
          beneficiarios: Array.isArray(beneficiarios) ? beneficiarios.length : 0,
          tutores:       Array.isArray(tutores)       ? tutores.length       : 0,
          bitacoras:     Array.isArray(bitacoras)     ? bitacoras.length     : 0,
        });
      } catch (err) {
        setError(err.message || "Error al cargar datos del dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="dashboard-wrapper">

      {/* Error alert */}
      {error && (
        <div className="alert-error">{error}</div>
      )}

      {/* KPI cards */}
      <div className="kpi-grid">
        <KpiCard title="Beneficiarios"        value={loading ? "Cargando..." : String(stats.beneficiarios)} />
        <KpiCard title="Tutores"              value={loading ? "Cargando..." : String(stats.tutores)}       />
        <KpiCard title="Bitácoras pendientes" value={loading ? "Cargando..." : String(stats.bitacoras)}     />
      </div>

      {/* Review panel */}
      <div className={`panel-card ${softCard ?? ""}`}>
        <div className="panel-header">
          <div>
            <h2>Panel de revisión</h2>
            <p>Accesos rápidos para revisar beneficiarios, tutores y bitácoras.</p>
          </div>
        </div>

        <div className="quick-actions-grid">
          {quickActions.map(([key, title, description, Icon]) => (
            <button
              key={key}
              type="button"
              className="quick-action-btn"
              onClick={() => onModuleChange(key)}
            >
              <Icon className="quick-action-icon" size={18} />
              <div className="quick-action-title">{title}</div>
              <div className="quick-action-description">{description}</div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}