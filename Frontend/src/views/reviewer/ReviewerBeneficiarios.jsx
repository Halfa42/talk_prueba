import React, { useState } from "react";

export default function ReviewerBeneficiarios({ beneficiarios, softCard }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil((beneficiarios || []).length / itemsPerPage);
  const currentItems = (beneficiarios || []).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={`${softCard} p-6`}>
      <div className="mb-4">
        <h2 className="text-xl font-bold">Listado de Beneficiarios</h2>
        <p className="text-sm text-slate-500">Consulta de perfiles de alumnos registrados en el sistema.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-4 font-medium">Nombre Completo</th>
              <th className="p-4 font-medium">Correo</th>
              <th className="p-4 font-medium">Matrícula/Folio</th>
              <th className="p-4 font-medium">Nivel</th>
              <th className="p-4 font-medium">Idioma</th>
              <th className="p-4 font-medium">Tutor Asignado</th>
              <th className="p-4 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {currentItems.map((b) => (
              <tr key={b.id_beneficiario} className="hover:bg-slate-50 bg-white">
                <td className="p-4 font-medium">{`${b.nombre} ${b.apellido_paterno} ${b.apellido_materno || ""}`}</td>
                <td className="p-4 text-slate-600">{b.correo}</td>
                <td className="p-4">{b.matricula_folio || "N/A"}</td>
                <td className="p-4 uppercase">{b.nivel}</td>
                <td className="p-4 capitalize">{b.idioma || "N/A"}</td>
                <td className="p-4 text-slate-600">{b.tutor}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    b.estatus === "activo" || b.estatus === "Activa" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"
                  }`}>
                    {b.estatus}
                  </span>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="7" className="p-8 text-center text-slate-500">
                  No hay alumnos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-between items-center p-3 border-t border-slate-200 bg-slate-50">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-white border border-slate-300 rounded text-sm disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-slate-500">
            Página {currentPage} de {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 bg-white border border-slate-300 rounded text-sm disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}