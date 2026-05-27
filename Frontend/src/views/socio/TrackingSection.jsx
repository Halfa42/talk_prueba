import React, { useMemo, useState } from "react";
import {
  fieldClass,
  hasRequiredError,
  labelClass,
  requiredTextClass,
} from "./formUtils";

export default function TrackingSection({
  softCard,
  seguimientos,
  simpleTutores,
  trackingForm,
  setTrackingForm,
  onSubmit,
}) {
  const [showValidation, setShowValidation] = useState(false);

  const errors = useMemo(() => {
    return {
      tutorId: hasRequiredError(showValidation, trackingForm.tutorId),
      observacion: hasRequiredError(showValidation, trackingForm.observacion),
    };
  }, [showValidation, trackingForm]);

  const hasErrors = Object.values(errors).some(Boolean);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowValidation(true);

    if (hasErrors) return;
    onSubmit(e);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Seguimiento</h2>
      <div className="grid xl:grid-cols-2 gap-6">
        <div className={softCard + " p-5"}>
          <h3 className="font-semibold text-lg mb-4">Casos en seguimiento</h3>
          <div className="space-y-3 text-sm">
            {seguimientos.length > 0 ? (
              seguimientos.map((item) => (
                <div
                  key={item.id_seguimiento}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div className="font-medium">{item.tutor}</div>
                  <div className="mt-1 text-slate-600">{item.observacion}</div>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500">
                No hay observaciones registradas todavía.
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className={softCard + " p-5"}>
          <h3 className="font-semibold text-lg mb-4">
            Observaciones y Asistencias
          </h3>

          <div className="mb-4">
            {errors.tutorId && (
              <span className={requiredTextClass()}>Campo obligatorio</span>
            )}
            <label className={labelClass()}>
              Tutor <span className="text-red-500">*</span>
            </label>
            <select
              className={fieldClass(errors.tutorId)}
              value={trackingForm.tutorId}
              onChange={(e) =>
                setTrackingForm({
                  ...trackingForm,
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
            {errors.observacion && (
              <span className={requiredTextClass()}>Campo obligatorio</span>
            )}
            <label className={labelClass()}>
              Observaciones <span className="text-red-500">*</span>
            </label>
            <textarea
              className={fieldClass(errors.observacion)}
              rows="6"
              placeholder="Registrar observaciones del caso"
              value={trackingForm.observacion}
              onChange={(e) =>
                setTrackingForm({
                  ...trackingForm,
                  observacion: e.target.value,
                })
              }
            />
          </div>

          <button
            type="submit"
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white"
          >
            Guardar observaciones
          </button>
        </form>
      </div>
    </div>
  );
}