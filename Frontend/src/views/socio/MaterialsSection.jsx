import React from "react";

export default function MaterialsSection({
  softCard,
  inputClass,
  materialForm,
  setMaterialForm,
  selectedMaterialFile,
  materialFileInputRef,
  setSelectedMaterialFile,
  onSubmit,
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Material institucional</h2>

      <form onSubmit={onSubmit} className={softCard + " p-5 max-w-3xl"}>
        <h3 className="font-semibold text-lg mb-4">Subir material</h3>

        <input
          className={inputClass + " mb-3"}
          placeholder="Título"
          value={materialForm.titulo}
          onChange={(e) =>
            setMaterialForm({
              ...materialForm,
              titulo: e.target.value,
            })
          }
        />

        <textarea
          className={inputClass + " mb-4"}
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