import React from "react";
import KpiCard from "../../components/KpiCard"; 

export default function StudentDashboard({ softCard }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <KpiCard title="Nivel actual" value="A2" hint="" /> 
        <KpiCard title="Tareas pendientes" value="3" hint="1 vence mañana" />
        <KpiCard title="Clases esta semana" value="2" hint="Próxima hoy 12:00" />
        <KpiCard title="Asistencia" value="92%" hint="" /> 
      </div>
      
      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className={softCard + " p-5"}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Próximas clases</h2>
              <button className="text-sm text-blue-600">Ver calendario</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                ["Lunes 10:00", "Inglés A2", "Tema: presentaciones"],
                ["Miércoles 12:00", "Inglés A2", "Tema: rutinas"],
                ["Viernes 11:00", "Inglés A2", "Tema: listening"],
                ["Tutor", "Ana Ruiz", "Sesión confirmada"],
              ].map(([a, b, c], i) => (
                <div key={i} className="p-4 rounded-2xl border bg-slate-50">
                  <div className="font-semibold">{a}</div>
                  <div className="text-sm text-slate-500 mt-2">{b}</div>
                  <div className="text-sm mt-3">{c}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className={softCard + " p-5"}>
            <h3 className="font-semibold mb-4">Tareas pendientes</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-50 border">Worksheet de vocabulario — vence mañana</div>
              <div className="p-3 rounded-xl bg-slate-50 border">Listening exercise — pendiente</div>
            </div>
          </div>
          
          <div className={softCard + " p-5"}>
            <h3 className="font-semibold mb-4">Mi avance</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Nivel diagnóstico</span>
                <span>A1</span>
              </div>
              <div className="flex justify-between">
                <span>Nivel actual</span>
                <span>A2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}