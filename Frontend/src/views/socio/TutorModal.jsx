import React from "react";
import ModalWrapper from "./ModalWrapper";

export default function TutorModal({
  open,
  editingTutor,
  tutorForm,
  setTutorForm,
  onClose,
  onSubmit,
}) {
  if (!open) return null;

  const inputClass =
    "w-full rounded-xl border border-slate-300 px-4 py-3 bg-white";
  const labelClass = "text-sm font-medium text-slate-600 mb-2 block";

  return (
    <ModalWrapper
      title={editingTutor ? "Modificar tutor" : "Nuevo tutor"}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nombre</label>
            <input
              className={inputClass}
              value={tutorForm.nombre}
              onChange={(e) =>
                setTutorForm({ ...tutorForm, nombre: e.target.value })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Apellido paterno</label>
            <input
              className={inputClass}
              value={tutorForm.apellido_paterno}
              onChange={(e) =>
                setTutorForm({
                  ...tutorForm,
                  apellido_paterno: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Apellido materno</label>
            <input
              className={inputClass}
              value={tutorForm.apellido_materno}
              onChange={(e) =>
                setTutorForm({
                  ...tutorForm,
                  apellido_materno: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Correo</label>
            <input
              className={inputClass}
              type="email"
              value={tutorForm.correo}
              onChange={(e) =>
                setTutorForm({ ...tutorForm, correo: e.target.value })
              }
            />
          </div>

          <div>
            <label className={labelClass}>
              {editingTutor ? "Nueva contraseña (opcional)" : "Contraseña"}
            </label>
            <input
              className={inputClass}
              type="password"
              value={tutorForm.contrasena}
              onChange={(e) =>
                setTutorForm({ ...tutorForm, contrasena: e.target.value })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Idioma</label>
            <input
              className={inputClass}
              value={tutorForm.idioma}
              onChange={(e) =>
                setTutorForm({ ...tutorForm, idioma: e.target.value })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Estado</label>
            <select
              className={inputClass}
              value={tutorForm.estatus}
              onChange={(e) =>
                setTutorForm({ ...tutorForm, estatus: e.target.value })
              }
            >
              <option value="Activa">Activa</option>
              <option value="No activa">No activa</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-blue-600 text-white"
          >
            {editingTutor ? "Guardar cambios" : "Guardar tutor"}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}