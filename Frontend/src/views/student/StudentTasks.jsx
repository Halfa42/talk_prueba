import React from "react";

export default function StudentTasks({ softCard }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Tareas</h2>
        <p className="text-sm text-slate-500">Revisa tus actividades y entrega tus trabajos.</p>
      </div>
      <div className="grid xl:grid-cols-2 gap-6">
        <div className={softCard + " p-5"}>
          <h3 className="font-semibold text-lg mb-4">Pendientes</h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-xl bg-slate-50 border">Worksheet de vocabulario — vence mañana</div>
            <div className="p-3 rounded-xl bg-slate-50 border">Lectura corta — entregar viernes</div>
          </div>
        </div>
        <div className={softCard + " p-5"}>
          <h3 className="font-semibold text-lg mb-4">Subir entrega</h3>
          <input className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3" placeholder="Nombre de la tarea" />
          <textarea className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3" rows="4" placeholder="Comentario para tu tutor" />
          <button className="px-4 py-2 rounded-xl bg-blue-600 text-white">Adjuntar archivo</button>
        </div>
      </div>
    </div>
  );
}