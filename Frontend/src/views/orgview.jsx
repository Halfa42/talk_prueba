import React, { useState } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  CalendarDays,
  ClipboardList,
  FileText,
  FolderOpen,
  BookOpen,
  LogOut,
} from "lucide-react";
import KpiCard from "../components/KpiCard";

export default function OrgView({ onLogout }) {
  const [orgModule, setOrgModule] = useState("dashboard");

  const softCard = "bg-white rounded-2xl border border-slate-200 shadow-sm";
  const menuClass = (active) =>
    `w-full flex items-center gap-3 text-left px-4 py-3 rounded-2xl text-sm border transition ${
      active
        ? "bg-blue-600 text-white border-blue-600 font-medium shadow-sm"
        : "bg-white border-transparent hover:bg-slate-50"
    }`;

  const actionButtonClass =
    "px-3 py-1.5 rounded-lg text-xs font-medium transition";
  const editButtonClass =
    actionButtonClass + " bg-amber-100 text-amber-700 hover:bg-amber-200";
  const deleteButtonClass =
    actionButtonClass + " bg-red-100 text-red-600 hover:bg-red-200";

  const renderContent = () => {
    if (orgModule === "dashboard")
      return (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <KpiCard title="Beneficiarios activos" value="42" />
            <KpiCard title="Tutores activos" value="12" />
            <KpiCard title="Horas acumuladas" value="394 h" />
          </div>

          <div className={softCard + " p-5"}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Asignaciones recientes</h2>
              <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm">
                Nueva asignación
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="text-left p-3">Beneficiario</th>
                    <th className="text-left p-3">Tutor</th>
                    <th className="text-left p-3">Periodo</th>
                    <th className="text-left p-3">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["María López", "Ana Ruiz", "2026-A", "Activa"],
                    ["Carlos Vega", "Luis Rojas", "2026-A", "Activa"],
                    ["Fernanda Gil", "Paola Díaz", "2026-A", "No activa"],
                  ].map((row, i) => (
                    <tr key={i} className="border-t border-slate-200 bg-white">
                      {row.map((cell, index) => (
                        <td key={`${cell}-${index}`} className="p-3">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={softCard + " p-5"}>
            <h3 className="font-semibold text-lg mb-4">Alertas operativas</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                2 tutores no han registrado sesión esta semana.
              </div>
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
                1 beneficiario tiene 3 faltas consecutivas.
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                5 materiales nuevos están pendientes de revisión.
              </div>
            </div>
          </div>
        </div>
      );

    if (orgModule === "beneficiaries")
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Gestión de beneficiarios</h2>
              <p className="text-sm text-slate-500">
                Consulta información académica, avance y tutor asignado.
              </p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm">
              Nuevo beneficiario
            </button>
          </div>

          <div className={softCard + " p-5"}>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="text-left p-3">Nombre</th>
                    <th className="text-left p-3">Nivel</th>
                    <th className="text-left p-3">Tutor</th>
                    <th className="text-left p-3">Asistencia</th>
                    <th className="text-left p-3">Estado</th>
                    <th className="text-left p-3">Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["María López", "A2", "Ana Ruiz", "92%", "Activa"],
                    ["Carlos Vega", "A1", "Luis Rojas", "78%", "No activa"],
                    ["Fernanda Gil", "B1", "Paola Díaz", "95%", "Activa"],
                  ].map((row, i) => (
                    <tr key={i} className="border-t border-slate-200 bg-white">
                      <td className="p-3">{row[0]}</td>
                      <td className="p-3">{row[1]}</td>
                      <td className="p-3">{row[2]}</td>
                      <td className="p-3">{row[3]}</td>
                      <td className="p-3">{row[4]}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button className={editButtonClass}>Modificar</button>
                          <button className={deleteButtonClass}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );

    if (orgModule === "tutors")
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Gestión de tutores</h2>
              <p className="text-sm text-slate-500">
                Monitorea carga de trabajo y horas.
              </p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm">
              Nuevo tutor
            </button>
          </div>

          <div className={softCard + " p-5"}>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="text-left p-3">Nombre</th>
                    <th className="text-left p-3">Beneficiarios asignados</th>
                    <th className="text-left p-3">Horas acumuladas</th>
                    <th className="text-left p-3">Estado</th>
                    <th className="text-left p-3">Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Ana Ruiz", "8 beneficiarios", "41 h", "Activa"],
                    ["Luis Rojas", "6 beneficiarios", "36 h", "Activa"],
                    ["Paola Díaz", "5 beneficiarios", "29 h", "No activa"],
                  ].map((row, i) => (
                    <tr key={i} className="border-t border-slate-200 bg-white">
                      <td className="p-3">{row[0]}</td>
                      <td className="p-3">{row[1]}</td>
                      <td className="p-3">{row[2]}</td>
                      <td className="p-3">{row[3]}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button className={editButtonClass}>Modificar</button>
                          <button className={deleteButtonClass}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );

    if (orgModule === "assignment")
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">
              Asignación tutor-beneficiario
            </h2>
          </div>

          <div className="grid xl:grid-cols-2 gap-6">
            <div className={softCard + " p-5"}>
              <h3 className="font-semibold text-lg mb-4">Nueva asignación</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <select className="rounded-xl border border-slate-300 px-4 py-3 bg-white">
                  <option>Selecciona tutor</option>
                </select>
                <select className="rounded-xl border border-slate-300 px-4 py-3 bg-white">
                  <option>Selecciona beneficiario</option>
                </select>
              </div>
              <button className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white">
                Guardar asignación
              </button>
            </div>

            <div className={softCard + " p-5"}>
              <h3 className="font-semibold text-lg mb-4">
                Asignaciones activas
              </h3>

              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="text-left p-3">Beneficiario</th>
                      <th className="text-left p-3">Tutor</th>
                      <th className="text-left p-3">Periodo</th>
                      <th className="text-left p-3">Estado</th>
                      <th className="text-left p-3">Opciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["María López", "Ana Ruiz", "2026-A", "Activa"],
                      ["Carlos Vega", "Luis Rojas", "2026-A", "Activa"],
                      ["Fernanda Gil", "Paola Díaz", "2026-A", "No activa"],
                    ].map((row, i) => (
                      <tr key={i} className="border-t border-slate-200 bg-white">
                        <td className="p-3">{row[0]}</td>
                        <td className="p-3">{row[1]}</td>
                        <td className="p-3">{row[2]}</td>
                        <td className="p-3">{row[3]}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button className={editButtonClass}>
                              Modificar
                            </button>
                            <button className={deleteButtonClass}>
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      );

    if (orgModule === "tracking")
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Seguimiento</h2>
          <div className="grid xl:grid-cols-2 gap-6">
            <div className={softCard + " p-5"}>
              <h3 className="font-semibold text-lg mb-4">
                Casos en seguimiento
              </h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  Carlos Vega — asistencia irregular
                </div>
                <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                  Fernanda Gil — requiere revisión académica
                </div>
              </div>
            </div>

            <div className={softCard + " p-5"}>
              <h3 className="font-semibold text-lg mb-4">Observaciones</h3>

              <select className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white mb-4">
                <option>Selecciona tutor</option>
                <option>Ana Ruiz</option>
                <option>Luis Rojas</option>
                <option>Paola Díaz</option>
              </select>

              <textarea
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                rows="6"
                placeholder="Registrar observaciones del caso"
              />

              <button className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white">
                Guardar observaciones
              </button>
            </div>
          </div>
        </div>
      );

    if (orgModule === "logs")
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Horas y evidencias</h2>
          <div className={softCard + " p-5"}>
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
                  {[
                    ["Ana Ruiz", "41 h", "28", "Validado"],
                    ["Luis Rojas", "36 h", "22", "Pendiente"],
                    ["Paola Díaz", "29 h", "19", "Validado"],
                  ].map((row, i) => (
                    <tr key={i} className="border-t border-slate-200 bg-white">
                      {row.map((cell, index) => (
                        <td key={`${cell}-${index}`} className="p-3">
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
      );

    if (orgModule === "reports")
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Reportes</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              "Reporte de beneficiarios",
              "Reporte de tutores",
              "Reporte de horas",
            ].map((item) => (
              <div key={item} className={softCard + " p-5"}>
                <div className="font-semibold">{item}</div>
                <button className="mt-4 px-3 py-2 rounded-xl bg-slate-100 text-sm">
                  Descargar
                </button>
              </div>
            ))}
          </div>
        </div>
      );

    if (orgModule === "materials")
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Material institucional</h2>

          <div className={softCard + " p-5 max-w-3xl"}>
            <h3 className="font-semibold text-lg mb-4">Subir material</h3>

            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3"
              placeholder="Título"
            />

            <textarea
              className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-4"
              rows="4"
              placeholder="Descripción"
            />

            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700">
                Subir archivo
              </button>
              <button className="px-4 py-2 rounded-xl bg-blue-600 text-white">
                Guardar material
              </button>
            </div>
          </div>
        </div>
      );

    return null;
  };

  return (
    <div className="flex min-h-[760px] bg-slate-50">
      <aside className="w-72 bg-white border-r border-slate-200 p-4 flex flex-col justify-between">
        <div className="space-y-2">
          <button
            onClick={() => setOrgModule("dashboard")}
            className={menuClass(orgModule === "dashboard")}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button
            onClick={() => setOrgModule("beneficiaries")}
            className={menuClass(orgModule === "beneficiaries")}
          >
            <GraduationCap size={18} /> Beneficiarios
          </button>
          <button
            onClick={() => setOrgModule("tutors")}
            className={menuClass(orgModule === "tutors")}
          >
            <Users size={18} /> Tutores
          </button>
          <button
            onClick={() => setOrgModule("assignment")}
            className={menuClass(orgModule === "assignment")}
          >
            <CalendarDays size={18} /> Asignaciones
          </button>
          <button
            onClick={() => setOrgModule("tracking")}
            className={menuClass(orgModule === "tracking")}
          >
            <ClipboardList size={18} /> Seguimiento
          </button>
          <button
            onClick={() => setOrgModule("logs")}
            className={menuClass(orgModule === "logs")}
          >
            <FileText size={18} /> Horas y evidencias
          </button>
          <button
            onClick={() => setOrgModule("reports")}
            className={menuClass(orgModule === "reports")}
          >
            <FolderOpen size={18} /> Reportes
          </button>
          <button
            onClick={() => setOrgModule("materials")}
            className={menuClass(orgModule === "materials")}
          >
            <BookOpen size={18} /> Material institucional
          </button>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-2xl text-sm border border-red-200 text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={18} /> Cerrar sesión
        </button>
      </aside>

      <main className="flex-1 p-6 space-y-6">{renderContent()}</main>
    </div>
  );
}