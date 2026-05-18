import React from "react";

export default function StudentProfile({ softCard }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Mi perfil</h2>
        <p className="text-sm text-slate-500">Información personal y académica básica.</p>
      </div>
      <div className="grid xl:grid-cols-2 gap-6">
        <div className={softCard + " p-5"}>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span>Nombre</span><span>María López</span></div>
            <div className="flex justify-between"><span>Programa</span><span>Inglés</span></div>
            <div className="flex justify-between"><span>Nivel</span><span>A2</span></div>
            <div className="flex justify-between"><span>Tutor</span><span>Ana Ruiz</span></div>
          </div>
        </div>
        <div className={softCard + " p-5"}>
          <h3 className="font-semibold mb-4">Comentarios recientes</h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-xl bg-slate-50 border">Muy buen esfuerzo en la última actividad.</div>
            <div className="p-3 rounded-xl bg-slate-50 border">Repasa vocabulario antes de la próxima clase.</div>
          </div>
        </div>
      </div>
    </div>
  );
}