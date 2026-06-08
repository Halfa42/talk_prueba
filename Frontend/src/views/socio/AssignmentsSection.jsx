import React, { useState, useMemo, useEffect } from "react";

export default function AssignmentsSection({
  softCard,
  inputClass,
  labelClass,
  assignmentForm,
  setAssignmentForm,
  simpleTutores,
  simpleBeneficiarios,
  asignaciones,
  editButtonClass,
  deleteButtonClass,
  onSubmit,
  onDelete,
  onEdit,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [filterIdioma, setFilterIdioma] = useState("");
  const [filterPeriodo, setFilterPeriodo] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [filterIdioma, filterPeriodo]);

  const handleTutorChange = (e) => {
    const selectedId = e.target.value;
    const tutor = simpleTutores.find((t) => String(t.id_tutor) === selectedId);
    
    if (tutor) {
      setAssignmentForm({
        ...assignmentForm,
        tutorId: selectedId,
        idioma: tutor.idioma || assignmentForm.idioma,
        periodo: tutor.periodo || assignmentForm.periodo,
      });
    } else {
      setAssignmentForm({ ...assignmentForm, tutorId: selectedId });
    }
  };

  const handleBeneficiaryChange = (e) => {
    const selectedId = e.target.value;
    const beneficiario = simpleBeneficiarios.find(
      (b) => String(b.id_beneficiario) === selectedId
    );
    
    if (beneficiario) {
      setAssignmentForm({
        ...assignmentForm,
        beneficiarioId: selectedId,
        idioma: beneficiario.idioma || assignmentForm.idioma,
      });
    } else {
      setAssignmentForm({ ...assignmentForm, beneficiarioId: selectedId });
    }
  };

  const filteredTutores = useMemo(() => {
    return simpleTutores.filter((t) => {
      if (assignmentForm.idioma && t.idioma && t.idioma !== assignmentForm.idioma) return false;
      if (assignmentForm.periodo && t.periodo && t.periodo !== assignmentForm.periodo) return false;
      return true;
    });
  }, [simpleTutores, assignmentForm.idioma, assignmentForm.periodo]);

  const filteredBeneficiarios = useMemo(() => {
    return simpleBeneficiarios.filter((b) => {
      if (assignmentForm.idioma && b.idioma && b.idioma !== assignmentForm.idioma) return false;
      return true;
    });
  }, [simpleBeneficiarios, assignmentForm.idioma]);

  const filteredTableAsignaciones = useMemo(() => {
    return (asignaciones || []).filter((asig) => {
      const matchIdioma = filterIdioma ? asig.idioma === filterIdioma : true;
      const matchPeriodo = filterPeriodo ? asig.periodo === filterPeriodo : true;
      return matchIdioma && matchPeriodo;
    });
  }, [asignaciones, filterIdioma, filterPeriodo]);

  const totalPages = Math.ceil(filteredTableAsignaciones.length / itemsPerPage);
  
  const currentAsignaciones = filteredTableAsignaciones.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="flex flex-col gap-6">
      
      <div className={`${softCard} p-6`}>
        <h2 className="text-xl font-bold mb-4">Nueva Asignación</h2>
        <form onSubmit={onSubmit} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div>
            <label className={labelClass}>Tutor <span className="text-red-500">*</span></label>
            <select
              className={inputClass}
              value={assignmentForm.tutorId}
              onChange={handleTutorChange}
              required
            >
              <option value="">Selecciona un tutor</option>
              {filteredTutores.map((t) => (
                <option key={t.id_tutor} value={t.id_tutor}>
                  {t.nombre} {t.idioma ? `(${t.idioma})` : ""} {t.periodo ? `- ${t.periodo}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Beneficiario <span className="text-red-500">*</span></label>
            <select
              className={inputClass}
              value={assignmentForm.beneficiarioId}
              onChange={handleBeneficiaryChange}
              required
            >
              <option value="">Selecciona un beneficiario</option>
              {filteredBeneficiarios.map((b) => (
                <option key={b.id_beneficiario} value={b.id_beneficiario}>
                  {b.nombre} {b.idioma ? `(${b.idioma})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Idioma <span className="text-red-500">*</span></label>
            <select
              className={inputClass}
              value={assignmentForm.idioma}
              onChange={(e) =>
                setAssignmentForm({ ...assignmentForm, idioma: e.target.value })
              }
              required
            >
              <option value="">Selecciona idioma</option>
              <option value="ingles">Inglés</option>
              <option value="frances">Francés</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Periodo <span className="text-red-500">*</span></label>
            <select
              className={inputClass}
              value={assignmentForm.periodo}
              onChange={(e) =>
                setAssignmentForm({ ...assignmentForm, periodo: e.target.value })
              }
              required
            >
              <option value="">Selecciona periodo</option>
              <option value="Enero-Junio">Enero-Junio</option>
              <option value="Verano">Verano</option>
              <option value="Agosto-Diciembre">Agosto-Diciembre</option>
              <option value="Invierno">Invierno</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Fecha de inicio</label>
            <input
              type="date"
              className={inputClass}
              value={assignmentForm.fecha_inicio}
              onChange={(e) =>
                setAssignmentForm({ ...assignmentForm, fecha_inicio: e.target.value })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Fecha de fin</label>
            <input
              type="date"
              className={inputClass}
              value={assignmentForm.fecha_fin}
              onChange={(e) =>
                setAssignmentForm({ ...assignmentForm, fecha_fin: e.target.value })
              }
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3 flex justify-end mt-2">
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Crear asignación
            </button>
          </div>
        </form>
      </div>

      <div className={`${softCard} p-6`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <h2 className="text-xl font-bold">Asignaciones Activas</h2>
          <div className="flex flex-col md:flex-row gap-3">
            <select
              className={`${inputClass} !py-2 !px-3 !text-sm`}
              value={filterIdioma}
              onChange={(e) => setFilterIdioma(e.target.value)}
            >
              <option value="">Todos los idiomas</option>
              <option value="ingles">Inglés</option>
              <option value="frances">Francés</option>
            </select>

            <select
              className={`${inputClass} !py-2 !px-3 !text-sm`}
              value={filterPeriodo}
              onChange={(e) => setFilterPeriodo(e.target.value)}
            >
              <option value="">Todos los periodos</option>
              <option value="Enero-Junio">Enero-Junio</option>
              <option value="Verano">Verano</option>
              <option value="Agosto-Diciembre">Agosto-Diciembre</option>
              <option value="Invierno">Invierno</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-4 font-medium">Tutor</th>
                <th className="p-4 font-medium">Beneficiario</th>
                <th className="p-4 font-medium">Idioma</th>
                <th className="p-4 font-medium">Periodo</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentAsignaciones.map((asig) => (
                <tr key={asig.id_asignacion} className="hover:bg-slate-50">
                  <td className="p-4">{asig.tutor}</td>
                  <td className="p-4">{asig.beneficiario}</td>
                  <td className="p-4 capitalize">{asig.idioma}</td>
                  <td className="p-4">{asig.periodo}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${asig.estatus === "Activa" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}`}>
                      {asig.estatus}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(asig)}
                      className={editButtonClass}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(asig.id_asignacion)}
                      className={deleteButtonClass}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {currentAsignaciones.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    No hay asignaciones que coincidan con los filtros.
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