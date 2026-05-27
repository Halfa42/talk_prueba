import React from "react";

export default function HoursEvidenceSection({
  softCard,
  hoursEvidence,
  editButtonClass,
  deleteButtonClass,
  onCreate,
  onEdit,
  onDelete,
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Horas y evidencias</h2>

        <button
          onClick={onCreate}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm"
        >
          Nuevo registro
        </button>
      </div>

      <div className={softCard + " p-5"}>
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left p-3">Tutor</th>
                <th className="text-left p-3">Horas</th>
                <th className="text-left p-3">Sesiones</th>
                <th className="text-left p-3">Estado</th>
                <th className="text-left p-3">Opciones</th>
              </tr>
            </thead>
            <tbody>
              {hoursEvidence.map((row) => (
                <tr
                  key={row.id_registro}
                  className="border-t border-slate-200 bg-white"
                >
                  <td className="p-3">{row.tutor}</td>
                  <td className="p-3">{Number(row.horas || 0).toFixed(2)} h</td>
                  <td className="p-3">{row.sesiones}</td>
                  <td className="p-3">{row.estado}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(row)}
                        className={editButtonClass}
                      >
                        Modificar
                      </button>
                      <button
                        onClick={() => onDelete(row.id_registro)}
                        className={deleteButtonClass}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {hoursEvidence.length === 0 && (
                <tr>
                  <td className="p-4 text-slate-500" colSpan="5">
                    No hay registros de horas y evidencias.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}