import React from "react";
import { Upload } from "lucide-react";
import { sessionTabs } from "./tutorData";
import "../../styles/tutor/TutorSession.css";

function SessionMainPanel({ softCard, sessionTab, selectedStudent }) {
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
            placeholder="Fecha"
          />
          <input
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Hora inicio"
          />
          <input
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Hora fin"
          />
        </div>
        <textarea
          className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3"
          rows="5"
          placeholder="Tema abordado y observaciones"
        />
        <div className="mt-4 flex gap-3">
          <button className="px-4 py-2 rounded-xl bg-blue-600 text-white">
            Guardar sesión
          </button>
          <button className="px-4 py-2 rounded-xl bg-slate-100">
            Marcar asistencia
          </button>
        </div>
      </div>
    );
  }

  if (sessionTab === "bitacora") {
    return (
      <div className={softCard + " p-5"}>
        <h3 className="font-semibold text-lg mb-4">Bitácora</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <select className="rounded-xl border border-slate-300 px-4 py-3 bg-white">
            <option>Tipo de registro</option>
            <option>Seguimiento</option>
            <option>Incidencia</option>
            <option>Acuerdo</option>
          </select>
          <input
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Fecha"
          />
        </div>
        <textarea
          className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3"
          rows="6"
          placeholder="Describe la incidencia, acuerdo u observación relevante"
        />
        <button className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white">
          Guardar bitácora
        </button>
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
            También puedes cargar enlaces o documentos PDF.
          </div>
          <button className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white">
            Seleccionar archivo
          </button>
        </div>
      </div>
    );
  }

  if (sessionTab === "tareas") {
    return (
      <div className={softCard + " p-5"}>
        <h3 className="font-semibold text-lg mb-4">Tareas derivadas de la sesión</h3>
        <input
          className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3"
          placeholder="Título de la actividad"
        />
        <textarea
          className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3"
          rows="5"
          placeholder="Indicación para el beneficiario"
        />
        <div className="grid md:grid-cols-2 gap-3">
          <input
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Fecha límite"
          />
          <input
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Adjuntar apoyo opcional"
          />
        </div>
        <button className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white">
          Asignar tarea
        </button>
      </div>
    );
  }

  return (
    <div className={softCard + " p-5"}>
      <h3 className="font-semibold text-lg mb-4">Materiales usados en sesión</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border bg-slate-50">Vocabulary list A2</div>
        <div className="p-4 rounded-2xl border bg-slate-50">Reading worksheet</div>
        <div className="p-4 rounded-2xl border bg-slate-50">Listening practice</div>
        <div className="p-4 rounded-2xl border bg-slate-50">
          Guide for speaking exercise
        </div>
      </div>
    </div>
  );
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
          <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm">
            Guardar progreso
          </button>
        </div>
      </div>
      <div className="grid xl:grid-cols-[300px,1fr,320px] gap-6">
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
                <span>Asistencia</span>
                <span>{selectedStudent.attendance}</span>
              </div>
            </div>
          </div>
          <div className={softCard + " p-5"}>
            <h3 className="font-semibold mb-3">Atajos</h3>
            <div className="space-y-2 text-sm">
              {sessionTabs.map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSessionTab(key)}
                  className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 border"
                >
                  {key === "registro"
                    ? "Registrar sesión"
                    : key === "bitacora"
                      ? "Agregar bitácora"
                      : key === "evidencias"
                        ? "Subir evidencia"
                        : key === "tareas"
                          ? "Asignar tarea"
                          : "Ver materiales"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {sessionTabs.map(([key, label]) => (
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
        <div className="space-y-4">
          <div className={softCard + " p-5"}>
            <h3 className="font-semibold mb-4">Horas</h3>
            <div className="h-28 rounded-2xl bg-slate-50 border flex items-center justify-center text-slate-500">
              1.5 h en esta sesión
            </div>
          </div>
          <div className={softCard + " p-5"}>
            <h3 className="font-semibold mb-4">Bitácoras recientes</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-50 border">
                Seguimiento: mejorar fluidez oral.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border">Acuerdo: repasar verbos.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}