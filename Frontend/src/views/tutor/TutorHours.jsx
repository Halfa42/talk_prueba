import React from "react";
import "../../styles/tutor/TutorHours.css";

export default function TutorHours({ softCard }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Horas acumuladas</h2>
        <p className="text-sm text-slate-500">
          Consulta horas registradas, validadas y pendientes.
        </p>
      </div>
      <div className={softCard + " p-5"}>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Horas registradas</span>
            <span className="font-semibold">47.5 h</span>
          </div>
          <div className="flex justify-between">
            <span>Horas validadas</span>
            <span className="font-semibold">41 h</span>
          </div>
          <div className="flex justify-between">
            <span>Pendientes</span>
            <span className="font-semibold">6.5 h</span>
          </div>
        </div>
      </div>
      <div className={softCard + " p-5"}>
        <div className="h-72 rounded-2xl bg-slate-50 border flex items-center justify-center text-slate-500">
          Gráfica o historial de horas por sesión
        </div>
      </div>
    </div>
  );
}