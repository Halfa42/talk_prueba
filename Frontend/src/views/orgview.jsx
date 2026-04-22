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
} from "lucide-react";
import KpiCard from "../components/KpiCard";

export default function OrgView() {
  const [orgModule, setOrgModule] = useState("dashboard");

  const softCard = "bg-white rounded-2xl border border-slate-200 shadow-sm";
  const menuClass = (active) =>
    `w-full flex items-center gap-3 text-left px-4 py-3 rounded-2xl text-sm border transition ${active ? "bg-blue-600 text-white border-blue-600 font-medium shadow-sm" : "bg-white border-transparent hover:bg-slate-50"}`;

  const renderContent = () => {
    if (orgModule === "dashboard")
      return (
        <div className="space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <KpiCard
              title="Beneficiarios activos"
              value="42"
              hint="5 con seguimiento prioritario"
            />
            <KpiCard
              title="Tutores activos"
              value="12"
              hint="2 pendientes de validación"
            />
            <KpiCard
              title="Sesiones registradas"
              value="186"
              hint="11 por revisar"
            />
            <KpiCard
              title="Horas acumuladas"
              value="394 h"
              hint="352 h validadas"
            />
          </div>
          <div className="grid xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <div className={softCard + " p-5"}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    Asignaciones recientes
                  </h2>
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
                        ["Fernanda Gil", "Paola Díaz", "2026-A", "Seguimiento"],
                      ].map((row, i) => (
                        <tr
                          key={i}
                          className="border-t border-slate-200 bg-white"
                        >
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
              <div className={softCard + " p-5"}>
                <h3 className="font-semibold text-lg mb-4">
                  Alertas operativas
                </h3>
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
            <div className={softCard + " p-5"}>
              <h3 className="font-semibold text-lg mb-4">Resumen general</h3>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Sesiones hoy</span>
                  <span>14</span>
                </div>
                <div className="flex justify-between">
                  <span>Casos en seguimiento</span>
                  <span>6</span>
                </div>
                <div className="flex justify-between">
                  <span>Materiales publicados</span>
                  <span>28</span>
                </div>
                <div className="flex justify-between">
                  <span>Reportes del periodo</span>
                  <span>4</span>
                </div>
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
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["María López", "A2", "Ana Ruiz", "92%", "Activa"],
                    ["Carlos Vega", "A1", "Luis Rojas", "78%", "Seguimiento"],
                    ["Fernanda Gil", "B1", "Paola Díaz", "95%", "Activa"],
                  ].map((row, i) => (
                    <tr key={i} className="border-t border-slate-200 bg-white">
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
          <div className="grid md:grid-cols-3 gap-4">
            {[
              ["Ana Ruiz", "8 beneficiarios", "41 h"],
              ["Luis Rojas", "6 beneficiarios", "36 h"],
              ["Paola Díaz", "5 beneficiarios", "29 h"],
            ].map(([name, load, hours]) => (
              <div key={name} className={softCard + " p-5"}>
                <div className="font-semibold text-lg">{name}</div>
                <div className="text-sm text-slate-500 mt-1">{load}</div>
                <div className="mt-4 inline-block rounded-xl bg-slate-100 px-3 py-2 text-sm">
                  {hours}
                </div>
              </div>
            ))}
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
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-xl bg-slate-50 border">
                  María López — Ana Ruiz
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border">
                  Carlos Vega — Luis Rojas
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    if (orgModule === "tracking")
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Seguimiento académico</h2>
            <p className="text-sm text-slate-500">
              Revisa avance, tareas, asistencia y observaciones por
              beneficiario.
            </p>
          </div>
          <div className={softCard + " p-5"}>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="text-left p-3">Beneficiario</th>
                    <th className="text-left p-3">Nivel actual</th>
                    <th className="text-left p-3">Tareas</th>
                    <th className="text-left p-3">Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["María López", "A2", "12/14", "Buen desempeño"],
                    ["Carlos Vega", "A1", "8/14", "Reforzar asistencia"],
                    ["Fernanda Gil", "B1", "14/14", "Constante"],
                  ].map((row, i) => (
                    <tr key={i} className="border-t border-slate-200 bg-white">
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
      );

    if (orgModule === "logs")
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">
              Horas, bitácoras y evidencias
            </h2>
            <p className="text-sm text-slate-500">
              Supervisión operativa del trabajo de tutores y seguimiento por
              sesión.
            </p>
          </div>
          <div className="grid xl:grid-cols-[1fr,320px] gap-6">
            <div className={softCard + " p-5"}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Registros recientes</h3>
                <div className="flex gap-2 text-sm">
                  <button className="px-3 py-2 rounded-xl bg-slate-100">
                    Filtrar
                  </button>
                  <button className="px-3 py-2 rounded-xl bg-slate-100">
                    Exportar
                  </button>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="text-left p-3">Tutor</th>
                      <th className="text-left p-3">Alumno</th>
                      <th className="text-left p-3">Tipo</th>
                      <th className="text-left p-3">Fecha</th>
                      <th className="text-left p-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [
                        "Ana Ruiz",
                        "María López",
                        "Bitácora",
                        "10/03/2026",
                        "Validado",
                      ],
                      [
                        "Luis Rojas",
                        "Carlos Vega",
                        "Evidencia",
                        "10/03/2026",
                        "Pendiente",
                      ],
                      [
                        "Paola Díaz",
                        "Fernanda Gil",
                        "Sesión",
                        "09/03/2026",
                        "Validado",
                      ],
                    ].map((row, i) => (
                      <tr
                        key={i}
                        className="border-t border-slate-200 bg-white"
                      >
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
            <div className="space-y-6">
              <div className={softCard + " p-5"}>
                <h3 className="font-semibold mb-4">Resumen</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Bitácoras</span>
                    <span>71</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Evidencias</span>
                    <span>58</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sesiones por validar</span>
                    <span>11</span>
                  </div>
                </div>
              </div>
              <div className={softCard + " p-5"}>
                <h3 className="font-semibold mb-4">Alertas</h3>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                    4 bitácoras aún no tienen revisión.
                  </div>
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                    2 sesiones exceden horas esperadas.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    if (orgModule === "reports")
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Reportes básicos</h2>
            <p className="text-sm text-slate-500">
              Consulta resúmenes del periodo y descargas sencillas.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              "Reporte de avance",
              "Reporte de horas",
              "Reporte de asistencia",
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

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Material institucional</h2>
          <p className="text-sm text-slate-500">
            Publica y organiza recursos para uso de tutores.
          </p>
        </div>
        <div className="grid xl:grid-cols-2 gap-6">
          <div className={softCard + " p-5"}>
            <h3 className="font-semibold text-lg mb-4">Subir material</h3>
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3"
              placeholder="Título"
            />
            <textarea
              className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3"
              rows="4"
              placeholder="Descripción"
            />
            <button className="px-4 py-2 rounded-xl bg-blue-600 text-white">
              Guardar material
            </button>
          </div>
          <div className={softCard + " p-5"}>
            <h3 className="font-semibold text-lg mb-4">Biblioteca</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-50 border">
                Guía de sesión inicial
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border">
                Material A1
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border">
                Formato de bitácora
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-[760px] bg-slate-50">
      <aside className="w-72 bg-white border-r border-slate-200 p-4 space-y-2">
        <button
          onClick={() => setOrgModule("dashboard")}
          className={menuClass(orgModule === "dashboard")}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>
        <button
          onClick={() => setOrgModule("beneficiaries")}
          className={menuClass(orgModule === "beneficiaries")}
        >
          <GraduationCap size={18} />
          Beneficiarios
        </button>
        <button
          onClick={() => setOrgModule("tutors")}
          className={menuClass(orgModule === "tutors")}
        >
          <Users size={18} />
          Tutores
        </button>
        <button
          onClick={() => setOrgModule("assignment")}
          className={menuClass(orgModule === "assignment")}
        >
          <CalendarDays size={18} />
          Asignaciones
        </button>
        <button
          onClick={() => setOrgModule("tracking")}
          className={menuClass(orgModule === "tracking")}
        >
          <ClipboardList size={18} />
          Seguimiento
        </button>
        <button
          onClick={() => setOrgModule("logs")}
          className={menuClass(orgModule === "logs")}
        >
          <FileText size={18} />
          Horas y evidencias
        </button>
        <button
          onClick={() => setOrgModule("reports")}
          className={menuClass(orgModule === "reports")}
        >
          <FolderOpen size={18} />
          Reportes
        </button>
        <button
          onClick={() => setOrgModule("materials")}
          className={menuClass(orgModule === "materials")}
        >
          <BookOpen size={18} />
          Material institucional
        </button>
      </aside>
      <main className="flex-1 p-6 space-y-6">{renderContent()}</main>
    </div>
  );
}
