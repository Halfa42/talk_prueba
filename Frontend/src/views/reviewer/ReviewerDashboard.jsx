import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import KpiCard from "../../components/KpiCard";

export default function ReviewerDashboard({
  beneficiarios,
  tutores,
  asignaciones,
  softCard,
  bitacoras
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const bitacorasPendientes = useMemo(() => {
    return (bitacoras || []).filter(b => b.estatus === "sin revisar").length;
  }, [bitacoras]);

  const alumnosIncidencias = useMemo(() => {
    const counts = {};
    (bitacoras || []).forEach(b => {
      if (b.tipo === "incidencia" && b.tutor) {
        counts[b.tutor] = (counts[b.tutor] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .filter(([_, count]) => count >= 3)
      .map(([name, count]) => ({ nombre: name, total_incidencias: count }));
  }, [bitacoras]);

  const totalPages = Math.ceil((asignaciones || []).length / itemsPerPage);
  
  const currentAsignaciones = (asignaciones || []).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const showIncidenciasAlert = () => {
    if (alumnosIncidencias.length === 0) return;
    const detalle = alumnosIncidencias
      .map(a => `- ${a.nombre} (${a.total_incidencias} incidencias)`)
      .join("\n");
    alert(`Tutores con múltiples incidencias registradas:\n\n${detalle}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <KpiCard
          title="Beneficiarios activos"
          value={(beneficiarios || []).filter((b) => b.estatus === "activo" || b.estatus === "Activa").length}
        />
        <KpiCard
          title="Tutores activos"
          value={(tutores || []).filter((t) => t.estatus === "activo" || t.estatus === "Activa").length}
        />
        <KpiCard
          title="Bitácoras sin revisar"
          value={bitacorasPendientes}
        />
      </div>

      <div className={softCard + " p-5"}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Asignaciones recientes</h2>
            <p className="text-sm text-slate-500">Vista de consulta de las asignaciones registradas en el sistema.</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left p-3">Beneficiario</th>
                <th className="text-left p-3">Tutor</th>
                <th className="text-left p-3">Nivel</th>
                <th className="text-left p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {currentAsignaciones.map((item) => (
                <tr
                  key={item.id_asignacion}
                  className="border-t border-slate-200 bg-white"
                >
                  <td className="p-3">{item.beneficiario}</td>
                  <td className="p-3">{item.tutor}</td>
                  <td className="p-3">{item.nivel}</td>
                  <td className="p-3">{item.estatus}</td>
                </tr>
              ))}
              {currentAsignaciones.length === 0 && (
                <tr>
                  <td className="p-4 text-slate-500" colSpan="4">
                    No hay asignaciones registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          <div className="flex justify-between items-center p-3 border-t border-slate-200 bg-slate-50">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white border border-slate-300 rounded text-sm disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-slate-500">
              Página {currentPage} de {totalPages || 1}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 bg-white border border-slate-300 rounded text-sm disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      <div className={softCard + " p-5"}>
        <h3 className="font-semibold text-lg mb-4">Alertas operativas</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          {alumnosIncidencias.length > 0 ? (
            <div 
              onClick={showIncidenciasAlert}
              className="p-4 rounded-2xl bg-red-50 border border-red-200 cursor-pointer hover:bg-red-100 transition-colors"
            >
              <span className="font-semibold text-red-700">Atención:</span> Hay {alumnosIncidencias.length} tutor(es) con 3 o más incidencias. (Clic para ver detalles)
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700">
              No hay incidencias acumuladas críticas.
            </div>
          )}

          {bitacorasPendientes > 0 ? (
            <div 
              onClick={() => navigate("/revisor/bitacoras")}
              className="p-4 rounded-2xl bg-amber-50 border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors"
            >
              <span className="font-semibold text-amber-700">Pendiente:</span> {bitacorasPendientes} bitácoras sin revisar. (Clic para ir a Bitácoras)
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700">
              Todas las bitácoras han sido revisadas.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}