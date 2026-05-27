import React, { useMemo, useState } from "react";
import {
  fieldClass,
  hasRequiredError,
  labelClass,
  requiredTextClass,
} from "./formUtils";

export default function AssignmentsSection({
  softCard,
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
  const [showValidation, setShowValidation] = useState(false);

  const errors = useMemo(() => {
    return {
      tutorId: hasRequiredError(showValidation, assignmentForm.tutorId),
      beneficiarioId: hasRequiredError(
        showValidation,
        assignmentForm.beneficiarioId
      ),
      idioma: hasRequiredError(showValidation, assignmentForm.idioma),
      periodo: hasRequiredError(showValidation, assignmentForm.periodo),
    };
  }, [showValidation, assignmentForm]);

  const hasErrors = Object.values(errors).some(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowValidation(true);

    if (hasErrors) return;

    try {
      await onSubmit(e);
      setShowValidation(false);
    } catch (error) {}
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Asignación tutor-beneficiario</h2>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className={softCard + " p-5"}>
          <h3 className="font-semibold text-lg mb-4">Nueva asignación</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              {errors.tutorId && (
                <span className={requiredTextClass()}>Campo obligatorio</span>
              )}
              <label className={labelClass()}>
                Tutor <span className="text-red-500">*</span>
              </label>
              <select
                className={fieldClass(errors.tutorId)}
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
              {errors.beneficiarioId && (
                <span className={requiredTextClass()}>Campo obligatorio</span>
              )}
              <label className={labelClass()}>
                Beneficiario <span className="text-red-500">*</span>
              </label>
              <select
                className={fieldClass(errors.beneficiarioId)}
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
              {errors.idioma && (
                <span className={requiredTextClass()}>Campo obligatorio</span>
              )}
              <label className={labelClass()}>
                Idioma <span className="text-red-500">*</span>
              </label>
              <select
                className={fieldClass(errors.idioma)}
                value={assignmentForm.idioma}
                onChange={(e) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    idioma: e.target.value,
                  })
                }
              >
                <option value="">Selecciona idioma</option>
                <option value="ingles">Inglés</option>
                <option value="frances">Francés</option>
              </select>
            </div>

            <div>
              <label className={labelClass()}>Estado</label>
              <select
                className={fieldClass(false)}
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
              {errors.periodo && (
                <span className={requiredTextClass()}>Campo obligatorio</span>
              )}
              <label className={labelClass()}>
                Periodo <span className="text-red-500">*</span>
              </label>
              <select
                className={fieldClass(errors.periodo)}
                value={assignmentForm.periodo}
                onChange={(e) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    periodo: e.target.value,
                  })
                }
              >
                <option value="">Selecciona periodo</option>
                <option value="Enero-Junio">Enero-Junio</option>
                <option value="Verano">Verano</option>
                <option value="Agosto-Diciembre">Agosto-Diciembre</option>
                <option value="Invierno">Invierno</option>
              </select>
            </div>

            <div>
              <label className={labelClass()}>Fecha inicio</label>
              <input
                className={fieldClass(false)}
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
              <label className={labelClass()}>Fecha fin</label>
              <input
                className={fieldClass(false)}
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
                  <th className="text-left p-3">Idioma</th>
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
                    <td className="p-3">
                      {row.idioma === "ingles"
                        ? "Inglés"
                        : row.idioma === "frances"
                        ? "Francés"
                        : row.idioma}
                    </td>
                    <td className="p-3">{row.periodo || "Sin periodo"}</td>
                    <td className="p-3">{row.estatus}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(row)}
                          className={editButtonClass}
                        >
                          Modificar
                        </button>
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
                    <td className="p-4 text-slate-500" colSpan="6">
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