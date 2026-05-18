import React, { useState } from "react";
import { Upload } from "lucide-react";
import { sessionTabs } from "./tutorData";
import "../../styles/tutor/TutorSession.css";

function SessionMainPanel({ softCard, sessionTab, selectedStudent }) {
  const idAsignacion = selectedStudent.id_asignacion;
  const hasValidAsignacion = Number.isInteger(Number(idAsignacion)) && Number(idAsignacion) > 0;

  // --- Registro ---
  const [registro, setRegistro] = useState({
    fecha_sesion: "",
    hora_inicio: "",
    hora_fin: "",
    tema: "",
    observaciones: "",
    asistencia: "",
  });
  const [registroMsg, setRegistroMsg] = useState(null);

  const handleRegistroChange = (e) =>
    setRegistro((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleGuardarSesion = async () => {
    setRegistroMsg(null);
    try {
      const res = await fetch("http://localhost:3000/api/sesiones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_asignacion: idAsignacion, ...registro }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setRegistroMsg({ tipo: "ok", texto: "Sesión guardada correctamente." });
      setRegistro({ fecha_sesion: "", hora_inicio: "", hora_fin: "", tema: "", observaciones: "", asistencia: "" });
    } catch (err) {
      setRegistroMsg({ tipo: "error", texto: err.message });
    }
  };

  // --- Bitacora ---
  const [bitacora, setBitacora] = useState({ tipo: "", fecha: "", descripcion: "" });
  const [bitacoraMsg, setBitacoraMsg] = useState(null);

  const handleBitacoraChange = (e) =>
    setBitacora((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleGuardarBitacora = async () => {
    setBitacoraMsg(null);
    try {
      const res = await fetch("http://localhost:3000/api/bitacoras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_asignacion: idAsignacion, ...bitacora }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setBitacoraMsg({ tipo: "ok", texto: "Bitácora guardada correctamente." });
      setBitacora({ tipo: "", fecha: "", descripcion: "" });
    } catch (err) {
      setBitacoraMsg({ tipo: "error", texto: err.message });
    }
  };

  // --- Evidencias ---
  const [archivo, setArchivo] = useState(null);
  const [evidenciaMsg, setEvidenciaMsg] = useState(null);

  const handleUploadEvidencia = async () => {
    setEvidenciaMsg(null);
    if (!archivo) {
      setEvidenciaMsg({ tipo: "error", texto: "Selecciona un archivo." });
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
      setEvidenciaMsg({ tipo: "ok", texto: "Archivo subido correctamente." });
      setArchivo(null);
    } catch (err) {
      setEvidenciaMsg({ tipo: "error", texto: err.message });
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
          />
          <input
            className="rounded-xl border border-slate-300 px-4 py-3"
            type="time"
            name="hora_fin"
            value={registro.hora_fin}
            onChange={handleRegistroChange}
          />
          <input
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Tema"
            name="tema"
            value={registro.tema}
            onChange={handleRegistroChange}
          />
          <select
            className="rounded-xl border border-slate-300 px-4 py-3 bg-white"
            name="asistencia"
            value={registro.asistencia}
            onChange={handleRegistroChange}
          >
            <option value="">Asistencia</option>
            <option value="presente">Presente</option>
            <option value="ausente">Ausente</option>
            <option value="justificado">Justificado</option>
          </select>
        </div>
        <textarea
          className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3"
          rows="4"
          placeholder="Observaciones"
          name="observaciones"
          value={registro.observaciones}
          onChange={handleRegistroChange}
        />
        {registroMsg && (
          <p className={`mt-2 text-sm ${registroMsg.tipo === "ok" ? "text-green-600" : "text-red-600"}`}>
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
              Debes seleccionar un alumno con asignación válida para guardar en base de datos.
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
        <div className="grid md:grid-cols-2 gap-4">
          <select
            className="rounded-xl border border-slate-300 px-4 py-3 bg-white"
            name="tipo"
            value={bitacora.tipo}
            onChange={handleBitacoraChange}
          >
            <option value="">Tipo de registro</option>
            <option value="Seguimiento">Seguimiento</option>
            <option value="Incidencia">Incidencia</option>
            <option value="Acuerdo">Acuerdo</option>
          </select>
          <input
            className="rounded-xl border border-slate-300 px-4 py-3"
            type="date"
            name="fecha"
            value={bitacora.fecha}
            onChange={handleBitacoraChange}
          />
        </div>
        <textarea
          className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3"
          rows="6"
          placeholder="Describe la incidencia, acuerdo u observación relevante"
          name="descripcion"
          value={bitacora.descripcion}
          onChange={handleBitacoraChange}
        />
        {bitacoraMsg && (
          <p className={`mt-2 text-sm ${bitacoraMsg.tipo === "ok" ? "text-green-600" : "text-red-600"}`}>
            {bitacoraMsg.texto}
          </p>
        )}
        <button
          onClick={handleGuardarBitacora}
          disabled={!hasValidAsignacion}
          className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white"
        >
          Guardar bitácora
        </button>
        {!hasValidAsignacion && (
          <p className="text-sm text-red-600 mt-2">
            Debes seleccionar un alumno con asignación válida para guardar en base de datos.
          </p>
        )}
      </div>
    );
  }

  if (sessionTab === "evidencias") {
    return (
      <div className={softCard + " p-5"}>
        <h3 className="font-semibold text-lg mb-4">Evidencias</h3>
        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center bg-slate-50">
          <Upload className="mx-auto mb-3 text-slate-500" />
          <div className="font-medium">Arrastra archivos o imágenes aquí</div>
          <div className="text-sm text-slate-500 mt-1">
            También puedes cargar documentos PDF o Word.
          </div>
          <input
            type="file"
            id="evidencia-input"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setArchivo(e.target.files[0] || null)}
          />
          <label
            htmlFor="evidencia-input"
            className="mt-4 inline-block cursor-pointer px-4 py-2 rounded-xl bg-slate-200 text-sm"
          >
            {archivo ? archivo.name : "Seleccionar archivo"}
          </label>
        </div>
        {evidenciaMsg && (
          <p className={`mt-3 text-sm ${evidenciaMsg.tipo === "ok" ? "text-green-600" : "text-red-600"}`}>
            {evidenciaMsg.texto}
          </p>
        )}
        {archivo && (
          <button
            onClick={handleUploadEvidencia}
            disabled={!hasValidAsignacion}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white"
          >
            Subir evidencia
          </button>
        )}
        {!hasValidAsignacion && (
          <p className="text-sm text-red-600 mt-2">
            Debes seleccionar un alumno con asignación válida para guardar en base de datos.
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
        <div className="flex gap-2">
          <button
            onClick={onBackStudents}
            className="px-4 py-2 rounded-xl bg-slate-100 text-sm"
          >
            Volver a alumnos
          </button>
        </div>
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
                <div className="text-sm text-slate-500">{selectedStudent.level}</div>
              </div>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Estado</span>
                <span className="font-medium text-blue-700">{selectedStudent.status}</span>
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
              {sessionTabs
                .filter(([key]) => key !== "tareas" && key !== "materiales")
                .map(([key]) => (
                  <button
                    key={key}
                    onClick={() => setSessionTab(key)}
                    className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 border"
                  >
                    {key === "registro"
                      ? "Registrar sesión"
                      : key === "bitacora"
                        ? "Agregar bitácora"
                        : "Subir evidencia"}
                  </button>
                ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {sessionTabs
              .filter(([key]) => key !== "tareas" && key !== "materiales")
              .map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSessionTab(key)}
                  className={tabClass(sessionTab === key)}
                >
                  {label}
                </button>
              ))}
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
