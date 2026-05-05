import React from "react";
import { Users, FolderOpen, ClipboardList, Clock3 } from "lucide-react";
import KpiCard from "../../components/KpiCard";
import { upcomingSessions } from "./tutorData";
import "../../styles/tutor/TutorDashboard.css";

const quickActions = [
  ["students", "Mis alumnos", "Consulta perfiles y avance.", Users],
  ["materials", "Materiales", "Sube recursos por tema.", FolderOpen],
  ["tasks", "Tareas", "Asigna y revisa entregas.", ClipboardList],
  ["hours", "Horas", "Consulta horas registradas.", Clock3],
];

export default function TutorDashboard({ softCard, onModuleChange }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-2">
        <KpiCard title="Tareas por revisar" value="6" />
        <KpiCard title="Horas acumuladas" value="1%" />
      </div>
      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className={softCard + " p-5"}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Panel operativo</h2>
                <p className="text-sm text-slate-500">
                  Accesos rápidos para continuar con tus actividades del día.
                </p>
              </div>
              <button
                onClick={() => onModuleChange("session")}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm"
              >
                Nueva sesión
              </button>
            </div>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              {quickActions.map(([key, title, description, Icon]) => (
                <button
                  key={key}
                  onClick={() => onModuleChange(key)}
                  className="p-4 rounded-2xl border bg-slate-50 text-left hover:border-blue-300 transition"
                >
                  <Icon className="mb-3" size={18} />
                  <div className="font-medium">{title}</div>
                  <div className="text-slate-500 mt-1">{description}</div>
                </button>
              ))}
            </div>
          </div>
          <div className={softCard + " p-5"}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Próximas sesiones</h3>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="text-left p-3">Alumno</th>
                    <th className="text-left p-3">Horario</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingSessions.map((row, index) => (
                    <tr key={index} className="border-t border-slate-200 bg-white">
                      {row.map((cell) => (
                        <td key={cell} className="p-3">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}