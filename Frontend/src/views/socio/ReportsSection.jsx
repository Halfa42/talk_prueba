import React from "react";
import axios from "axios";

export default function ReportsSection({ softCard, setStatusMessage }) {
  const reports = [
    {
      title: "Reporte de beneficiarios",
      url: "http://localhost:3000/api/org/reportes/beneficiarios",
      filename: "reporte_beneficiarios.csv",
    },
    {
      title: "Reporte de tutores",
      url: "http://localhost:3000/api/org/reportes/tutores",
      filename: "reporte_tutores.csv",
    },
    {
      title: "Reporte de horas",
      url: "http://localhost:3000/api/org/reportes/horas",
      filename: "reporte_horas_tutores.csv",
    },
  ];

  const handleDownload = async (item) => {
    try {
      const response = await axios.get(item.url, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", item.filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setStatusMessage(`✅ ${item.title} descargado correctamente.`);
    } catch {
      setStatusMessage(`❌ No se pudo descargar ${item.title}.`);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Reportes</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {reports.map((item) => (
          <div key={item.title} className={softCard + " p-5"}>
            <div className="font-semibold">{item.title}</div>
            <button
              className="mt-4 px-3 py-2 rounded-xl bg-slate-100 text-sm"
              onClick={() => handleDownload(item)}
            >
              Descargar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}