import React, { useEffect, useState } from "react";
import "../../styles/tutor/TutorHours.css";

export default function TutorHours({ softCard, tutorId }) {
  const [hoursData, setHoursData] = useState({
    horas_registradas: 0,
    horas_validadas: 0,
    pendientes: 0,
    bitacoras: [],
    periodo: "Ago-Dic",
    beneficiarios: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pageBitacoras, setPageBitacoras] = useState(1);
  const itemsPerPage = 5;
  const [selectedBitacora, setSelectedBitacora] = useState(null);

  useEffect(() => {
    const loadHours = async () => {
      if (!tutorId) return;

      try {
        setLoading(true);
        setError("");
        const response = await fetch(`http://localhost:3000/api/dashboard/${tutorId}/hours`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "No se pudieron cargar las horas");
        }
        
        setHoursData({
          horas_registradas: Number(data.horas_registradas || 0),
          horas_validadas: Number(data.horas_validadas || 0),
          pendientes: Number(data.pendientes || 0),
          bitacoras: Array.isArray(data.bitacoras) ? data.bitacoras : [],
          periodo: data.periodo || "Ago-Dic",
          beneficiarios: Number(data.beneficiarios || 1)
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadHours();
  }, [tutorId]);

  const calcularHorasAcreditadas = (validadas, periodo, beneficiarios) => {
    let horas80Max = 144;
    let horasRequeridas80 = 28 * beneficiarios;

    if (periodo === "Verano" || periodo === "Invierno") {
      horas80Max = 160;
      horasRequeridas80 = 58; 
    }

    if (horasRequeridas80 === 0 || validadas === 0) {
      return 0;
    }

    if (validadas >= horasRequeridas80) {
      return horas80Max;
    } else {
      return Math.round((validadas / horasRequeridas80) * horas80Max);
    }
  };

  const horasAcreditadasCalculadas = calcularHorasAcreditadas(
    hoursData.horas_validadas,
    hoursData.periodo,
    hoursData.beneficiarios
  );

  const totalPagesBitacoras = Math.ceil(hoursData.bitacoras.length / itemsPerPage);
  const currentBitacoras = hoursData.bitacoras.slice(
    (pageBitacoras - 1) * itemsPerPage,
    pageBitacoras * itemsPerPage
  );

  const openBitacoraModal = (bitacora) => setSelectedBitacora(bitacora);
  const closeBitacoraModal = () => setSelectedBitacora(null);

  return (
    <div className="space-y-6 flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Horas y evidencias</h2>
        <p className="text-sm text-slate-500">
          Consulta tus bitácoras y el progreso de tus horas acreditadas.
        </p>
      </div>

      <div className={`${softCard} p-5`}>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Horas registradas </span>
            <span className="font-medium">{hoursData.horas_registradas} h</span>
          </div>
          <div className="flex justify-between">
            <span>Horas validadas </span>
            <span className="font-semibold text-green-600">{hoursData.horas_validadas} h</span>
          </div>
          <div className="flex justify-between border-t pt-2 mt-2">
            <span>Horas acreditadas </span>
            <span className="font-bold text-blue-600">{horasAcreditadasCalculadas} h</span>
          </div>
        </div>
      </div>

      <div className={`${softCard} p-5`}>
        <h3 className="font-semibold text-lg mb-4">Historial de Bitácoras</h3>
        
        {loading ? (
          <div className="h-48 rounded-2xl bg-slate-50 border flex items-center justify-center text-slate-500">
            Cargando bitácoras...
          </div>
        ) : error ? (
          <div className="h-48 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-4 font-medium">Fecha</th>
                  <th className="p-4 font-medium">Tipo</th>
                  <th className="p-4 font-medium">Horas</th>
                  <th className="p-4 font-medium">Estatus</th>
                  <th className="p-4 font-medium text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentBitacoras.map((b) => (
                  <tr key={b.id_bitacora} className="hover:bg-slate-50 bg-white">
                    <td className="p-4">{b.fecha_sesion_formateada}</td>
                    <td className="p-4 capitalize">{b.tipo}</td>
                    <td className="p-4 font-semibold">{b.horas_calculadas} h</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize 
                        ${b.estatus === 'sin revisar' ? 'bg-amber-100 text-amber-700' : 
                          b.estatus === 'aceptada' ? 'bg-green-100 text-green-700' : 
                          'bg-red-100 text-red-700'}`}
                      >
                        {b.estatus === 'sin revisar' ? 'Pendiente' : b.estatus}
                      </span>
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      <button
                        onClick={() => openBitacoraModal(b)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        Detalles
                      </button>
                    </td>
                  </tr>
                ))}
                {currentBitacoras.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500 bg-white">
                      No tienes bitácoras registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex justify-between items-center p-3 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setPageBitacoras((p) => Math.max(1, p - 1))}
                disabled={pageBitacoras === 1}
                className="px-3 py-1 bg-white border border-slate-300 rounded text-sm disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-sm text-slate-500">
                Página {pageBitacoras} de {totalPagesBitacoras || 1}
              </span>
              <button
                onClick={() => setPageBitacoras((p) => Math.min(totalPagesBitacoras, p + 1))}
                disabled={pageBitacoras === totalPagesBitacoras || totalPagesBitacoras === 0}
                className="px-3 py-1 bg-white border border-slate-300 rounded text-sm disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedBitacora && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Detalles de tu Bitácora</h3>
              <button
                onClick={closeBitacoraModal}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                Cerrar
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Fecha de Sesión</p>
                  <p className="text-slate-800">{selectedBitacora.fecha_sesion_formateada}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Horas Calculadas</p>
                  <p className="text-slate-800 font-semibold">{selectedBitacora.horas_calculadas} h</p>
                </div>
              </div>

              {selectedBitacora.tema_bitacora && (
                <div>
                  <p className="text-sm text-slate-500 font-medium">Tema / Actividad</p>
                  <p className="text-slate-800">{selectedBitacora.tema_bitacora}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-slate-500 font-medium">Descripción</p>
                <p className="text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100 mt-1">
                  {selectedBitacora.descripcion || "Sin descripción"}
                </p>
              </div>

              {selectedBitacora.planeacion_siguiente_sesion && (
                <div>
                  <p className="text-sm text-slate-500 font-medium">Planeación de la Siguiente Sesión</p>
                  <p className="text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100 mt-1">
                    {selectedBitacora.planeacion_siguiente_sesion}
                  </p>
                </div>
              )}

              {selectedBitacora.tareas_asignadas && (
                <div>
                  <p className="text-sm text-slate-500 font-medium">Tareas Asignadas</p>
                  <p className="text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100 mt-1">
                    {selectedBitacora.tareas_asignadas}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-2">
                <p className="text-sm text-slate-500 font-medium">Evidencias Adjuntas</p>
                <div className="flex flex-wrap gap-3">
                  {selectedBitacora.tiene_recordatorio && (
                    <a
                      href={`http://localhost:3000/api/org/bitacoras/${selectedBitacora.id_bitacora}/imagen/recordatorio`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition text-center flex-1"
                    >
                      Ver Recordatorio
                    </a>
                  )}
                  {selectedBitacora.tiene_sesion && (
                    <a
                      href={`http://localhost:3000/api/org/bitacoras/${selectedBitacora.id_bitacora}/imagen/sesion`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition text-center flex-1"
                    >
                      Ver Sesión
                    </a>
                  )}
                  {selectedBitacora.tiene_incidencia && (
                    <a
                      href={`http://localhost:3000/api/org/bitacoras/${selectedBitacora.id_bitacora}/imagen/incidencia`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition text-center flex-1"
                    >
                      Ver Incidencia
                    </a>
                  )}
                  {!selectedBitacora.tiene_recordatorio && !selectedBitacora.tiene_sesion && !selectedBitacora.tiene_incidencia && (
                    <span className="text-sm text-slate-400 italic">No hay archivos adjuntos en esta bitácora.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">Estatus de revisión:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-bold capitalize 
                ${selectedBitacora.estatus === 'sin revisar' ? 'bg-amber-100 text-amber-700' : 
                  selectedBitacora.estatus === 'aceptada' ? 'bg-green-100 text-green-700' : 
                  'bg-red-100 text-red-700'}`}
              >
                {selectedBitacora.estatus === 'sin revisar' ? 'Pendiente' : selectedBitacora.estatus}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}