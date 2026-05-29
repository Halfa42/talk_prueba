import React, { useEffect, useState } from "react";
import { Users, FolderOpen, ClipboardList, Clock3 } from "lucide-react";
import KpiCard from "../../components/KpiCard";
import "../../styles/tutor/TutorDashboard.css";

const quickActions = [
  ["students", "Mis alumnos", "Consulta perfiles y avance.", Users],
  ["materials", "Materiales", "Consulta recursos compartidos.", FolderOpen],
  ["tasks", "Tareas", "Asigna y revisa entregas.", ClipboardList],
  ["hours", "Horas", "Consulta horas registradas.", Clock3],
];

export default function TutorDashboard({ softCard, onModuleChange }) {
  const userContext = JSON.parse(localStorage.getItem("user") || "{}");
  const tutorId = userContext.id_tutor || userContext.id_usuario;
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [zoomLink, setZoomLink] = useState("");
  const [zoomMsg, setZoomMsg] = useState(null);
  const [summary, setSummary] = useState({
    tareas_por_revisar: 0,
    horas_acumuladas: 0,
  });
  const [calendarRows, setCalendarRows] = useState([]);
  const [students, setStudents] = useState([]);
  const [showAddSession, setShowAddSession] = useState(false);
  const [newSession, setNewSession] = useState({
    id_asignacion: "",
    dia_semana: "",
    hora_inicio: "",
    hora_fin: "",
  });
  const [horaFinTouched, setHoraFinTouched] = useState(false);
  const [calendarMsg, setCalendarMsg] = useState(null);
  const [deletingSessionId, setDeletingSessionId] = useState(null);

  const formatTimeAmPm = (timeValue) => {
    if (!timeValue) return "";
    const base = String(timeValue).slice(0, 5);
    const [hoursRaw, minutes] = base.split(":");
    const hours = Number(hoursRaw);
    if (!Number.isInteger(hours) || minutes === undefined) return base;
    const suffix = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${hours12}:${minutes} ${suffix}`;
  };

  const addOneHour = (time) => {
    if (!time) return "";
    const [h, m] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(h);
    date.setMinutes(m);
    date.setHours(date.getHours() + 1);
    return date.toTimeString().slice(0, 5);
  };

  const loadDashboardData = async () => {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) {
      console.error("No hay usuario en localStorage");
      return;
    }
    
    const user = JSON.parse(rawUser);
    const tutorId = user.id_tutor || user.id_usuario;

    if (!tutorId || tutorId === "undefined") {
      console.error("El tutorId es inválido:", tutorId);
      return;
    }

    try {
      const [summaryRes, calendarRes, studentsRes] = await Promise.all([
        fetch(`http://localhost:3000/api/dashboard/${tutorId}/summary`),
        fetch(`http://localhost:3000/api/dashboard/${tutorId}/calendario`),
        fetch(`http://localhost:3000/api/tutor-students?tutorId=${tutorId}`),
      ]);

      const summaryData = await summaryRes.json();
      const calendarData = await calendarRes.json();
      const studentsData = await studentsRes.json();

      setSummary(summaryData || { tareas_por_revisar: 0, horas_acumuladas: 0 });
      setCalendarRows(Array.isArray(calendarData) ? calendarData : []);
      setStudents(Array.isArray(studentsData) ? studentsData : []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  useEffect(() => {
    loadDashboardData();
    loadZoomLink();
  }, []);

  const loadZoomLink = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/zoom-link/${tutorId}`);
      const data = await res.json();
      setZoomLink(data?.zoom_link || "");
    } catch (error) {
      console.error(error);
    }
  };

  const saveZoomLink = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/zoom-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_tutor: tutorId,
          zoom_link: zoomLink,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setZoomMsg({
        tipo: "ok",
        texto: "Liga Zoom guardada.",
      });
    } catch (error) {
      setZoomMsg({
        tipo: "error",
        texto: error.message,
      });
    }
  };

  const handleSessionInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "hora_fin") {
      setHoraFinTouched(true);
    }

    setNewSession((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "hora_inicio" && !horaFinTouched) {
        updated.hora_fin = addOneHour(value);
      }
      return updated;
    });
  };

  const handleAddSession = async () => {
    setCalendarMsg(null);
    if (
      !newSession.id_asignacion ||
      newSession.dia_semana === "" ||
      !newSession.hora_inicio ||
      !newSession.hora_fin
    ) {
      setCalendarMsg({
        tipo: "error",
        texto: "Completa alumno, día y horario.",
      });
      return;
    }

    if (newSession.hora_fin <= newSession.hora_inicio) {
      setCalendarMsg({
        tipo: "error",
        texto: "La hora fin debe ser mayor que la hora inicio.",
      });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/dashboard/${tutorId}/calendario`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_asignacion: Number(newSession.id_asignacion),
            dia_semana: Number(newSession.dia_semana),
            hora_inicio: newSession.hora_inicio,
            hora_fin: newSession.hora_fin,
          }),
        },
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "No se pudo agregar la sesión");

      setCalendarMsg({ tipo: "ok", texto: "Sesión agregada al calendario." });
      setNewSession({
        id_asignacion: "",
        dia_semana: "",
        hora_inicio: "",
        hora_fin: "",
      });
      setHoraFinTouched(false);
      await loadDashboardData();
    } catch (error) {
      setCalendarMsg({ tipo: "error", texto: error.message });
    }
  };

  const handleDeleteSession = async (sessionId) => {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar esta sesión del calendario?",
    );
    if (!confirmed) return;

    try {
      setDeletingSessionId(sessionId);
      setCalendarMsg(null);
      const response = await fetch(
        `http://localhost:3000/api/dashboard/${tutorId}/calendario/${sessionId}`,
        {
          method: "DELETE",
        },
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "No se pudo eliminar la sesión");

      setCalendarMsg({ tipo: "ok", texto: "Sesión eliminada correctamente." });
      await loadDashboardData();
    } catch (error) {
      setCalendarMsg({ tipo: "error", texto: error.message });
    } finally {
      setDeletingSessionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-2">
        <KpiCard
          title="Tareas por revisar"
          value={String(summary.tareas_por_revisar ?? 0)}
        />
        <KpiCard
          title="Horas acreditadas"
          value={`${summary.horas_acreditadas ?? 0} h`}
        />
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
            <div className="mt-4">
              <button
                onClick={() => setShowZoomModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white"
              >
                Configurar Zoom
              </button>
            </div>
          </div>

          <div className={softCard + " p-5"}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Calendario</h3>
              <button
                onClick={() => setShowAddSession((prev) => !prev)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm"
              >
                Agregar sesión
              </button>
            </div>
            {showAddSession && (
              <div className="mb-4 p-4 rounded-xl border bg-slate-50 grid md:grid-cols-4 gap-3">
                <select
                  name="id_asignacion"
                  value={newSession.id_asignacion}
                  onChange={handleSessionInputChange}
                  className="rounded-xl border border-slate-300 px-3 py-2 bg-white"
                >
                  <option value="">Alumno</option>
                  {students.map((student) => (
                    <option
                      key={student.id_asignacion}
                      value={student.id_asignacion}
                    >
                      {student.nombre} {student.apellido_paterno}
                    </option>
                  ))}
                </select>
                <select
                  name="dia_semana"
                  value={newSession.dia_semana}
                  onChange={handleSessionInputChange}
                  className="rounded-xl border border-slate-300 px-3 py-2 bg-white"
                >
                  <option value="">Día</option>
                  <option value="1">Lunes</option>
                  <option value="2">Martes</option>
                  <option value="3">Miércoles</option>
                  <option value="4">Jueves</option>
                  <option value="5">Viernes</option>
                  <option value="6">Sábado</option>
                  <option value="0">Domingo</option>
                </select>
                <input
                  type="time"
                  name="hora_inicio"
                  value={newSession.hora_inicio}
                  onChange={handleSessionInputChange}
                  className="rounded-xl border border-slate-300 px-3 py-2 bg-white"
                />
                <input
                  type="time"
                  name="hora_fin"
                  value={newSession.hora_fin}
                  onChange={handleSessionInputChange}
                  className="rounded-xl border border-slate-300 px-3 py-2 bg-white"
                />
                <div className="md:col-span-4">
                  <button
                    onClick={handleAddSession}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm"
                  >
                    Guardar sesión
                  </button>
                  {calendarMsg && (
                    <p
                      className={`mt-2 text-sm ${calendarMsg.tipo === "ok" ? "text-green-600" : "text-red-600"}`}
                    >
                      {calendarMsg.texto}
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="text-left p-3">Alumno</th>
                    <th className="text-left p-3">Día</th>
                    <th className="text-left p-3">Horario</th>
                    <th className="text-left p-3">Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {calendarRows.length === 0 ? (
                    <tr className="border-t border-slate-200 bg-white">
                      <td className="p-3 text-slate-400" colSpan={4}>
                        Sin sesiones programadas
                      </td>
                    </tr>
                  ) : (
                    calendarRows.map((row) => (
                      <tr
                        key={row.id_sesion}
                        className="border-t border-slate-200 bg-white"
                      >
                        <td className="p-3">{row.alumno}</td>
                        <td className="p-3">{row.dia}</td>
                        <td className="p-3">
                          {formatTimeAmPm(row.hora_inicio)} -{" "}
                          {formatTimeAmPm(row.hora_fin)}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleDeleteSession(row.id_sesion)}
                            disabled={deletingSessionId === row.id_sesion}
                            className="px-3 py-2 rounded-xl bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition text-xs"
                          >
                            {deletingSessionId === row.id_sesion
                              ? "Eliminando..."
                              : "Eliminar"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={softCard + " p-5"}>
          <h3 className="font-semibold text-lg mb-4">Mis alumnos</h3>
          <div className="space-y-3 text-sm">
            {students.length === 0 && (
              <div className="p-3 rounded-xl bg-slate-50 border text-slate-500">
                No hay alumnos asignados todavía.
              </div>
            )}

            {students.slice(0, 6).map((student) => (
              <div key={student.id_asignacion} className="p-3 rounded-xl bg-slate-50 border">
                <div className="font-medium">
                  {student.nombre} {student.apellido_paterno}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {student.nivel} · {student.idioma_curso || student.idioma || "N/A"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showZoomModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[500px]">
            <h3 className="font-semibold text-lg mb-4">Configurar Zoom</h3>

            <input
              className="w-full border rounded-xl px-4 py-3"
              value={zoomLink}
              onChange={(e) => setZoomLink(e.target.value)}
              placeholder="https://zoom.us/j/..."
            />

            {zoomMsg && (
              <p
                className={`mt-2 ${
                  zoomMsg.tipo === "ok" ? "text-green-600" : "text-red-600"
                }`}
              >
                {zoomMsg.texto}
              </p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowZoomModal(false)}
                className="px-4 py-2 border rounded-xl"
              >
                Cancelar
              </button>

              <button
                onClick={saveZoomLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}