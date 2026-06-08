import React, { useState } from "react";

export default function TrackingSection({
  softCard,
  seguimientos,
  simpleTutores,
  trackingForm,
  setTrackingForm,
  onSubmit,
  onDelete
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil((seguimientos || []).length / itemsPerPage);
  
  const currentSeguimientos = (seguimientos || []).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className={`${softCard} p-6`}>
        <h2 className="text-xl font-bold mb-4">Registrar Seguimiento</h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-slate-600 mb-2 block">Tutor <span className="text-red-500">*</span></label>
            <select
              className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white"
              value={trackingForm.tutorId}
              onChange={(e) => setTrackingForm({ ...trackingForm, tutorId: e.target.value })}
              required
            >
              <option value="">Selecciona un tutor</option>
              {simpleTutores.map((tutor) => (
                <option key={tutor.id_tutor} value={tutor.id_tutor}>
                  {tutor.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 mb-2 block">Observación <span className="text-red-500">*</span></label>
            <textarea
              className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white resize-none"
              rows={4}
              value={trackingForm.observacion}
              onChange={(e) => setTrackingForm({ ...trackingForm, observacion: e.target.value })}
              placeholder="Escribe la observación aquí..."
              required
            />
          </div>
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Guardar Observación
            </button>
          </div>
        </form>
      </div>

      <div className={`${softCard} p-6`}>
        <h2 className="text-xl font-bold mb-4">Historial de Seguimiento</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-4 font-medium">Fecha</th>
                <th className="p-4 font-medium">Tutor</th>
                <th className="p-4 font-medium w-1/2">Observación</th>
                <th className="p-4 font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentSeguimientos.map((item) => (
                <tr key={item.id_seguimiento} className="hover:bg-slate-50">
                  <td className="p-4">
                    {new Date(item.fecha_registro).toLocaleDateString()}
                  </td>
                  <td className="p-4">{item.tutor}</td>
                  <td className="p-4 text-slate-600">{item.observacion}</td>
                  <td className="p-4 flex justify-center gap-2">
                    <button
                      onClick={() => onDelete(item.id_seguimiento)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {currentSeguimientos.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    No hay registros de seguimiento.
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
    </div>
  );
}