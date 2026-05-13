import React from "react";
import { tutorStudents, buildSelectedStudent } from "./tutorData";
import "../../styles/tutor/TutorStudents.css";

export default function TutorStudents({ softCard, onOpenStudent }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mis alumnos</h2>
          <p className="text-sm text-slate-500">
            Consulta información general, progreso y accesos rápidos.
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm">
          Exportar lista
        </button>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tutorStudents.map(([name, level, status]) => (
          <div key={name} className={softCard + " p-5"}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-lg">{name}</div>
                <div className="text-sm text-slate-500 mt-1">{level}</div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                {name[0]}
              </div>
            </div>
            <div className="mt-4 inline-block text-sm px-3 py-2 rounded-xl bg-slate-100">
              {status}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
              <button
                onClick={() => onOpenStudent(buildSelectedStudent(name, level, status), "registro")}
                className="px-3 py-2 rounded-xl bg-blue-600 text-white"
              >
                Ver ficha
              </button>
              <button
                onClick={() => onOpenStudent(buildSelectedStudent(name, level, status))}
                className="px-3 py-2 rounded-xl bg-slate-100"
              >
                Abrir sesión
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}