import React from "react";
import ModalWrapper from "./ModalWrapper";

export default function BeneficiaryModal({
  open,
  editingBeneficiary,
  beneficiaryForm,
  setBeneficiaryForm,
  simpleTutores,
  onClose,
  onSubmit,
}) {
  if (!open) return null;

  const inputClass =
    "w-full rounded-xl border border-slate-300 px-4 py-3 bg-white";
  const labelClass = "text-sm font-medium text-slate-600 mb-2 block";

  return (
    <ModalWrapper
      title={editingBeneficiary ? "Modificar beneficiario" : "Nuevo beneficiario"}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nombre</label>
            <input
              className={inputClass}
              value={beneficiaryForm.nombre}
              onChange={(e) =>
                setBeneficiaryForm({ ...beneficiaryForm, nombre: e.target.value })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Apellido paterno</label>
            <input
              className={inputClass}
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
            <label className={labelClass}>Apellido materno</label>
            <input
              className={inputClass}
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
            <label className={labelClass}>Correo</label>
            <input
              className={inputClass}
              type="email"
              value={beneficiaryForm.correo}
              onChange={(e) =>
                setBeneficiaryForm({ ...beneficiaryForm, correo: e.target.value })
              }
            />
          </div>

          <div>
            <label className={labelClass}>
              {editingBeneficiary ? "Nueva contraseña (opcional)" : "Contraseña"}
            </label>
            <input
              className={inputClass}
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
            <label className={labelClass}>Nivel</label>
            <select
              className={inputClass}
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
            <label className={labelClass}>Tutor asignado</label>
            <select
              className={inputClass}
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
            <label className={labelClass}>Estado</label>
            <select
              className={inputClass}
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
            <label className={labelClass}>Matrícula/Folio</label>
            <input
              className={inputClass}
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
            <label className={labelClass}>Idioma</label>
            <input
              className={inputClass}
              value={beneficiaryForm.idioma}
              onChange={(e) =>
                setBeneficiaryForm({
                  ...beneficiaryForm,
                  idioma: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Periodo</label>
            <input
              className={inputClass}
              value={beneficiaryForm.periodo}
              onChange={(e) =>
                setBeneficiaryForm({
                  ...beneficiaryForm,
                  periodo: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Fecha inicio</label>
            <input
              className={inputClass}
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
            <label className={labelClass}>Fecha fin</label>
            <input
              className={inputClass}
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
            onClick={onClose}
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