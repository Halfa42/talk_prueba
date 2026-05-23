import React from "react";
import ModalWrapper from "./ModalWrapper";

export default function HoursEvidenceModal({
  open,
  editingHoursEvidence,
  hoursEvidenceForm,
  setHoursEvidenceForm,
  simpleTutores,
  onClose,
  onSubmit,
}) {
  if (!open) return null;

  const inputClass =
    "w-full rounded-xl border border-slate-300 px-4 py-3 bg-white";
  const labelClass = "text-sm font-medium text-slate-600 mb-2 block";

  return (
    <ModalWrapper
      title={editingHoursEvidence ? "Modificar registro" : "Nuevo registro"}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Tutor</label>
            <select
              className={inputClass}
              value={hoursEvidenceForm.tutorId}
              onChange={(e) =>
                setHoursEvidenceForm({
                  ...hoursEvidenceForm,
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
            <label className={labelClass}>Estado</label>
            <select
              className={inputClass}
              value={hoursEvidenceForm.estado}
              onChange={(e) =>
                setHoursEvidenceForm({
                  ...hoursEvidenceForm,
                  estado: e.target.value,
                })
              }
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Validado">Validado</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Horas</label>
            <input
              className={inputClass}
              type="number"
              step="0.01"
              min="0"
              value={hoursEvidenceForm.horas}
              onChange={(e) =>
                setHoursEvidenceForm({
                  ...hoursEvidenceForm,
                  horas: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Sesiones</label>
            <input
              className={inputClass}
              type="number"
              min="0"
              value={hoursEvidenceForm.sesiones}
              onChange={(e) =>
                setHoursEvidenceForm({
                  ...hoursEvidenceForm,
                  sesiones: e.target.value,
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
            {editingHoursEvidence ? "Guardar cambios" : "Guardar registro"}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}