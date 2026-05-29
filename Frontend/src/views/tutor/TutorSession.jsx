import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { sessionTabs } from "./tutorData";
import "../../styles/tutor/TutorSession.css";

function SessionMainPanel({ softCard, sessionTab, selectedStudent }) {
  const idAsignacion = selectedStudent.id_asignacion;
  const hasValidAsignacion =
    Number.isInteger(Number(idAsignacion)) && Number(idAsignacion) > 0;

  // --- Registro ---
  const [registro, setRegistro] = useState({
    fecha_sesion: "",
    hora_inicio: "",
    hora_fin: "",
    asistencia: "",
    aprobado_padre_madre: "",
  });

  const [registroMsg, setRegistroMsg] = useState(null);
  const addOneHour = (time) => {
    if (!time) return "";

    const [h, m] = time.split(":").map(Number);

    const date = new Date();
    date.setHours(h);
    date.setMinutes(m);

    date.setHours(date.getHours() + 1);

    return date.toTimeString().slice(0, 5);
  };

  const [horaFinTouched, setHoraFinTouched] = useState(false);

  const handleRegistroChange = (e) => {
    const { name, value } = e.target;

    if (name === "hora_fin") {
      setHoraFinTouched(true);
    }

    setRegistro((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "hora_inicio" && !horaFinTouched) {
        updated.hora_fin = addOneHour(value);
      }

      return updated;
    });
  };

  const handleGuardarSesion = async () => {
    setRegistroMsg(null);
    if (!enterado) {
      setRegistroMsg({
        tipo: "error",
        texto: "Debes marcar Enterado antes de guardar.",
      });
      return;
    }
    if (
      registro.hora_inicio &&
      registro.hora_fin &&
      registro.hora_fin <= registro.hora_inicio
    ) {
      setRegistroMsg({
        tipo: "error",
        texto: "La hora de fin debe ser mayor a la hora de inicio.",
      });
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/api/sesiones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_asignacion: idAsignacion,
          ...registro,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setRegistroMsg({
        tipo: "ok",
        texto: "Sesión guardada correctamente.",
      });

      setRegistro({
        fecha_sesion: "",
        hora_inicio: "",
        hora_fin: "",
        asistencia: "",
        aprobado_padre_madre: "",
      });
      setHoraFinTouched(false);

      setEnterado(false);
    } catch (err) {
      setRegistroMsg({
        tipo: "error",
        texto: err.message,
      });
    }
  };

  const [zoomLink, setZoomLink] = useState("");
  const [enterado, setEnterado] = useState(false);

  useEffect(() => {
    const loadZoomLink = async () => {
      try {
        const userContext = JSON.parse(localStorage.getItem("user") || "{}");
        const tutorId = userContext.id_tutor || userContext.id_usuario;

        const res = await fetch(
          `http://localhost:3000/api/zoom-link/${tutorId}`,
        );

        const data = await res.json();

        if (data?.zoom_link) {
          setZoomLink(data.zoom_link);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadZoomLink();
  }, []);

  // --- Bitácora ---
  const [bitacora, setBitacora] = useState({
    tipo: "",
    fecha: "",
    hora: "",
    tema: "",
    descripcion: "",
    planeacion_siguiente_sesion: "",
    tareas_asignadas: "",
    imagen_recordatorio: null,
    imagen_sesion: null,
    tipo_incidencia: "",
    imagen_incidencia: null,
  });
  const [bitacoraMsg, setBitacoraMsg] = useState(null);

  const handleBitacoraChange = (e) =>
    setBitacora((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleGuardarBitacora = async () => {
    setBitacoraMsg(null);

    if (bitacora.tipo === "Incidencia") {
      if (!bitacora.tipo_incidencia.trim()) {
        setBitacoraMsg({
          tipo: "error",
          texto: "El tipo de incidencia es requerido.",
        });
        return;
      }
    } else {
      if (!bitacora.descripcion.trim()) {
        setBitacoraMsg({
          tipo: "error",
          texto: "La descripción es requerida.",
        });
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append("id_asignacion", String(idAsignacion));
      formData.append("tipo", bitacora.tipo);
      formData.append("fecha", bitacora.fecha);
      formData.append("hora", bitacora.hora);

      if (bitacora.tipo === "Incidencia") {
        formData.append("descripcion", bitacora.tipo_incidencia);
        if (bitacora.imagen_incidencia)
          formData.append("imagen_incidencia", bitacora.imagen_incidencia);
      } else {
        formData.append("tema", bitacora.tema);
        formData.append("descripcion", bitacora.descripcion);
        formData.append(
          "planeacion_siguiente_sesion",
          bitacora.planeacion_siguiente_sesion,
        );
        formData.append("tareas_asignadas", bitacora.tareas_asignadas);
        if (bitacora.imagen_recordatorio)
          formData.append("imagen_recordatorio", bitacora.imagen_recordatorio);
        if (bitacora.imagen_sesion)
          formData.append("imagen_sesion", bitacora.imagen_sesion);
      }

      const res = await fetch("http://localhost:3000/api/bitacoras", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setBitacoraMsg({ tipo: "ok", texto: "Bitácora guardada correctamente." });
      setBitacora({
        tipo: "",
        fecha: "",
        hora: "",
        tema: "",
        descripcion: "",
        planeacion_siguiente_sesion: "",
        tareas_asignadas: "",
        imagen_recordatorio: null,
        imagen_sesion: null,
        tipo_incidencia: "",
        imagen_incidencia: null,
      });
    } catch (err) {
      setBitacoraMsg({ tipo: "error", texto: err.message });
    }
  };
  // --- Evidencias (se conserva para uso futuro) ---
  const [archivo, setArchivo] = useState(null);
  const [evidenciaMsg, setEvidenciaMsg] = useState(null);

  const handleUploadEvidencia = async () => {
    setEvidenciaMsg(null);

    if (!archivo) {
      setEvidenciaMsg({
        tipo: "error",
        texto: "Selecciona un archivo.",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", archivo);
      formData.append("titulo", archivo.name);
      formData.append("id_asignacion", String(idAsignacion));

      const res = await fetch("http://localhost:3000/api/materials/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setEvidenciaMsg({
        tipo: "ok",
        texto: "Archivo subido correctamente.",
      });

      setArchivo(null);
    } catch (err) {
      setEvidenciaMsg({
        tipo: "error",
        texto: err.message,
      });
    }
  };

  if (sessionTab === "registro") {
    return (
      <div className={softCard + " p-5"}>
        <h3 className="font-semibold text-lg mb-4">Registro de sesión</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Beneficiario"
            value={selectedStudent.name}
            readOnly
          />

          <input
            className="rounded-xl border border-slate-300 px-4 py-3"
            type="date"
            name="fecha_sesion"
            value={registro.fecha_sesion}
            onChange={handleRegistroChange}
          />

          <input
            className="rounded-xl border border-slate-300 px-4 py-3"
            type="time"
            name="hora_inicio"
            value={registro.hora_inicio}
            onChange={handleRegistroChange}
            autoComplete="off"
          />

          <input
            className="rounded-xl border border-slate-300 px-4 py-3"
            type="time"
            name="hora_fin"
            value={registro.hora_fin}
            onChange={handleRegistroChange}
            autoComplete="off"
          />

          <input
            className="rounded-xl border border-slate-300 px-4 py-3 md:col-span-2"
            value={zoomLink}
            readOnly
            placeholder="Liga Zoom"
          />

          <select
            className="rounded-xl border border-slate-300 px-4 py-3 bg-white"
            name="asistencia"
            value={registro.asistencia}
            onChange={handleRegistroChange}
          >
            <option value="">Selecciona asistencia</option>

            <option value="TUTOR_TITULAR">Asistencia TUTOR TITULAR</option>

            <option value="BACKUP">
              Asistencia Tutor de reemplazo "BACK UP"
            </option>

            <option value="APOYO">Asistencia Tutor de APOYO</option>
          </select>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-slate-700 mb-2">
              ¿El día y horario fue aprobado por la madre o padre de familia? *
            </p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="aprobado_padre_madre"
                  value="true"
                  checked={registro.aprobado_padre_madre === "true"}
                  onChange={handleRegistroChange}
                  className="accent-blue-600"
                />
                Sí
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="aprobado_padre_madre"
                  value="false"
                  checked={registro.aprobado_padre_madre === "false"}
                  onChange={handleRegistroChange}
                  className="accent-blue-600"
                />
                No
              </label>
            </div>
          </div>
        </div>
        <div className="mt-6 p-4 rounded-xl border bg-yellow-50">
          <h4 className="font-semibold mb-3">Aviso importante</h4>

          <div className="space-y-2 text-sm">
            <p>La tolerancia es de máximo 10 minutos.</p>

            <p>
              Después de esta hora, si el alumno o alumna no asiste, debes
              reportarlo en el Formato de incidencias con la evidencia
              correspondiente.
            </p>

            <p>Retardos y faltas debes reportarlas a los padres de familia.</p>

            <p>3 FALTAS del alumno = BAJA</p>

            <p>3 RETARDOS del alumno = 1 FALTA</p>

            <p>
              Después de tus asesorías, debes llenar el expediente
              correspondiente.
            </p>

            <p>El reporte de incidencias y el expediente deben coincidir.</p>

            <p>
              El expediente debe llenarse a más tardar al día siguiente antes
              del mediodía.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setEnterado(true)}
            className={`mt-4 px-4 py-2 rounded-xl text-white ${
              enterado ? "bg-green-600" : "bg-slate-500"
            }`}
          >
            {enterado ? "Enterado ✓" : "Enterado"}
          </button>
        </div>
        {registroMsg && (
          <p
            className={`mt-2 text-sm ${
              registroMsg.tipo === "ok" ? "text-green-600" : "text-red-600"
            }`}
          >
            {registroMsg.texto}
          </p>
        )}

        <div className="mt-4">
          <button
            onClick={handleGuardarSesion}
            disabled={!hasValidAsignacion}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white"
          >
            Guardar sesión
          </button>

          {!hasValidAsignacion && (
            <p className="text-sm text-red-600 mt-2">
              Debes seleccionar un alumno con asignación válida para guardar en
              base de datos.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (sessionTab === "bitacora") {
    return (
      <div className={softCard + " p-5"}>
        <h3 className="font-semibold text-lg mb-4">Bitácora</h3>

        {/* Always-visible top fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="rounded-xl border border-slate-300 px-4 py-3 bg-slate-50"
            placeholder="Beneficiario"
            value={selectedStudent.name}
            readOnly
          />

          <select
            className="rounded-xl border border-slate-300 px-4 py-3 bg-white"
            name="tipo"
            value={bitacora.tipo}
            onChange={handleBitacoraChange}
          >
            <option value="">Tipo de registro</option>
            <option value="Seguimiento">Seguimiento</option>
            <option value="Incidencia">Incidencia</option>
          </select>

          <input
            className="rounded-xl border border-slate-300 px-4 py-3"
            type="date"
            name="fecha"
            value={bitacora.fecha}
            onChange={handleBitacoraChange}
          />

          <input
            className="rounded-xl border border-slate-300 px-4 py-3"
            type="time"
            name="hora"
            value={bitacora.hora}
            onChange={handleBitacoraChange}
          />
        </div>

        {/* ── INCIDENCIA form ── */}
        {bitacora.tipo === "Incidencia" && (
          <>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tipo de incidencia <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                rows="4"
                placeholder="Describe el tipo o motivo de la incidencia"
                name="tipo_incidencia"
                value={bitacora.tipo_incidencia}
                onChange={handleBitacoraChange}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Evidencia fotográfica{" "}
              </label>
              <label className="flex items-center gap-2 cursor-pointer rounded-xl border border-dashed border-slate-300 px-4 py-3 hover:bg-slate-50 transition">
                <Upload size={16} className="text-slate-500" />
                <span className="text-sm text-slate-500">
                  {bitacora.imagen_incidencia
                    ? bitacora.imagen_incidencia.name
                    : "Seleccionar foto"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setBitacora((prev) => ({
                      ...prev,
                      imagen_incidencia: e.target.files[0] || null,
                    }))
                  }
                />
              </label>
            </div>
          </>
        )}

        {/* ── SEGUIMIENTO form (default / when tipo is "Seguimiento" or empty) ── */}
        {bitacora.tipo !== "Incidencia" && (
          <>
            <div className="mt-4">
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                type="text"
                name="tema"
                placeholder="Tema de la sesión"
                value={bitacora.tema}
                onChange={handleBitacoraChange}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Descripción de la sesión <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                rows="4"
                placeholder="Describe lo trabajado en la sesión"
                name="descripcion"
                value={bitacora.descripcion}
                onChange={handleBitacoraChange}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Planeación de la siguiente sesión{" "}
                <span className="text-slate-400 text-xs">(opcional)</span>
              </label>
              <textarea
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                rows="3"
                placeholder="¿Qué se trabajará en la próxima sesión?"
                name="planeacion_siguiente_sesion"
                value={bitacora.planeacion_siguiente_sesion}
                onChange={handleBitacoraChange}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tareas asignadas{" "}
                <span className="text-slate-400 text-xs">(opcional)</span>
              </label>
              <textarea
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                rows="3"
                placeholder="Tareas o actividades asignadas al beneficiario"
                name="tareas_asignadas"
                value={bitacora.tareas_asignadas}
                onChange={handleBitacoraChange}
              />
            </div>

            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Imagen de recordatorio de sesión
                </label>
                <label className="flex items-center gap-2 cursor-pointer rounded-xl border border-dashed border-slate-300 px-4 py-3 hover:bg-slate-50 transition">
                  <Upload size={16} className="text-slate-500" />
                  <span className="text-sm text-slate-500">
                    {bitacora.imagen_recordatorio
                      ? bitacora.imagen_recordatorio.name
                      : "Seleccionar imagen"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setBitacora((prev) => ({
                        ...prev,
                        imagen_recordatorio: e.target.files[0] || null,
                      }))
                    }
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Imagen de la sesión
                </label>
                <label className="flex items-center gap-2 cursor-pointer rounded-xl border border-dashed border-slate-300 px-4 py-3 hover:bg-slate-50 transition">
                  <Upload size={16} className="text-slate-500" />
                  <span className="text-sm text-slate-500">
                    {bitacora.imagen_sesion
                      ? bitacora.imagen_sesion.name
                      : "Seleccionar imagen"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setBitacora((prev) => ({
                        ...prev,
                        imagen_sesion: e.target.files[0] || null,
                      }))
                    }
                  />
                </label>
              </div>
            </div>
          </>
        )}

        {bitacoraMsg && (
          <p
            className={`mt-3 text-sm ${
              bitacoraMsg.tipo === "ok" ? "text-green-600" : "text-red-600"
            }`}
          >
            {bitacoraMsg.texto}
          </p>
        )}

        <button
          onClick={handleGuardarBitacora}
          disabled={!hasValidAsignacion}
          className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-50"
        >
          Guardar bitácora
        </button>

        {!hasValidAsignacion && (
          <p className="text-sm text-red-600 mt-2">
            Debes seleccionar un alumno con asignación válida para guardar en
            base de datos.
          </p>
        )}
      </div>
    );
  }

  return null;
}

export default function TutorSession({
  softCard,
  tabClass,
  sessionTab,
  setSessionTab,
  selectedStudent,
  onBackStudents,
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Seguimiento de sesión</h2>
          <p className="text-sm text-slate-500">Workspace central del tutor.</p>
        </div>

        <button
          onClick={onBackStudents}
          className="px-4 py-2 rounded-xl bg-slate-100 text-sm"
        >
          Volver a alumnos
        </button>
      </div>

      <div className="grid xl:grid-cols-[300px,1fr] gap-6">
        <div className="space-y-4">
          <div className={softCard + " p-5"}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                {selectedStudent.name[0]}
              </div>

              <div>
                <div className="font-semibold">{selectedStudent.name}</div>
                <div className="text-sm text-slate-500">
                  {selectedStudent.level}
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Estado</span>
                <span className="font-medium text-blue-700">
                  {selectedStudent.status}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Idioma</span>
                <span>{selectedStudent.program}</span>
              </div>
            </div>
          </div>

          <div className={softCard + " p-5"}>
            <h3 className="font-semibold mb-3">Atajos</h3>

            <div className="space-y-2 text-sm">
              <button
                onClick={() => setSessionTab("registro")}
                className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 border"
              >
                Registrar sesión
              </button>

              <button
                onClick={() => setSessionTab("bitacora")}
                className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 border"
              >
                Agregar bitácora
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSessionTab("registro")}
              className={tabClass(sessionTab === "registro")}
            >
              Registro
            </button>

            <button
              onClick={() => setSessionTab("bitacora")}
              className={tabClass(sessionTab === "bitacora")}
            >
              Bitácora
            </button>
          </div>

          <SessionMainPanel
            softCard={softCard}
            sessionTab={sessionTab}
            selectedStudent={selectedStudent}
          />
        </div>
      </div>
    </div>
  );
}
