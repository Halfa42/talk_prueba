import React, { useEffect, useState } from "react";
import KpiCard from "../../components/KpiCard";

export default function StudentDashboard({ softCard }) {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : {};
  const studentId = user.id_beneficiario || user.id_usuario;

  const [summary, setSummary] = useState({
    nivel: "N/A",
    asistencia: 100,
  });
  const [tasks, setTasks] = useState([]);
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

  const loadDashboardData = async () => {
    if (!studentId || studentId === "undefined") {
      console.error("El studentId es inválido:", studentId);
      return;
    }

    try {
      const [summaryRes, tasksRes, sessionsRes] = await Promise.all([
        fetch(`http://localhost:3000/api/student-dashboard/${studentId}/summary`),
        fetch(`http://localhost:3000/api/student-dashboard/${studentId}/tasks`),
        fetch(`http://localhost:3000/api/student-dashboard/${studentId}/sessions`),
      ]);

      const summaryData = await summaryRes.json();
      const tasksData = await tasksRes.json();
      const sessionsData = await sessionsRes.json();

      setSummary(summaryData || { nivel: "N/A", asistencia: 100 });
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setSessions(Array.isArray(sessionsData) ? sessionsData : []);
    } catch (error) {
      console.error("Error loading student dashboard data:", error);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <KpiCard title="Nivel actual" value={summary.nivel} hint="Asignado en perfil" />
        <KpiCard title="Tareas pendientes" value={tasks.length} hint={tasks.length > 0 ? "Revisa tus entregas" : "Todo al día"} />
        <KpiCard title="Asistencia" value={`${summary.asistencia}%`} hint="De las sesiones registradas" />
      </div>
      
      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className={softCard + " p-5"}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Próximas clases</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {sessions.length === 0 ? (
                <div className="col-span-2 p-4 rounded-xl bg-slate-50 border text-slate-500 text-sm">
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

        <div className="space-y-6">
          <div className={softCard + " p-5"}>
            <h3 className="font-semibold mb-4">Tareas pendientes</h3>
            <div className="space-y-3 text-sm">
              {tasks.length === 0 ? (
                <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-green-700 text-center">
                  🎉 ¡Genial! No tienes tareas pendientes en este momento.
                </div>
              ) : (
                tasks.map((task) => (
                  <div key={task.id_tarea} className="p-3 rounded-xl bg-slate-50 border">
                    <div className="font-medium">{task.titulo}</div>
                    <div className="text-xs text-red-500 mt-1">
                      Vence: {new Date(task.fecha_limite).toLocaleDateString('es-ES', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>  
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}