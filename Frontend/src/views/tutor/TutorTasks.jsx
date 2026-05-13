import React from "react";
import "../../styles/tutor/TutorTasks.css";

const pendingReviews = [
  "Vocabulary worksheet - María López",
  "Reading practice - Carlos Vega",
  "Listening exercise - Sofía Cruz",
];

export default function TutorTasks({ softCard }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Tareas y evaluación</h2>
        <p className="text-sm text-slate-500">
          Publica actividades y revisa entregas.
        </p>
      </div>
      <div className="grid xl:grid-cols-2 gap-6">
        <div className={softCard + " p-5"}>
          <h3 className="font-semibold text-lg mb-4">Asignar tarea</h3>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3"
            placeholder="Título de la tarea"
          />
          <textarea
            className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3"
            rows="4"
            placeholder="Instrucciones"
          />
          <div className="grid md:grid-cols-2 gap-3">
            <input
              className="rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Beneficiario"
            />
            <input
              className="rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Fecha límite"
            />
          </div>
          <button className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white">
            Publicar tarea
          </button>
        </div>
        <div className={softCard + " p-5"}>
          <h3 className="font-semibold text-lg mb-4">Entregas por revisar</h3>
          <div className="space-y-3">
            {pendingReviews.map((item) => (
              <div
                key={item}
                className="p-3 rounded-xl bg-slate-50 border flex items-center justify-between text-sm"
              >
                <span>{item}</span>
                <button className="px-3 py-2 rounded-xl bg-white border">
                  Calificar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}