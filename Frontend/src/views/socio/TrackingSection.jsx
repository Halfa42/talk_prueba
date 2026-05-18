import React from "react";

export default function TrackingSection({
  softCard,
  seguimientos,
  simpleTutores,
  trackingForm,
  setTrackingForm,
  onSubmit,
}) {
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

        <form onSubmit={onSubmit} className={softCard + " p-5"}>
          <h3 className="font-semibold text-lg mb-4">
            Observaciones y Asistencias
          </h3>

          <select
            className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white mb-4"
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

          <textarea
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
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