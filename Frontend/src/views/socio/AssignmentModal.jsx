import React, { useMemo, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import {
  fieldClass,
  hasRequiredError,
  labelClass,
  requiredTextClass,
} from "./formUtils";

export default function AssignmentModal({
  open,
  assignmentForm,
  setAssignmentForm,
  simpleTutores,
  simpleBeneficiarios,
  onClose,
  onSubmit,
}) {
  const [showValidation, setShowValidation] = useState(false);

  const errors = useMemo(() => {
    return {
      tutorId: hasRequiredError(showValidation, assignmentForm.tutorId),
      beneficiarioId: hasRequiredError(showValidation, assignmentForm.beneficiarioId),
      idioma: hasRequiredError(showValidation, assignmentForm.idioma),
      periodo: hasRequiredError(showValidation, assignmentForm.periodo),
    };
  }, [showValidation, assignmentForm]);

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
    <ModalWrapper title="Modificar asignación" onClose={resetAndClose}>
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
            Guardar cambios
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}