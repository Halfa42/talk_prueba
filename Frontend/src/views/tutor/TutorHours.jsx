import React, { useEffect, useState } from "react";
import "../../styles/tutor/TutorHours.css";

export default function TutorHours({ softCard }) {
  const tutorId = 1;
  const [hoursData, setHoursData] = useState({
    horas_registradas: 0,
    horas_acreditadas: 0,
    horas_validadas: 0,
    pendientes: 0,
    sesiones: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHours = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`http://localhost:3000/api/dashboard/${tutorId}/hours`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "No se pudieron cargar las horas");
        }
        setHoursData({
          horas_registradas: Number(data.horas_registradas || 0),
          horas_acreditadas: Number(data.horas_acreditadas || 0),
          horas_validadas: Number(data.horas_validadas || 0),
          pendientes: Number(data.pendientes || 0),
          sesiones: Array.isArray(data.sesiones) ? data.sesiones : [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadHours();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Horas y evidencias</h2>
        <p className="text-sm text-slate-500">
          Consulta tus registros cargados por el socio formador. Esta vista es solo de lectura.
        </p>
      </div>
      <div className={softCard + " p-5"}>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Horas registradas</span>
            <span className="font-semibold">{hoursData.horas_registradas} h</span>
          </div>
          <div className="flex justify-between">
            <span>Horas acreditadas</span>
            <span className="font-semibold">{hoursData.horas_acreditadas} h</span>
          </div>
        </div>
      </div>

      <div className={softCard + " p-5"}>
        <h3 className="font-semibold text-lg mb-4">Historial de horas por sesión</h3>
        {loading ? (
          <div className="h-48 rounded-2xl bg-slate-50 border flex items-center justify-center text-slate-500">
            Cargando horas...
          </div>
        ) : error ? (
          <div className="h-48 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            {error}
          </div>
        ) : hoursData.sesiones.length === 0 ? (
          <div className="h-48 rounded-2xl bg-slate-50 border flex items-center justify-center text-slate-500">
            Sin sesiones registradas
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="text-left p-3">Fecha</th>
                  <th className="text-left p-3">Alumno</th>
                  <th className="text-left p-3">Horario</th>
                  <th className="text-left p-3">Horas</th>
                </tr>
              </thead>
              <tbody>
                {hoursData.sesiones.map((sesion) => (
                  <tr key={sesion.id_sesion} className="border-t border-slate-200 bg-white">
                    <td className="p-3">{sesion.fecha_sesion}</td>
                    <td className="p-3">{sesion.alumno}</td>
                    <td className="p-3">{sesion.horario}</td>
                    <td className="p-3">{sesion.horas_registradas} h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}