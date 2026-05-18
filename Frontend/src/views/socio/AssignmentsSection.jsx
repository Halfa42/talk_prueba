import React from "react";

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
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Asignación tutor-beneficiario</h2>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <form onSubmit={onSubmit} className={softCard + " p-5"}>
          <h3 className="font-semibold text-lg mb-4">Nueva asignación</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Tutor</label>
              <select
                className={inputClass}
                value={assignmentForm.tutorId}
                onChange={(e) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    tutorId: e.target.value,
                  })
                }
              >
                <option value="">Selecciona tutor</option>
                {simpleTutores.map((tutor) => (
                  <option key={tutor.id_tutor} value={tutor.id_tutor}>
                    {tutor.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Beneficiario</label>
              <select
                className={inputClass}
                value={assignmentForm.beneficiarioId}
                onChange={(e) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    beneficiarioId: e.target.value,
                  })
                }
              >
                <option value="">Selecciona beneficiario</option>
                {simpleBeneficiarios.map((beneficiario) => (
                  <option
                    key={beneficiario.id_beneficiario}
                    value={beneficiario.id_beneficiario}
                  >
                    {beneficiario.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Periodo</label>
              <input
                className={inputClass}
                value={assignmentForm.periodo}
                onChange={(e) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    periodo: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className={labelClass}>Estado</label>
              <select
                className={inputClass}
                value={assignmentForm.estatus}
                onChange={(e) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    estatus: e.target.value,
                  })
                }
              >
                <option value="Activa">Activa</option>
                <option value="No activa">No activa</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Fecha inicio</label>
              <input
                className={inputClass}
                type="date"
                value={assignmentForm.fecha_inicio}
                onChange={(e) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    fecha_inicio: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className={labelClass}>Fecha fin</label>
              <input
                className={inputClass}
                type="date"
                value={assignmentForm.fecha_fin}
                onChange={(e) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    fecha_fin: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white"
          >
            Guardar asignación
          </button>
        </form>

        <div className={softCard + " p-5"}>
          <h3 className="font-semibold text-lg mb-4">Asignaciones activas</h3>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="text-left p-3">Beneficiario</th>
                  <th className="text-left p-3">Tutor</th>
                  <th className="text-left p-3">Periodo</th>
                  <th className="text-left p-3">Estado</th>
                  <th className="text-left p-3">Opciones</th>
                </tr>
              </thead>
              <tbody>
                {asignaciones.map((row) => (
                  <tr
                    key={row.id_asignacion}
                    className="border-t border-slate-200 bg-white"
                  >
                    <td className="p-3">{row.beneficiario}</td>
                    <td className="p-3">{row.tutor}</td>
                    <td className="p-3">{row.periodo || "Sin periodo"}</td>
                    <td className="p-3">{row.estatus}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button className={editButtonClass}>Modificar</button>
                        <button
                          onClick={() => onDelete(row.id_asignacion)}
                          className={deleteButtonClass}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {asignaciones.length === 0 && (
                  <tr>
                    <td className="p-4 text-slate-500" colSpan="5">
                      No hay asignaciones registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}