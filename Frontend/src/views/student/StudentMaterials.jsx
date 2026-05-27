import React from "react";

export default function StudentMaterials({ softCard }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Material de apoyo</h2>
        <p className="text-sm text-slate-500">Recursos organizados por tema para estudiar de manera sencilla.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          "Presentaciones básicas",
          "Vocabulario visual",
          "Lectura corta A2",
          "Audio de práctica",
          "Ejercicio interactivo",
          "Guía de repaso",
        ].map((item) => (
          <div key={item} className={softCard + " p-5"}>
            <div className="font-semibold">{item}</div> 
            <button className="mt-4 px-3 py-2 rounded-xl bg-slate-100 text-sm">Abrir</button>
          </div>
        ))}
      </div>
    </div>
  );
}