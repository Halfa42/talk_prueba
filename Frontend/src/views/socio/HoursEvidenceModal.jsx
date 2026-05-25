import React, { useMemo, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import {
  fieldClass,
  hasRequiredError,
  labelClass,
  requiredTextClass,
} from "./formUtils";

export default function HoursEvidenceModal({
  open,
  editingHoursEvidence,
  hoursEvidenceForm,
  setHoursEvidenceForm,
  simpleTutores,
  onClose,
  onSubmit,
}) {
  const [showValidation, setShowValidation] = useState(false);

  const errors = useMemo(() => {
    return {
      tutorId: hasRequiredError(showValidation, hoursEvidenceForm.tutorId),
      horas: hasRequiredError(showValidation, hoursEvidenceForm.horas),
      sesiones: hasRequiredError(showValidation, hoursEvidenceForm.sesiones),
    };
  }, [showValidation, hoursEvidenceForm]);

  const hasErrors = Object.values(errors).some(Boolean);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowValidation(true);

    if (hasErrors) return;
    onSubmit(e);
  };

  const resetAndClose = () => {
    setShowValidation(false);
    onClose();
  };

  if (!open) return null;

  return (
    <ModalWrapper
      title={editingHoursEvidence ? "Modificar registro" : "Nuevo registro"}
      onClose={resetAndClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className={labelClass()}>Estado</label>
            <select
              className={fieldClass(false)}
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
            {errors.horas && (
              <span className={requiredTextClass()}>Campo obligatorio</span>
            )}
            <label className={labelClass()}>
              Horas <span className="text-red-500">*</span>
            </label>
            <input
              className={fieldClass(errors.horas)}
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
            {errors.sesiones && (
              <span className={requiredTextClass()}>Campo obligatorio</span>
            )}
            <label className={labelClass()}>
              Sesiones <span className="text-red-500">*</span>
            </label>
            <input
              className={fieldClass(errors.sesiones)}
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
            onClick={resetAndClose}
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