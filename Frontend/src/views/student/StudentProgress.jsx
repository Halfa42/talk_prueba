import React from "react";

export default function StudentProgress({ softCard }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Mi avance</h2>
        <p className="text-sm text-slate-500">Consulta tu progreso de forma clara y sencilla.</p>
      </div>
      <div className={softCard + " p-5"}>
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left p-3">Área</th>
                <th className="text-left p-3">Estado</th>
                <th className="text-left p-3">Comentario</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Speaking", "En progreso", "Practica frases cortas"],
                ["Reading", "Bien", "Muy buena comprensión"],
                ["Listening", "En progreso", "Repasa audios cortos"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-slate-200 bg-white">
                  {row.map((cell) => (
                    <td key={cell} className="p-3">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}