import React, { useMemo, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import {
  fieldClass,
  hasRequiredError,
  labelClass,
  requiredTextClass,
} from "./formUtils";

export default function TutorModal({
  open,
  editingTutor,
  tutorForm,
  setTutorForm,
  onClose,
  onSubmit,
}) {
  const [showValidation, setShowValidation] = useState(false);

  const passwordRequired = !editingTutor;

  const errors = useMemo(() => {
    return {
      nombre: hasRequiredError(showValidation, tutorForm.nombre),
      apellido_paterno: hasRequiredError(showValidation, tutorForm.apellido_paterno),
      correo: hasRequiredError(showValidation, tutorForm.correo),
      contrasena: passwordRequired
        ? hasRequiredError(showValidation, tutorForm.contrasena)
        : false,
    };
  }, [showValidation, tutorForm, passwordRequired]);

  const hasErrors = Object.values(errors).some(Boolean);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowValidation(true);
    if (hasErrors) return;
    onSubmit(e);
  };

  const resetAndClose = () => {
    setShowValidation(false);
    onClose();
  };

  if (!open) return null;

  return (
    <ModalWrapper
      title={editingTutor ? "Modificar tutor" : "Nuevo tutor"}
      onClose={resetAndClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            {errors.nombre && (
              <span className={requiredTextClass()}>Campo obligatorio</span>
            )}
            <label className={labelClass()}>
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              className={fieldClass(errors.nombre)}
              value={tutorForm.nombre}
              onChange={(e) =>
                setTutorForm({ ...tutorForm, nombre: e.target.value })
              }
            />
          </div>

          <div>
            {errors.apellido_paterno && (
              <span className={requiredTextClass()}>Campo obligatorio</span>
            )}
            <label className={labelClass()}>
              Apellido paterno <span className="text-red-500">*</span>
            </label>
            <input
              className={fieldClass(errors.apellido_paterno)}
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
            <label className={labelClass()}>Apellido materno</label>
            <input
              className={fieldClass(false)}
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
            {errors.correo && (
              <span className={requiredTextClass()}>Campo obligatorio</span>
            )}
            <label className={labelClass()}>
              Correo <span className="text-red-500">*</span>
            </label>
            <input
              className={fieldClass(errors.correo)}
              type="email"
              value={tutorForm.correo}
              onChange={(e) =>
                setTutorForm({ ...tutorForm, correo: e.target.value })
              }
            />
          </div>

          <div>
            {errors.contrasena && (
              <span className={requiredTextClass()}>Campo obligatorio</span>
            )}
            <label className={labelClass()}>
              {editingTutor ? (
                <>Nueva contraseña</>
              ) : (
                <>
                  Contraseña <span className="text-red-500">*</span>
                </>
              )}
            </label>
            <input
              className={fieldClass(errors.contrasena)}
              type="password"
              value={tutorForm.contrasena}
              onChange={(e) =>
                setTutorForm({ ...tutorForm, contrasena: e.target.value })
              }
            />
          </div>

          <div>
            <label className={labelClass()}>Idioma</label>
            <select
              className={fieldClass(false)}
              value={tutorForm.idioma}
              onChange={(e) =>
                setTutorForm({ ...tutorForm, idioma: e.target.value })
              }
            >
              <option value="">Selecciona idioma</option>
              <option value="ingles">Inglés</option>
              <option value="frances">Francés</option>
            </select>
          </div>

          <div>
            <label className={labelClass()}>Periodo</label>
            <select
              className={fieldClass(false)}
              value={tutorForm.periodo}
              onChange={(e) =>
                setTutorForm({ ...tutorForm, periodo: e.target.value })
              }
            >
              <option value="">Selecciona periodo</option>
              <option value="Enero-Junio">Enero-Junio</option>
              <option value="Verano">Verano</option>
              <option value="Agosto-Diciembre">Agosto-Diciembre</option>
              <option value="Invierno">Invierno</option>
            </select>
          </div>

          <div>
            <label className={labelClass()}>Fecha inicio</label>
            <input
              className={fieldClass(false)}
              type="date"
              value={tutorForm.fecha_inicio}
              onChange={(e) =>
                setTutorForm({ ...tutorForm, fecha_inicio: e.target.value })
              }
            />
          </div>

          <div>
            <label className={labelClass()}>Fecha fin</label>
            <input
              className={fieldClass(false)}
              type="date"
              value={tutorForm.fecha_fin}
              onChange={(e) =>
                setTutorForm({ ...tutorForm, fecha_fin: e.target.value })
              }
            />
          </div>

          <div>
            <label className={labelClass()}>Estado</label>
            <select
              className={fieldClass(false)}
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
            onClick={resetAndClose}
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