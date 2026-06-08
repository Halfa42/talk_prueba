import React from "react";

export default function ReviewerReports({ softCard, setStatusMessage }) {
  const handleDownloadReport = (type, filename) => {
    try {
      window.open(`http://localhost:3000/api/org/reportes/${type}`, "_blank");
      setStatusMessage(`✅ Descargando ${filename}...`);
    } catch (error) {
      console.error(error);
      setStatusMessage("❌ No se pudo descargar el reporte.");
    }
  };

  return (
    <div className={`${softCard} p-6`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Módulo de Reportes</h2>
        <p className="text-sm text-slate-500 mt-1">
          Descarga archivos CSV con la información actualizada directamente de la base de datos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-lg text-slate-700 mb-2">Reporte de Beneficiarios</h4>
            <p className="text-sm text-slate-500 mb-4">
              Genera la lista completa de alumnos, sus niveles, idiomas y tutores asignados en el ciclo actual.
            </p>
          </div>
          <button
            onClick={() => handleDownloadReport("beneficiarios", "reporte_beneficiarios.csv")}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition"
          >
            Descargar Beneficiarios
          </button>
        </div>

        <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-lg text-slate-700 mb-2">Reporte General de Tutores</h4>
            <p className="text-sm text-slate-500 mb-4">
              Exporta los perfiles de tutores, idiomas impartidos, periodos y cantidad de beneficiarios asignados.
            </p>
          </div>
          <button
            onClick={() => handleDownloadReport("tutores", "reporte_tutores.csv")}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition"
          >
            Descargar Perfiles Tutores
          </button>
        </div>

        <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-lg text-slate-700 mb-2">Reporte de Horas Validadas</h4>
            <p className="text-sm text-slate-500 mb-4">
              Obtén el desglose detallado de las horas validadas acumuladas de servicio social por cada tutor.
            </p>
          </div>
          <button
            onClick={() => handleDownloadReport("horas", "reporte_horas_tutores.csv")}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition"
          >
            Descargar Conteo Horas
          </button>
        </div>
      </div>
    </div>
  );
}