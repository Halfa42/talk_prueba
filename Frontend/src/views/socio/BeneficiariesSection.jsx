import React from "react";
import { isActiveStatus } from "./helpers";

export default function BeneficiariesSection({
  beneficiarios,
  softCard,
  editButtonClass,
  deleteButtonClass,
  onCreate,
  onEdit,
  onDelete,
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de beneficiarios</h2>
          <p className="text-sm text-slate-500">
            Consulta información académica, avance y tutor asignado.
          </p>
        </div>
        <button
          onClick={onCreate}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm"
        >
          Nuevo beneficiario
        </button>
      </div>

      <div className={softCard + " p-5"}>
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left p-3">Nombre</th>
                <th className="text-left p-3">Nivel</th>
                <th className="text-left p-3">Tutor</th>
                <th className="text-left p-3">Asistencia</th>
                <th className="text-left p-3">Estado</th>
                <th className="text-left p-3">Opciones</th>
              </tr>
            </thead>
            <tbody>
              {beneficiarios.map((row) => (
                <tr
                  key={row.id_beneficiario}
                  className="border-t border-slate-200 bg-white"
                >
                  <td className="p-3">
                    {row.nombre} {row.apellido_paterno}
                  </td>
                  <td className="p-3">{row.nivel || "Sin nivel"}</td>
                  <td className="p-3">{row.tutor}</td>
                  <td className="p-3">--</td>
                  <td className="p-3">
                    {isActiveStatus(row.estatus) ? "Activa" : "No activa"}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(row)}
                        className={editButtonClass}
                      >
                        Modificar
                      </button>
                      <button
                        onClick={() => onDelete(row.id_beneficiario)}
                        className={deleteButtonClass}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {beneficiarios.length === 0 && (
                <tr>
                  <td className="p-4 text-slate-500" colSpan="6">
                    No hay beneficiarios registrados.
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