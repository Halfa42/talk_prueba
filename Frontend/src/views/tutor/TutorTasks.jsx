import React, { useEffect, useState } from "react";
import "../../styles/tutor/TutorTasks.css";

export default function TutorTasks({ softCard }) {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : {};
  const tutorId = user.id_tutor || user.id_usuario;

  const [beneficiarios, setBeneficiarios] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [form, setForm] = useState({ titulo: "", descripcion: "", id_asignacion: "", fecha_limite: "" });
  const [msg, setMsg] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const [selectedEntrega, setSelectedEntrega] = useState(null);
  const [calificacionForm, setCalificacionForm] = useState({ calificacion: "", retroalimentacion: "" });
  const [modalMsg, setModalMsg] = useState(null);

  const loadBeneficiarios = () => {
    fetch(`http://localhost:3000/api/tareas/beneficiarios/${tutorId}`)
      .then(r => r.json())
      .then(data => setBeneficiarios(Array.isArray(data) ? data : []));
  };

  const reloadTareas = () => {
    fetch(`http://localhost:3000/api/tareas/bytutor/${tutorId}`)
      .then(r => r.json())
      .then(data => setTareas(Array.isArray(data) ? data : []));
  };

  const reloadEntregas = () => {
    fetch(`http://localhost:3000/api/tareas/entregas/${tutorId}`)
      .then(r => r.json())
      .then(data => setEntregas(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    if (tutorId) {
      loadBeneficiarios();
      reloadTareas();
      reloadEntregas();
    }
  }, [tutorId]);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handlePublicar = async () => {
    setMsg(null);
    if (!form.titulo || !form.id_asignacion) {
      setMsg({ tipo: "error", texto: "Título y beneficiario son obligatorios" });
      return;
    }
    try {
      const formData = new FormData();
      formData.append("titulo", form.titulo);
      formData.append("descripcion", form.descripcion);
      formData.append("id_asignacion", form.id_asignacion);
      formData.append("fecha_limite", form.fecha_limite);
      
      if (archivo) {
        formData.append("archivo_apoyo", archivo);
      }

      const res = await fetch("http://localhost:3000/api/tareas", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setMsg({ tipo: "ok", texto: "Tarea publicada correctamente" });
      setForm({ titulo: "", descripcion: "", id_asignacion: "", fecha_limite: "" });
      setArchivo(null);
      
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
      
      reloadTareas();
    } catch (err) {
      setMsg({ tipo: "error", texto: err.message });
    }
  };

  const handleDeleteTarea = async (tareaId) => {
    const confirmed = window.confirm("¿Seguro que deseas eliminar esta tarea?");
    if (!confirmed) return;

    try {
      setDeletingTaskId(tareaId);
      setMsg(null);
      const res = await fetch(`http://localhost:3000/api/tareas/${tareaId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudo eliminar la tarea");

      setMsg({ tipo: "ok", texto: "Tarea eliminada correctamente" });
      reloadTareas();
      reloadEntregas();
    } catch (err) {
      setMsg({ tipo: "error", texto: err.message });
    } finally {
      setDeletingTaskId(null);
    }
  };

  const openCalificarModal = (entrega) => {
    setSelectedEntrega(entrega);
    setCalificacionForm({ calificacion: "", retroalimentacion: "" });
    setModalMsg(null);
  };

  const handleDownloadEntrega = () => {
    window.open(`http://localhost:3000/api/tareas/entregas/${selectedEntrega.id_entrega}/download`, "_blank");
  };

  const handleCalificarSubmit = async () => {
    try {
      setModalMsg(null);
      if (calificacionForm.calificacion === "") {
        setModalMsg({ tipo: "error", texto: "Ingresa una calificación" });
        return;
      }

      const res = await fetch(`http://localhost:3000/api/tareas/entregas/${selectedEntrega.id_entrega}/calificar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calificacion: calificacionForm.calificacion,
          retroalimentacion: calificacionForm.retroalimentacion,
          id_tarea: selectedEntrega.id_tarea
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setModalMsg({ tipo: "ok", texto: "Calificada correctamente" });
      
      setTimeout(() => {
        setSelectedEntrega(null);
        reloadEntregas(); 
        reloadTareas();   
      }, 1500);

    } catch (err) {
      setModalMsg({ tipo: "error", texto: err.message });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Tareas y evaluación</h2>
        <p className="text-sm text-slate-500">Publica actividades y revisa entregas.</p>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <div className={softCard + " p-5"}>
          <h3 className="font-semibold text-lg mb-4">Asignar tarea</h3>

          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3"
            placeholder="Título de la tarea"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
          />

          <textarea
            className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3"
            rows="4"
            placeholder="Instrucciones"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
          />

          <div className="grid md:grid-cols-2 gap-3">
            <select
              className="rounded-xl border border-slate-300 px-4 py-3 bg-white"
              name="id_asignacion"
              value={form.id_asignacion}
              onChange={handleChange}
            >
              <option value="">Selecciona beneficiario</option>
              {beneficiarios.map(b => (
                <option key={b.id_asignacion} value={b.id_asignacion}>
                  {b.nombre} {b.apellido_paterno}
                </option>
              ))}
            </select>
            <input
              type="date"
              className="rounded-xl border border-slate-300 px-4 py-3 bg-white"
              name="fecha_limite"
              value={form.fecha_limite}
              onChange={handleChange}
            />
          </div>
          <input
            type="file"
            className="mt-3 w-full text-sm text-slate-600 cursor-pointer file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border file:border-blue-200 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100"
            onChange={e => setArchivo(e.target.files[0] || null)}
          />
          <button
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white"
            onClick={handlePublicar}
          >
            Publicar tarea
          </button>
          {msg && (
            <p className={`mt-2 text-sm ${msg.tipo === "ok" ? "text-green-600" : "text-red-600"}`}>{msg.texto}</p>
          )}
        </div>

        <div className={softCard + " p-5"}>
          <h3 className="font-semibold text-lg mb-4">Entregas por revisar</h3>
          <div className="space-y-3">
            {entregas.length === 0 && <div className="text-slate-400 text-sm">Sin entregas pendientes</div>}
            {entregas.map((e) => (
              <div
                key={e.id_entrega}
                className="p-3 rounded-xl bg-slate-50 border flex items-center justify-between text-sm"
              >
                <div>
                    <div className="font-medium">{e.titulo}</div>
                    <div className="text-slate-500">Alumno: {e.nombre} {e.apellido_paterno}</div>
                </div>
                <button 
                    onClick={() => openCalificarModal(e)}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-300 hover:border-blue-400 hover:text-blue-600 transition"
                >
                  Calificar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={softCard + " p-5"}>
        <h3 className="font-semibold text-lg mb-4">Tareas publicadas</h3>
        <div className="space-y-2">
          {tareas.length === 0 && <div className="text-slate-400 text-sm">Sin tareas asignadas</div>}
          {tareas.map((t) => (
            <div key={t.id_tarea} className="p-4 rounded-xl bg-slate-50 border flex justify-between items-center">
              <div>
                <div className="font-medium flex items-center gap-2">
                    {t.titulo}
                    {t.estatus === "calificada" && (
                       <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Calificada</span>
                    )}
                    {t.estatus === "entregada" && (
                       <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">Entregada</span>
                    )}
                </div>
                <div className="text-xs text-slate-500 mt-1">Para: {t.nombre} {t.apellido_paterno}</div>
                <div className="text-xs text-slate-500">Límite: {t.fecha_limite || "-"}</div>
              </div>
              <button
                className="px-3 py-2 rounded-xl bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition text-sm"
                onClick={() => handleDeleteTarea(t.id_tarea)}
                disabled={deletingTaskId === t.id_tarea}
              >
                {deletingTaskId === t.id_tarea ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedEntrega && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold mb-4">Calificar Entrega</h3>
            
            <div className="mb-4 text-sm text-slate-700 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p><strong className="text-slate-900">Tarea:</strong> {selectedEntrega.titulo}</p>
              <p><strong className="text-slate-900">Alumno:</strong> {selectedEntrega.nombre} {selectedEntrega.apellido_paterno}</p>
              <p><strong className="text-slate-900">Comentarios:</strong> {selectedEntrega.comentario_entrega || "Ninguno"}</p>
              
              {selectedEntrega.archivo_entregado ? (
                <button
                  onClick={handleDownloadEntrega}
                  className="mt-3 inline-flex text-blue-600 hover:text-blue-800 font-medium underline"
                >
                  Descargar evidencia adjunta
                </button>
              ) : (
                <p className="text-slate-400 italic mt-2">No adjuntó archivo</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Calificación (0-100)</label>
              <input
                type="number"
                min="0" max="100"
                className="w-full rounded-xl border border-slate-300 px-4 py-2"
                value={calificacionForm.calificacion}
                onChange={e => setCalificacionForm({ ...calificacionForm, calificacion: e.target.value })}
                placeholder="Ej. 100"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Retroalimentación (Opcional)</label>
              <textarea
                className="w-full rounded-xl border border-slate-300 px-4 py-2"
                rows="3"
                value={calificacionForm.retroalimentacion}
                onChange={e => setCalificacionForm({ ...calificacionForm, retroalimentacion: e.target.value })}
                placeholder="Escribe tus comentarios para el alumno..."
              />
            </div>

            {modalMsg && (
              <p className={`mb-4 text-sm ${modalMsg.tipo === "ok" ? "text-green-600" : "text-red-600"}`}>
                {modalMsg.texto}
              </p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition"
                onClick={() => setSelectedEntrega(null)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                onClick={handleCalificarSubmit}
              >
                Guardar Calificación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}