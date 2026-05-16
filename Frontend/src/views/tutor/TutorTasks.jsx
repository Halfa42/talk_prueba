import React, { useEffect, useState } from "react";
import "../../styles/tutor/TutorTasks.css";

const TUTOR_ID = 1; // TODO: obtener dinámicamente si hay login

export default function TutorTasks({ softCard }) {
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [form, setForm] = useState({ titulo: "", descripcion: "", id_asignacion: "", fecha_limite: "" });
  const [msg, setMsg] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/tareas/beneficiarios/${TUTOR_ID}`)
      .then(r => r.json())
      .then(setBeneficiarios);
    fetch(`http://localhost:3000/api/tareas/bytutor/${TUTOR_ID}`)
      .then(r => r.json())
      .then(setTareas);
    fetch(`http://localhost:3000/api/tareas/entregas/${TUTOR_ID}`)
      .then(r => r.json())
      .then(setEntregas);
  }, []);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const reloadTareas = () => {
    fetch(`http://localhost:3000/api/tareas/bytutor/${TUTOR_ID}`)
      .then(r => r.json())
      .then(setTareas);
  };

  const reloadEntregas = () => {
    fetch(`http://localhost:3000/api/tareas/entregas/${TUTOR_ID}`)
      .then(r => r.json())
      .then(setEntregas);
  };

  const handlePublicar = async () => {
    setMsg(null);
    if (!form.titulo || !form.id_asignacion) {
      setMsg({ tipo: "error", texto: "Título y beneficiario son obligatorios" });
      return;
    }
    try {
      let archivo_apoyo = null;
      if (archivo) {
        // Aquí podrías subir el archivo a un endpoint y obtener la URL, o guardar el nombre
        archivo_apoyo = archivo.name;
      }
      const res = await fetch("http://localhost:3000/api/tareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, archivo_apoyo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMsg({ tipo: "ok", texto: "Tarea publicada correctamente" });
      setForm({ titulo: "", descripcion: "", id_asignacion: "", fecha_limite: "" });
      setArchivo(null);
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Tareas y evaluación</h2>
        <p className="text-sm text-slate-500">
          Publica actividades y revisa entregas.
        </p>
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
            {entregas.length === 0 && <div className="text-slate-400">Sin entregas pendientes</div>}
            {entregas.map((e) => (
              <div
                key={e.id_entrega}
                className="p-3 rounded-xl bg-slate-50 border flex items-center justify-between text-sm"
              >
                <span>{e.titulo} - {e.nombre} {e.apellido_paterno}</span>
                <button className="px-3 py-2 rounded-xl bg-white border">
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
          {tareas.length === 0 && <div className="text-slate-400">Sin tareas asignadas</div>}
          {tareas.map((t) => (
            <div key={t.id_tarea} className="p-3 rounded-xl bg-slate-50 border">
              <div className="font-medium">{t.titulo}</div>
              <div className="text-xs text-slate-500">Para: {t.nombre} {t.apellido_paterno}</div>
              <div className="text-xs text-slate-500">Límite: {t.fecha_limite || "-"}</div>
              <div className="mt-2">
                <button
                  className="px-3 py-2 rounded-xl bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition text-sm"
                  onClick={() => handleDeleteTarea(t.id_tarea)}
                  disabled={deletingTaskId === t.id_tarea}
                >
                  {deletingTaskId === t.id_tarea ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
