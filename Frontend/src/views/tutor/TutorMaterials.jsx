import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/tutor/TutorMaterials.css";

export default function TutorMaterials({ softCard }) {
  const [materials, setMaterials] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");

  const fileInputRef = useRef(null);

  const tutorId = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return 1;
    }

    try {
      const tokenParts = token.split(".");
      if (tokenParts.length < 2) {
        return 1;
      }

      const normalized = tokenParts[1].replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(normalized));
      return payload?.id || 1;
    } catch {
      return 1;
    }
  }, []);

  const [form, setForm] = useState({
    titulo: "",
    tema: "",
    nivel: "a1",
    descripcion: "",
  });

  const loadMaterials = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/materials`);

      if (!response.ok) {
        throw new Error("No se pudieron cargar materiales");
      }

      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error(error);
      setMessage("No se pudieron cargar los materiales.");
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveMaterial = async () => {
    setMessage("");

    if (!form.titulo.trim() || !form.tema.trim() || !form.descripcion.trim() || !selectedFile) {
      setMessage("Archivo no subido, por favor complete todos los campos");
      return;
    }

    try {
      setIsSaving(true);
      const body = new FormData();
      body.append("tutorId", String(tutorId));
      body.append("titulo", form.titulo);
      body.append("tema", form.tema);
      body.append("nivel", form.nivel);
      body.append("descripcion", form.descripcion);
      body.append("file", selectedFile);

      const response = await fetch("http://localhost:3000/api/materials/upload", {
        method: "POST",
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "No se pudo subir el material");
      }

      setMessage("Archivo subido correctamente");
      setForm((prev) => ({
        ...prev,
        titulo: "",
        tema: "",
        nivel: "a1",
        descripcion: "",
      }));
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      loadMaterials();
    } catch (error) {
      console.error(error);
      setMessage(error.message || "No se pudo subir el material.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = (materialId) => {
    window.open(`http://localhost:3000/api/materials/${materialId}/download`, "_blank");
  };

  const handleDeleteMaterial = async (materialId) => {
    const confirmed = window.confirm("¿Seguro que deseas eliminar este material?");
    if (!confirmed) return;

    try {
      setDeletingId(materialId);
      const response = await fetch(`http://localhost:3000/api/materials/${materialId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "No se pudo eliminar el material");
      }

      setMessage("Material eliminado correctamente");
      loadMaterials();
    } catch (error) {
      console.error(error);
      setMessage(error.message || "No se pudo eliminar el material.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Material compartido</h2>
        <p className="text-sm text-slate-500">
          Carga recursos por tema y nivel para toda la plataforma.
        </p>
      </div>
      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className={softCard + " p-5"}>
            <h3 className="font-semibold text-lg mb-4">Nuevo material</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                data-cy="title"
                className="rounded-xl border border-slate-300 px-4 py-3"
                placeholder="Título del material"
                value={form.titulo}
                onChange={(event) => handleChange("titulo", event.target.value)}
              />
              <input
                data-cy="topic"
                className="rounded-xl border border-slate-300 px-4 py-3"
                placeholder="Tema"
                value={form.tema}
                onChange={(event) => handleChange("tema", event.target.value)}
              />
              <select
                data-cy="level"
                className="rounded-xl border border-slate-300 px-4 py-3 bg-white"
                value={form.nivel}
                onChange={(event) => handleChange("nivel", event.target.value)}
              >
                <option value="a1">A1</option>
                <option value="a2">A2</option>
                <option value="b1">B1</option>
                <option value="b2">B2</option>
                <option value="c1">C1</option>
                <option value="c2">C2</option>
              </select>
            </div>
            <textarea
              data-cy="description"
              className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3"
              rows="4"
              placeholder="Descripción del recurso"
              value={form.descripcion}
              onChange={(event) => handleChange("descripcion", event.target.value)}
            />
            <input
              data-cy="fileInput"
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
            />
            {selectedFile && (
              <div className="mt-3 text-sm text-slate-600">
                Archivo seleccionado: {selectedFile.name}
              </div>
            )}
            {message && (
              <div data-cy="autorizado" className="mt-3 text-sm text-slate-600">
                {message}
              </div>
            )}
            <div className="mt-4 flex gap-3">
              <button
                data-cy="SubirArchivoButton"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white"
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                Seleccionar archivo
              </button>
              <button
                data-cy="GuardarMaterialButton"
                className="px-4 py-2 rounded-xl bg-slate-100"
                onClick={handleSaveMaterial}
                disabled={isSaving}
                type="button"
              >
                {isSaving ? "Guardando..." : "Guardar material"}
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-slate-200"
                onClick={loadMaterials}
                type="button"
              >
                Actualizar lista
              </button>
            </div>
          </div>
        </div>
        <div className={softCard + " p-5"}>
          <h3 className="font-semibold text-lg mb-4">Todos los archivos</h3>
          <div className="space-y-3 text-sm">
            {materials.length === 0 && (
              <div className="p-3 rounded-xl bg-slate-50 border text-slate-500">
                No hay materiales registrados todavía.
              </div>
            )}
            {materials.map((item) => (
              <div
                key={item.id_material}
                className="w-full p-3 rounded-xl bg-slate-50 border"
              >
                <div className="font-medium">{item.titulo}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {item.tema || "Sin tema"} - {item.nivel || "Sin nivel"}
                </div>
                <div className="text-xs text-slate-500">{item.archivo_nombre}</div>
                <div className="mt-3 flex gap-2">
                  <button
                    className="px-3 py-2 rounded-xl bg-white border hover:border-blue-300 transition"
                    onClick={() => handleDownload(item.id_material)}
                    type="button"
                  >
                    Descargar
                  </button>
                  <button
                    className="px-3 py-2 rounded-xl bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition"
                    onClick={() => handleDeleteMaterial(item.id_material)}
                    disabled={deletingId === item.id_material}
                    type="button"
                  >
                    {deletingId === item.id_material ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}