import React from "react";

export default function StudentClasses({ softCard }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Mis clases</h2>
        <p className="text-sm text-slate-500">Consulta tus próximas sesiones y el historial de clases.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          ["Lunes", "10:00", "Tema: presentaciones"],
          ["Miércoles", "12:00", "Tema: rutinas"],
          ["Viernes", "11:00", "Tema: listening"],
          ["Tutor", "Ana Ruiz", "Clase confirmada"],
          ["Última clase", "Hace 3 días", "Con retroalimentación"],
        ].map(([a, b, c], i) => (
          <div key={i} className={softCard + " p-5"}>
            <div className="font-semibold">{a}</div>
            <div className="text-sm text-slate-500 mt-2">{b}</div>
            <div className="text-sm mt-3">{c}</div>
          </div>
        ))}
      </div>
    </div>
  );
}