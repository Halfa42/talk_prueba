import React, { useState, useEffect } from "react";

export default function StudentTasks({ softCard }) {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : {};
  const usuarioId = user.id_usuario;

  const [tareas, setTareas] = useState([]);
  const [selectedTarea, setSelectedTarea] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formUpload, setFormUpload] = useState({ id_tarea: "", comentario: "" });
  const [archivo, setArchivo] = useState(null);
  const [msg, setMsg] = useState(null);

  const loadTareas = () => {
    fetch(`http://localhost:3000/api/tareas/beneficiario/${usuarioId}`)
      .then(r => r.json())
      .then(data => setTareas(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error al cargar tareas:", err));
  };

  useEffect(() => {
    if (usuarioId) {
      loadTareas();
    }
  }, [usuarioId]);

  const openModal = (tarea) => {
    setSelectedTarea(tarea);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTarea(null);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setFormUpload(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleEntregar = async () => {
    setMsg(null);
    
    if (!formUpload.id_tarea || !archivo) {
      setMsg({ tipo: "error", texto: "Debes seleccionar una tarea y adjuntar un archivo." });
      return;
    }

    try {
      const archivo_entregado = archivo.name; 

      const res = await fetch("http://localhost:3000/api/tareas/entregas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id_tarea: formUpload.id_tarea, 
          comentario_entrega: formUpload.comentario, 
          archivo_entregado 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMsg({ tipo: "ok", texto: "¡Tarea entregada correctamente!" });
      setFormUpload({ id_tarea: "", comentario: "" });
      setArchivo(null);
      
      document.getElementById("archivoEntrega").value = ""; 
      loadTareas(); 
    } catch (err) {
      setMsg({ tipo: "error", texto: err.message });
    }
  };

  return (
    <div className="space-y-6 relative">
      <div>
        <h2 className="text-2xl font-bold">Tareas</h2>
        <p className="text-sm text-slate-500">Revisa tus actividades y entrega tus trabajos.</p>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        {/* TABLA DE TAREAS PENDIENTES */}
        <div className={softCard + " p-5 overflow-hidden flex flex-col"}>
          <h3 className="font-semibold text-lg mb-4">Pendientes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-slate-500 text-sm">
                  <th className="pb-3 font-medium">Nombre</th>
                  <th className="pb-3 font-medium">Vencimiento</th>
                  <th className="pb-3 font-medium text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {tareas.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-slate-400">No hay tareas pendientes</td>
                  </tr>
                ) : (
                  tareas.map(t => (
                    <tr key={t.id_tarea} className="border-b last:border-0 hover:bg-slate-50 transition">
                      <td className="py-3 font-medium flex items-center gap-2">
                         {/* Indicador visual de si está entregada */}
                        <div className={`w-2 h-2 rounded-full ${t.estatus === 'entregada' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                        {t.titulo}
                      </td>
                      <td className="py-3 text-slate-600">
                        {t.fecha_limite ? new Date(t.fecha_limite).toLocaleDateString() : 'Sin fecha'}
                      </td>
                      <td className="py-3 text-center">
                        <button 
                          onClick={() => openModal(t)}
                          className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition"
                        >
                          Detalles
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className={softCard + " p-5"}>
          <h3 className="font-semibold text-lg mb-4">Subir entrega</h3>
          
          <select 
            className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3 bg-white"
            name="id_tarea"
            value={formUpload.id_tarea}
            onChange={handleChange}
          >
            <option value="">-- Selecciona una tarea --</option>
            {tareas.filter(t => t.estatus !== 'entregada').map(t => (
              <option key={t.id_tarea} value={t.id_tarea}>{t.titulo}</option>
            ))}
          </select>

          <textarea 
            className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3" 
            rows="4" 
            placeholder="Comentario para tu tutor (Opcional)" 
            name="comentario"
            value={formUpload.comentario}
            onChange={handleChange}
          />
          
          <input
            id="archivoEntrega"
            type="file"
            className="w-full text-sm text-slate-600 cursor-pointer file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border file:border-blue-200 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100 mb-4"
            onChange={e => setArchivo(e.target.files[0] || null)}
          />

          <div className="flex items-center justify-between">
            <button 
              onClick={handleEntregar}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white font-medium shadow-sm"
            >
              Entregar tarea
            </button>
            {msg && (
              <span className={`text-sm font-medium ${msg.tipo === "error" ? "text-red-500" : "text-green-600"}`}>
                {msg.texto}
              </span>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && selectedTarea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Detalles de Tarea</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Título</h4>
                <p className="text-slate-800 font-medium">{selectedTarea.titulo}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Instrucciones</h4>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedTarea.descripcion || "Sin instrucciones detalladas."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Vencimiento</h4>
                  <p className="text-slate-700">
                    {selectedTarea.fecha_limite ? new Date(selectedTarea.fecha_limite).toLocaleDateString() : 'No asignada'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Estatus</h4>
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${selectedTarea.estatus === 'entregada' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {selectedTarea.estatus === 'entregada' ? 'Entregada' : 'Pendiente'}
                  </span>
                </div>
              </div>

              {selectedTarea.archivo_apoyo && (
                <div className="pt-4 border-t mt-4 flex justify-between items-center">
                  <span className="text-sm text-slate-500">Material de apoyo incluido</span>
                  <a 
                    href={`http://localhost:3000${selectedTarea.archivo_apoyo}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 border rounded-xl text-sm font-medium transition"
                  >
                    Descargar Archivo
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}