import React, { useEffect, useState } from "react";
import "../../styles/tutor/TutorHours.css";

export default function TutorHours({ softCard, tutorUserId }) {
  const [hoursData, setHoursData] = useState({
    horas_registradas: 0,
    horas_validadas: 0,
    pendientes: 0,
    registros: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHours = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:3000/api/dashboard/${tutorUserId}/hours`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "No se pudieron cargar las horas");
        }

        setHoursData({
          horas_registradas: Number(data.horas_registradas || 0),
          horas_validadas: Number(data.horas_validadas || 0),
          pendientes: Number(data.pendientes || 0),
          registros: Array.isArray(data.registros) ? data.registros : [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (tutorUserId) {
      loadHours();
    }
  }, [tutorUserId]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Horas y evidencias</h2>
        <p className="text-sm text-slate-500">
          Consulta tus registros cargados por el socio formador. Esta vista es solo de lectura.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className={softCard + " p-5"}>
          <div className="text-sm text-slate-500">Horas registradas</div>
          <div className="text-3xl font-bold mt-2">
            {hoursData.horas_registradas.toFixed(2)} h
          </div>
        </div>

        <div className={softCard + " p-5"}>
          <div className="text-sm text-slate-500">Horas validadas</div>
          <div className="text-3xl font-bold mt-2">
            {hoursData.horas_validadas.toFixed(2)} h
          </div>
        </div>

        <div className={softCard + " p-5"}>
          <div className="text-sm text-slate-500">Pendientes</div>
          <div className="text-3xl font-bold mt-2">
            {hoursData.pendientes.toFixed(2)} h
          </div>
        </div>
      </div>

      <div className={softCard + " p-5"}>
        <h3 className="font-semibold text-lg mb-4">Tabla de registros</h3>

        {loading && <p className="text-sm text-slate-500">Cargando registros...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="text-left p-3">Tutor</th>
                  <th className="text-left p-3">Horas</th>
                  <th className="text-left p-3">Sesiones</th>
                  <th className="text-left p-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {hoursData.registros.length === 0 ? (
                  <tr className="border-t border-slate-200 bg-white">
                    <td className="p-3 text-slate-400" colSpan={4}>
                      Sin registros disponibles.
                    </td>
                  </tr>
                ) : (
                  hoursData.registros.map((row) => (
                    <tr key={row.id_registro} className="border-t border-slate-200 bg-white">
                      <td className="p-3">{row.tutor}</td>
                      <td className="p-3">{Number(row.horas || 0).toFixed(2)} h</td>
                      <td className="p-3">{row.sesiones}</td>
                      <td className="p-3">{row.estado}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}