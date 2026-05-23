import React from "react";
import ModalWrapper from "./ModalWrapper";

export default function AssignmentModal({
  open,
  assignmentForm,
  setAssignmentForm,
  simpleTutores,
  simpleBeneficiarios,
  onClose,
  onSubmit,
}) {
  if (!open) return null;

  const inputClass =
    "w-full rounded-xl border border-slate-300 px-4 py-3 bg-white";
  const labelClass = "text-sm font-medium text-slate-600 mb-2 block";

  return (
    <ModalWrapper title="Modificar asignación" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
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
            <label className={labelClass}>Idioma</label>
            <select
              className={inputClass}
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

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-blue-600 text-white"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}