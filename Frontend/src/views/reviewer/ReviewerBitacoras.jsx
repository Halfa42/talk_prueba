import React, { useState } from "react";

export default function ReviewerBitacoras({
  softCard,
  hoursEvidence,
  bitacoras,
  onReviewBitacora
}) {
  const [pageEvidencias, setPageEvidencias] = useState(1);
  const [pageBitacoras, setPageBitacoras] = useState(1);
  const itemsPerPage = 5;

  const totalPagesEvidencias = Math.ceil((hoursEvidence || []).length / itemsPerPage);
  const currentEvidencias = (hoursEvidence || []).slice(
    (pageEvidencias - 1) * itemsPerPage,
    pageEvidencias * itemsPerPage
  );

  const totalPagesBitacoras = Math.ceil((bitacoras || []).length / itemsPerPage);
  const currentBitacoras = (bitacoras || []).slice(
    (pageBitacoras - 1) * itemsPerPage,
    pageBitacoras * itemsPerPage
  );

  const [selectedBitacora, setSelectedBitacora] = useState(null);
  const [reviewStatus, setReviewStatus] = useState("");

  const openBitacoraModal = (bitacora) => {
    setSelectedBitacora(bitacora);
    setReviewStatus("");
  };

  const closeBitacoraModal = () => {
    setSelectedBitacora(null);
    setReviewStatus("");
  };

  const handleSaveReview = () => {
    if (!reviewStatus) return;
    onReviewBitacora(
      selectedBitacora.id_bitacora,
      reviewStatus,
      selectedBitacora.id_tutor,
      selectedBitacora.horas_calculadas
    );
    closeBitacoraModal();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className={`${softCard} p-6`}>
        <div className="mb-4">
          <h2 className="text-xl font-bold">Horas y Evidencias Acumuladas</h2>
          <p className="text-sm text-slate-500">Consulta de horas totales acumuladas y validadas por tutor.</p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-4 font-medium">Fecha de Registro</th>
                <th className="p-4 font-medium">Tutor</th>
                <th className="p-4 font-medium">Horas</th>
                <th className="p-4 font-medium">Sesiones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentEvidencias.map((item) => (
                <tr key={item.id_registro} className="hover:bg-slate-50 bg-white">
                  <td className="p-4">
                    {new Date(item.fecha_registro).toLocaleDateString()}
                  </td>
                  <td className="p-4">{item.tutor}</td>
                  <td className="p-4 font-semibold text-blue-600">{item.horas}</td>
                  <td className="p-4">{item.sesiones}</td>
                </tr>
              ))}
              {currentEvidencias.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    No hay registros de horas acumuladas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center p-3 border-t border-slate-200 bg-slate-50">
            <button
              onClick={() => setPageEvidencias((p) => Math.max(1, p - 1))}
              disabled={pageEvidencias === 1}
              className="px-3 py-1 bg-white border border-slate-300 rounded text-sm disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-slate-500">
              Página {pageEvidencias} de {totalPagesEvidencias || 1}
            </span>
            <button
              onClick={() => setPageEvidencias((p) => Math.min(totalPagesEvidencias, p + 1))}
              disabled={pageEvidencias === totalPagesEvidencias || totalPagesEvidencias === 0}
              className="px-3 py-1 bg-white border border-slate-300 rounded text-sm disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      <div className={`${softCard} p-6`}>
        <h2 className="text-xl font-bold mb-4">Revisión de Bitácoras</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-4 font-medium">Tutor</th>
                <th className="p-4 font-medium">Tipo de Registro</th>
                <th className="p-4 font-medium">Horas Calculadas</th>
                <th className="p-4 font-medium">Estatus</th>
                <th className="p-4 font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentBitacoras.map((b) => (
                <tr key={b.id_bitacora} className="hover:bg-slate-50 bg-white">
                  <td className="p-4">{b.tutor}</td>
                  <td className="p-4 capitalize">{b.tipo}</td>
                  <td className="p-4 font-semibold">{b.horas_calculadas} h</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize 
                      ${b.estatus === "sin revisar" ? "bg-amber-100 text-amber-700" : 
                        b.estatus === "aceptada" ? "bg-green-100 text-green-700" : 
                        "bg-red-100 text-red-700"}`}
                    >
                      {b.estatus === "sin revisar" ? "Pendiente" : b.estatus}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button
                      onClick={() => openBitacoraModal(b)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition bg-blue-100 text-blue-700 hover:bg-blue-200"
                    >
                      Detalles
                    </button>
                  </td>
                </tr>
              ))}
              {currentBitacoras.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    No hay bitácoras registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center p-3 border-t border-slate-200 bg-slate-50">
            <button
              onClick={() => setPageBitacoras((p) => Math.max(1, p - 1))}
              disabled={pageBitacoras === 1}
              className="px-3 py-1 bg-white border border-slate-300 rounded text-sm disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-slate-500">
              Página {pageBitacoras} de {totalPagesBitacoras || 1}
            </span>
            <button
              onClick={() => setPageBitacoras((p) => Math.min(totalPagesBitacoras, p + 1))}
              disabled={pageBitacoras === totalPagesBitacoras || totalPagesBitacoras === 0}
              className="px-3 py-1 bg-white border border-slate-300 rounded text-sm disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {selectedBitacora && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Detalles de la Bitácora</h3>
              <button
                onClick={closeBitacoraModal}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                Cerrar
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <p className="text-sm text-slate-500 font-medium">Tutor</p>
                <p className="text-slate-800 font-semibold">{selectedBitacora.tutor}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Fecha de Sesión</p>
                  <p className="text-slate-800">{new Date(selectedBitacora.fecha_sesion).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Horas Calculadas</p>
                  <p className="text-slate-800 font-semibold">{selectedBitacora.horas_calculadas} h</p>
                </div>
              </div>

              {selectedBitacora.tema_bitacora && (
                <div>
                  <p className="text-sm text-slate-500 font-medium">Tema / Actividad</p>
                  <p className="text-slate-800">{selectedBitacora.tema_bitacora}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-slate-500 font-medium">Descripción</p>
                <p className="text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100 mt-1">
                  {selectedBitacora.descripcion || "Sin descripción"}
                </p>
              </div>

              {selectedBitacora.planeacion_siguiente_sesion && (
                <div>
                  <p className="text-sm text-slate-500 font-medium">Planeación de la Siguiente Sesión</p>
                  <p className="text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100 mt-1">
                    {selectedBitacora.planeacion_siguiente_sesion}
                  </p>
                </div>
              )}

              {selectedBitacora.tareas_asignadas && (
                <div>
                  <p className="text-sm text-slate-500 font-medium">Tareas Asignadas</p>
                  <p className="text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100 mt-1">
                    {selectedBitacora.tareas_asignadas}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-2">
                <p className="text-sm text-slate-500 font-medium">Evidencias Adjuntas</p>
                <div className="flex flex-wrap gap-3">
                  {selectedBitacora.tiene_recordatorio && (
                    <a
                      href={`http://localhost:3000/api/org/bitacoras/${selectedBitacora.id_bitacora}/imagen/recordatorio`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition text-center flex-1"
                    >
                      Ver Recordatorio
                    </a>
                  )}
                  {selectedBitacora.tiene_sesion && (
                    <a
                      href={`http://localhost:3000/api/org/bitacoras/${selectedBitacora.id_bitacora}/imagen/sesion`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition text-center flex-1"
                    >
                      Ver Sesión
                    </a>
                  )}
                  {selectedBitacora.tiene_incidencia && (
                    <a
                      href={`http://localhost:3000/api/org/bitacoras/${selectedBitacora.id_bitacora}/imagen/incidencia`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition text-center flex-1"
                    >
                      Ver Incidencia
                    </a>
                  )}
                  {!selectedBitacora.tiene_recordatorio && !selectedBitacora.tiene_sesion && !selectedBitacora.tiene_incidencia && (
                    <span className="text-sm text-slate-400 italic">No hay archivos adjuntos en esta bitácora.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50">
              {selectedBitacora.estatus === "sin revisar" ? (
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-medium text-slate-700">Decisión de Revisión:</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="review" 
                        value="aceptada" 
                        checked={reviewStatus === "aceptada"}
                        onChange={(e) => setReviewStatus(e.target.value)}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="text-sm font-medium text-green-700">Aprobar Bitácora</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="review" 
                        value="rechazada" 
                        checked={reviewStatus === "rechazada"}
                        onChange={(e) => setReviewStatus(e.target.value)}
                        className="w-4 h-4 text-red-600"
                      />
                      <span className="text-sm font-medium text-red-700">Rechazar Bitácora</span>
                    </label>
                  </div>
                  <button
                    onClick={handleSaveReview}
                    disabled={!reviewStatus}
                    className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium disabled:opacity-50 hover:bg-blue-700 transition"
                  >
                    Guardar Revisión
                  </button>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-sm text-slate-500 font-medium">Esta bitácora ya fue procesada como:</p>
                  <p className={`text-base font-bold capitalize mt-1 ${selectedBitacora.estatus === "aceptada" ? "text-green-600" : "text-red-600"}`}>
                    {selectedBitacora.estatus}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}