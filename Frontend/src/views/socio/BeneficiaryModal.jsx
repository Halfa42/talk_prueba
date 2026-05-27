import React, { useMemo, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import {
  fieldClass,
  hasRequiredError,
  labelClass,
  requiredTextClass,
} from "./formUtils";

export default function BeneficiaryModal({
  open,
  editingBeneficiary,
  beneficiaryForm,
  setBeneficiaryForm,
  simpleTutores,
  onClose,
  onSubmit,
}) {
  const [showValidation, setShowValidation] = useState(false);

  const passwordRequired = !editingBeneficiary;

  const errors = useMemo(() => {
    return {
      nombre: hasRequiredError(showValidation, beneficiaryForm.nombre),
      apellido_paterno: hasRequiredError(
        showValidation,
        beneficiaryForm.apellido_paterno
      ),
      correo: hasRequiredError(showValidation, beneficiaryForm.correo),
      contrasena: passwordRequired
        ? hasRequiredError(showValidation, beneficiaryForm.contrasena)
        : false,
      nivel: hasRequiredError(showValidation, beneficiaryForm.nivel),
      tutorId: hasRequiredError(showValidation, beneficiaryForm.tutorId),
    };
  }, [showValidation, beneficiaryForm, passwordRequired]);

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
      title={editingBeneficiary ? "Modificar beneficiario" : "Nuevo beneficiario"}
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
              value={beneficiaryForm.nombre}
              onChange={(e) =>
                setBeneficiaryForm({ ...beneficiaryForm, nombre: e.target.value })
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
              value={beneficiaryForm.apellido_paterno}
              onChange={(e) =>
                setBeneficiaryForm({
                  ...beneficiaryForm,
                  apellido_paterno: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className={labelClass()}>Apellido materno</label>
            <input
              className={fieldClass(false)}
              value={beneficiaryForm.apellido_materno}
              onChange={(e) =>
                setBeneficiaryForm({
                  ...beneficiaryForm,
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
              value={beneficiaryForm.correo}
              onChange={(e) =>
                setBeneficiaryForm({ ...beneficiaryForm, correo: e.target.value })
              }
            />
          </div>

          <div>
            {errors.contrasena && (
              <span className={requiredTextClass()}>Campo obligatorio</span>
            )}
            <label className={labelClass()}>
              {editingBeneficiary ? (
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
              value={beneficiaryForm.contrasena}
              onChange={(e) =>
                setBeneficiaryForm({
                  ...beneficiaryForm,
                  contrasena: e.target.value,
                })
              }
            />
          </div>

          <div>
            {errors.nivel && (
              <span className={requiredTextClass()}>Campo obligatorio</span>
            )}
            <label className={labelClass()}>
              Nivel <span className="text-red-500">*</span>
            </label>
            <select
              className={fieldClass(errors.nivel)}
              value={beneficiaryForm.nivel}
              onChange={(e) =>
                setBeneficiaryForm({ ...beneficiaryForm, nivel: e.target.value })
              }
            >
              <option value="">Selecciona nivel</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
            </select>
          </div>

          <div>
            {errors.tutorId && (
              <span className={requiredTextClass()}>Campo obligatorio</span>
            )}
            <label className={labelClass()}>
              Tutor asignado <span className="text-red-500">*</span>
            </label>
            <select
              className={fieldClass(errors.tutorId)}
              value={beneficiaryForm.tutorId}
              onChange={(e) =>
                setBeneficiaryForm({
                  ...beneficiaryForm,
                  tutorId: e.target.value,
                })
              }
            >
              <option value="">Selecciona tutor</option>
              {simpleTutores.map((tutor) => (
                <option key={tutor.id_tutor} value={tutor.id_tutor}>
                  {tutor.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass()}>Estado</label>
            <select
              className={fieldClass(false)}
              value={beneficiaryForm.estatus}
              onChange={(e) =>
                setBeneficiaryForm({
                  ...beneficiaryForm,
                  estatus: e.target.value,
                })
              }
            >
              <option value="Activa">Activa</option>
              <option value="No activa">No activa</option>
            </select>
          </div>

          <div>
            <label className={labelClass()}>Matrícula/Folio</label>
            <input
              className={fieldClass(false)}
              value={beneficiaryForm.matricula_folio}
              onChange={(e) =>
                setBeneficiaryForm({
                  ...beneficiaryForm,
                  matricula_folio: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className={labelClass()}>Idioma</label>
            <select
              className={fieldClass(false)}
              value={beneficiaryForm.idioma}
              onChange={(e) =>
                setBeneficiaryForm({
                  ...beneficiaryForm,
                  idioma: e.target.value,
                })
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
              value={beneficiaryForm.periodo}
              onChange={(e) =>
                setBeneficiaryForm({
                  ...beneficiaryForm,
                  periodo: e.target.value,
                })
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
              value={beneficiaryForm.fecha_inicio}
              onChange={(e) =>
                setBeneficiaryForm({
                  ...beneficiaryForm,
                  fecha_inicio: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className={labelClass()}>Fecha fin</label>
            <input
              className={fieldClass(false)}
              type="date"
              value={beneficiaryForm.fecha_fin}
              onChange={(e) =>
                setBeneficiaryForm({
                  ...beneficiaryForm,
                  fecha_fin: e.target.value,
                })
              }
            />
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
            {editingBeneficiary ? "Guardar cambios" : "Guardar beneficiario"}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}