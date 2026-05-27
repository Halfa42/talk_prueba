import React from "react";
import KpiCard from "../../components/KpiCard";
import { isActiveStatus } from "./helpers";

export default function DashboardSection({
  beneficiarios,
  tutores,
  asignaciones,
  hoursEvidence,
  softCard,
  setOrgModule,
}) {
  const totalHorasAcumuladas = (hoursEvidence || [])
    .reduce((acc, registro) => acc + Number(registro.horas || 0), 0)
    .toFixed(0);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <KpiCard
          title="Beneficiarios activos"
          value={beneficiarios.filter((b) => isActiveStatus(b.estatus)).length}
        />
        <KpiCard
          title="Tutores activos"
          value={tutores.filter((t) => isActiveStatus(t.estatus)).length}
        />
        <KpiCard
          title="Horas acumuladas"
          value={`${totalHorasAcumuladas} h`}
        />
      </div>

      <div className={softCard + " p-5"}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Asignaciones recientes</h2>
          <button
            onClick={() => setOrgModule("assignment")}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm"
          >
            Nueva asignación
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left p-3">Beneficiario</th>
                <th className="text-left p-3">Tutor</th>
                <th className="text-left p-3">Nivel</th>
                <th className="text-left p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {asignaciones.slice(0, 5).map((item) => (
                <tr
                  key={item.id_asignacion}
                  className="border-t border-slate-200 bg-white"
                >
                  <td className="p-3">{item.beneficiario}</td>
                  <td className="p-3">{item.tutor}</td>
                  <td className="p-3">{item.nivel}</td>
                  <td className="p-3">{item.estatus}</td>
                </tr>
              ))}
              {asignaciones.length === 0 && (
                <tr>
                  <td className="p-4 text-slate-500" colSpan="4">
                    No hay asignaciones registradas.
                  </td>
                </tr>
              )}
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
}