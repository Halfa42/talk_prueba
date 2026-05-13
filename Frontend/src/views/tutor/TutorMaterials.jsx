import React from "react";
import "../../styles/tutor/TutorMaterials.css";

export default function TutorMaterials({ softCard }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Material para beneficiario</h2>
        <p className="text-sm text-slate-500">
          Carga recursos por tema, nivel y alumno.
        </p>
      </div>
      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className={softCard + " p-5"}>
            <h3 className="font-semibold text-lg mb-4">Nuevo material</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                className="rounded-xl border border-slate-300 px-4 py-3"
                placeholder="Título del material"
              />
              <input
                className="rounded-xl border border-slate-300 px-4 py-3"
                placeholder="Tema"
              />
              <input
                className="rounded-xl border border-slate-300 px-4 py-3"
                placeholder="Nivel"
              />
              <select className="rounded-xl border border-slate-300 px-4 py-3 bg-white">
                <option>Asignar a beneficiario</option>
              </select>
            </div>
            <textarea
              className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3"
              rows="4"
              placeholder="Descripción del recurso"
            />
            <div className="mt-4 flex gap-3">
              <button className="px-4 py-2 rounded-xl bg-blue-600 text-white">
                Subir archivo
              </button>
              <button className="px-4 py-2 rounded-xl bg-slate-100">
                Guardar material
              </button>
            </div>
          </div>
        </div>
        <div className={softCard + " p-5"}>
          <h3 className="font-semibold text-lg mb-4">Recientes</h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-xl bg-slate-50 border">
              Tema 1 - Presentaciones
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border">
              Tema 2 - Rutinas diarias
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border">
              Listening practice A2
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}