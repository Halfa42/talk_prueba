import React, { useMemo, useState } from "react";
import {
  fieldClass,
  hasRequiredError,
  labelClass,
  requiredTextClass,
} from "./formUtils";

export default function MaterialsSection({
  softCard,
  materialForm,
  setMaterialForm,
  selectedMaterialFile,
  materialFileInputRef,
  setSelectedMaterialFile,
  onSubmit,
}) {
  const [showValidation, setShowValidation] = useState(false);

  const errors = useMemo(() => {
    return {
      titulo: hasRequiredError(showValidation, materialForm.titulo),
    };
  }, [showValidation, materialForm]);

  const hasErrors = Object.values(errors).some(Boolean);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowValidation(true);

    if (hasErrors) return;
    onSubmit(e);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Material institucional</h2>

      <form onSubmit={handleSubmit} className={softCard + " p-5 max-w-3xl"}>
        <h3 className="font-semibold text-lg mb-4">Subir material</h3>

        <div className="mb-3">
          {errors.titulo && (
            <span className={requiredTextClass()}>Campo obligatorio</span>
          )}
          <label className={labelClass()}>
            Título <span className="text-red-500">*</span>
          </label>
          <input
            className={fieldClass(errors.titulo)}
            placeholder="Título"
            value={materialForm.titulo}
            onChange={(e) =>
              setMaterialForm({
                ...materialForm,
                titulo: e.target.value,
              })
            }
          />
        </div>

        <div className="mb-4">
          <label className={labelClass()}>Descripción</label>
          <textarea
            className={fieldClass(false)}
            rows="4"
            placeholder="Descripción"
            value={materialForm.descripcion}
            onChange={(e) =>
              setMaterialForm({
                ...materialForm,
                descripcion: e.target.value,
              })
            }
          />
        </div>

        <input
          ref={materialFileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setSelectedMaterialFile(file);
          }}
        />

        <div className="flex gap-3 items-center flex-wrap">
          <button
            type="button"
            onClick={() => materialFileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700"
          >
            Subir archivo
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-blue-600 text-white"
          >
            Guardar material
          </button>

          {selectedMaterialFile && (
            <span className="text-sm text-slate-600">
              Archivo seleccionado: {selectedMaterialFile.name}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}