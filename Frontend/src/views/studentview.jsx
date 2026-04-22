import React, { useState } from 'react';
import { LayoutDashboard, GraduationCap, BookOpen, ClipboardList, CalendarDays, Users } from 'lucide-react';
import KpiCard from '../components/KpiCard';

export default function StudentView() {
  const [studentModule, setStudentModule] = useState("dashboard");

  const softCard = "bg-white rounded-2xl border border-slate-200 shadow-sm";
  const menuClass = (active) => `w-full flex items-center gap-3 text-left px-4 py-3 rounded-2xl text-sm border transition ${active ? "bg-blue-600 text-white border-blue-600 font-medium shadow-sm" : "bg-white border-transparent hover:bg-slate-50"}`;

  const renderContent = () => {
    if (studentModule === "dashboard") return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-4 gap-4">
          <KpiCard title="Nivel actual" value="A2" hint="Subiste desde A1 diagnóstico" />
          <KpiCard title="Tareas pendientes" value="3" hint="1 vence mañana" />
          <KpiCard title="Clases esta semana" value="2" hint="Próxima hoy 12:00" />
          <KpiCard title="Asistencia" value="92%" hint="Muy buen seguimiento" />
        </div>
        <div className="grid xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className={softCard + " p-5"}>
              <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold">Próximas clases</h2><button className="text-sm text-blue-600">Ver calendario</button></div>
              <div className="grid md:grid-cols-2 gap-4">{[["Lunes 10:00","Inglés A2","Tema: presentaciones"],["Miércoles 12:00","Inglés A2","Tema: rutinas"],["Viernes 11:00","Inglés A2","Tema: listening"],["Tutor","Ana Ruiz","Sesión confirmada"]].map(([a,b,c],i)=><div key={i} className="p-4 rounded-2xl border bg-slate-50"><div className="font-semibold">{a}</div><div className="text-sm text-slate-500 mt-2">{b}</div><div className="text-sm mt-3">{c}</div></div>)}</div>
            </div>
            <div className={softCard + " p-5"}>
              <h3 className="font-semibold text-lg mb-4">Recursos recientes</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm"><div className="p-4 rounded-2xl border bg-slate-50">Guía visual — presentaciones</div><div className="p-4 rounded-2xl border bg-slate-50">Actividad de vocabulario</div><div className="p-4 rounded-2xl border bg-slate-50">Ejercicio de lectura</div><div className="p-4 rounded-2xl border bg-slate-50">Práctica auditiva</div></div>
            </div>
          </div>
          <div className="space-y-6">
            <div className={softCard + " p-5"}><h3 className="font-semibold mb-4">Tareas pendientes</h3><div className="space-y-3 text-sm"><div className="p-3 rounded-xl bg-slate-50 border">Worksheet de vocabulario — vence mañana</div><div className="p-3 rounded-xl bg-slate-50 border">Listening exercise — pendiente</div></div></div>
            <div className={softCard + " p-5"}><h3 className="font-semibold mb-4">Mi avance</h3><div className="space-y-3 text-sm"><div className="flex justify-between"><span>Nivel diagnóstico</span><span>A1</span></div><div className="flex justify-between"><span>Nivel actual</span><span>A2</span></div><div className="flex justify-between"><span>Comentarios nuevos</span><span>4</span></div></div></div>
          </div>
        </div>
      </div>
    );

    if (studentModule === "progress") return (
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
                <tbody>{[["Speaking","En progreso","Practica frases cortas"],["Reading","Bien","Muy buena comprensión"],["Listening","En progreso","Repasa audios cortos"]].map((row,i)=>
                  <tr key={i} className="border-t border-slate-200 bg-white">{row.map((cell)=><td key={cell} className="p-3">{cell}</td>)}</tr>)}
                </tbody>
            </table>
          </div>
        </div>
      </div>
    );

    if (studentModule === "materials") return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Material de apoyo</h2>
          <p className="text-sm text-slate-500">Recursos organizados por tema para estudiar de manera sencilla.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">{["Presentaciones básicas","Vocabulario visual","Lectura corta A2","Audio de práctica","Ejercicio interactivo","Guía de repaso"].map((item)=>
          <div key={item} className={softCard + " p-5"}>
            <div className="font-semibold">{item}</div>
            <button className="mt-4 px-3 py-2 rounded-xl bg-slate-100 text-sm">Abrir</button></div>)}
        </div>
      </div>
    );

    if (studentModule === "tasks") return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Tareas</h2>
          <p className="text-sm text-slate-500">Revisa tus actividades y entrega tus trabajos.</p>
        </div>
        <div className="grid xl:grid-cols-2 gap-6">
          <div className={softCard + " p-5"}>
            <h3 className="font-semibold text-lg mb-4">Pendientes</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-50 border">Worksheet de vocabulario — vence mañana</div>
              <div className="p-3 rounded-xl bg-slate-50 border">Lectura corta — entregar viernes</div>
            </div>
          </div>
          <div className={softCard + " p-5"}>
            <h3 className="font-semibold text-lg mb-4">Subir entrega</h3>
            <input className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3" placeholder="Nombre de la tarea" />
            <textarea className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3" rows="4" placeholder="Comentario para tu tutor" />
            <button className="px-4 py-2 rounded-xl bg-blue-600 text-white">Adjuntar archivo</button>
          </div>
        </div>
      </div>
    );

    if (studentModule === "classes") return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Mis clases</h2>
            <p className="text-sm text-slate-500">Consulta tus próximas sesiones y el historial de clases.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              ["Lunes", "10:00", "Tema: presentaciones"],
              ["Miércoles", "12:00", "Tema: rutinas"],
              ["Viernes", "11:00", "Tema: listening"],
              ["Tutor", "Ana Ruiz", "Clase confirmada"],
              ["Última clase", "Hace 3 días", "Con retroalimentación"]
            ].map(([a, b, c], i) => (
              <div key={i} className={softCard + " p-5"}>
                <div className="font-semibold">{a}</div>
                <div className="text-sm text-slate-500 mt-2">{b}</div>
                <div className="text-sm mt-3">{c}</div>
              </div>
            ))}
          </div>
        </div>
      );

    return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Mi perfil</h2>
            <p className="text-sm text-slate-500">Información personal y académica básica.</p>
          </div>
          <div className="grid xl:grid-cols-2 gap-6">
            <div className={softCard + " p-5"}>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Nombre</span>
                  <span>María López</span>
                </div>
                <div className="flex justify-between">
                  <span>Programa</span>
                  <span>Inglés</span>
                </div>
                <div className="flex justify-between">
                  <span>Nivel</span>
                  <span>A2</span>
                </div>
                <div className="flex justify-between">
                  <span>Tutor</span>
                  <span>Ana Ruiz</span>
                </div>
              </div>
            </div>
            <div className={softCard + " p-5"}>
              <h3 className="font-semibold mb-4">Comentarios recientes</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-xl bg-slate-50 border">Muy buen esfuerzo en la última actividad.</div>
                <div className="p-3 rounded-xl bg-slate-50 border">Repasa vocabulario antes de la próxima clase.</div>
              </div>
            </div>
          </div>
        </div>
      );
  };

  return (
    <div className="flex min-h-[720px] bg-slate-50">
      <aside className="w-72 bg-white border-r border-slate-200 p-4 space-y-2">
        <button onClick={() => setStudentModule("dashboard")} className={menuClass(studentModule === "dashboard")}><LayoutDashboard size={18} />Dashboard</button>
        <button onClick={() => setStudentModule("progress")} className={menuClass(studentModule === "progress")}><GraduationCap size={18} />Mi avance</button>
        <button onClick={() => setStudentModule("materials")} className={menuClass(studentModule === "materials")}><BookOpen size={18} />Material de apoyo</button>
        <button onClick={() => setStudentModule("tasks")} className={menuClass(studentModule === "tasks")}><ClipboardList size={18} />Tareas</button>
        <button onClick={() => setStudentModule("classes")} className={menuClass(studentModule === "classes")}><CalendarDays size={18} />Mis clases</button>
        <button onClick={() => setStudentModule("profile")} className={menuClass(studentModule === "profile")}><Users size={18} />Mi perfil</button>
      </aside>
      <main className="flex-1 p-6 space-y-6">
        {renderContent()}
      </main>
    </div>
  );
}