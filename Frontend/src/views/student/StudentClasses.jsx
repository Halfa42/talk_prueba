import React, { useEffect, useState } from "react";

export default function StudentClasses({ softCard }) {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : {};
  const studentId = user.id_beneficiario || user.id_usuario;

  const [sessions, setSessions] = useState([]);

  const formatTimeAmPm = (timeValue) => {
    if (!timeValue) return "";
    const base = String(timeValue).slice(0, 5);
    const [hoursRaw, minutes] = base.split(":");
    const hours = Number(hoursRaw);
    if (!Number.isInteger(hours) || minutes === undefined) return base;
    const suffix = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${hours12}:${minutes} ${suffix}`;
  };

  const loadSessions = async () => {
    if (!studentId || studentId === "undefined") {
      return;
    }
    try {
      const res = await fetch(`http://localhost:3000/api/student-dashboard/${studentId}/sessions`);
      const data = await res.json();
      setSessions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Mis clases</h2>
        <p className="text-sm text-slate-500">Consulta tus próximas sesiones y el enlace para unirte.</p>
      </div>

      <div className={softCard + " p-5"}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Próximas clases</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.length === 0 ? (
            <div className="col-span-full p-4 rounded-xl bg-slate-50 border text-slate-500 text-sm">
              No tienes sesiones programadas próximamente.
            </div>
          ) : (
            sessions.map((session, i) => (
              <div key={session.id_sesion || i} className="p-4 rounded-2xl border bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="font-semibold text-lg">Tutor: {session.tutor}</div>
                  <div className="text-sm text-slate-500 mt-2">Día: <span className="font-medium text-slate-700">{session.dia}</span></div>
                  <div className="text-sm text-slate-500 mt-1">Horario: <span className="font-medium text-slate-700">{formatTimeAmPm(session.hora_inicio)} - {formatTimeAmPm(session.hora_fin)}</span></div>
                </div>
                
                <div className="mt-4">
                  {session.zoom_link ? (
                    <a 
                      href={session.zoom_link.startsWith('http') ? session.zoom_link : `https://${session.zoom_link}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition w-full text-center"
                    >
                      Unirse a Zoom
                    </a>
                  ) : (
                    <div className="px-4 py-2 bg-slate-200 text-slate-500 text-sm font-medium rounded-xl text-center">
                      Link de Zoom no asignado
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}