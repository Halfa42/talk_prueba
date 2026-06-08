import React, { useEffect, useMemo, useRef, useState } from "react";
import { FileText, Download, Filter, Upload, X } from "lucide-react";
import "../../styles/tutor/TutorMaterials.css";

export default function TutorMaterials({ softCard }) {
  const [materials, setMaterials] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");
  const [filterLevel, setFilterLevel] = useState("Todos");
  const [availableLevels, setAvailableLevels] = useState([]);

  const fileInputRef = useRef(null);

  const tutorId = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token) return 1;
    try {
      const tokenParts = token.split(".");
      if (tokenParts.length < 2) return 1;
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
    nivel: "A1",
    descripcion: "",
  });

  const loadMaterials = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/materials");
      if (!response.ok) throw new Error("No se pudieron cargar materiales");
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const normalizedData = data.map(m => ({
          ...m,
          nivel: m.nivel ? String(m.nivel).trim().toUpperCase() : null
        }));
        
        setMaterials(normalizedData);
        
        const levels = [...new Set(normalizedData.map(m => m.nivel).filter(Boolean))].sort();
        setAvailableLevels(levels);
      }
    } catch (error) {
      console.error(error);
      setMessage("No se pudieron cargar los materiales.");
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const filteredMaterials = filterLevel === "Todos" 
    ? materials 
    : materials.filter(m => m.nivel === filterLevel);

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
      
      body.append("titulo", form.titulo);
      body.append("tema", form.tema);
      body.append("nivel", form.nivel);
      body.append("descripcion", form.descripcion);
      body.append("file", selectedFile);
      
      if (tutorId) {
        body.append("id_asignacion", String(tutorId));
      }

      const response = await fetch("http://localhost:3000/api/materials/upload", {
        method: "POST",
        body,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "No se pudo subir el material");
      }

      setMessage("Archivo subido correctamente");
      setForm({ titulo: "", tema: "", nivel: "A1", descripcion: "" });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      loadMaterials();
    } catch (error) {
      console.error(error);
      setMessage(error.message || "No se pudo subir el material.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    const confirmed = window.confirm("¿Seguro que deseas eliminar este material?");
    if (!confirmed) return;

    try {
      setDeletingId(materialId);
      const response = await fetch(`http://localhost:3000/api/materials/${materialId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("No se pudo eliminar el material");
      setMessage("Material eliminado correctamente");
      loadMaterials();
    } catch (error) {
      console.error(error);
      setMessage("No se pudo eliminar el material.");
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

      <div className={softCard + " p-6"}>
        <h3 className="font-semibold text-lg mb-4">Nuevo material</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Título del material"
            value={form.titulo}
            onChange={(e) => handleChange("titulo", e.target.value)}
          />
          <input
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Tema"
            value={form.tema}
            onChange={(e) => handleChange("tema", e.target.value)}
          />
          <select
            className="rounded-xl border border-slate-300 px-4 py-3 bg-white"
            value={form.nivel}
            onChange={(e) => handleChange("nivel", e.target.value)}
          >
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
            <option value="C2">C2</option>
          </select>
        </div>
        <textarea
          className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3"
          rows="4"
          placeholder="Descripción del recurso"
          value={form.descripcion}
          onChange={(e) => handleChange("descripcion", e.target.value)}
        />
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        />
        {selectedFile && (
          <div className="mt-3 text-sm text-slate-600 flex items-center gap-2">
            Archivo seleccionado: {selectedFile.name}
            <button onClick={() => setSelectedFile(null)} className="text-red-500"><X size={16}/></button>
          </div>
        )}
        {message && <div className="mt-3 text-sm font-medium text-slate-600">{message}</div>}
        <div className="mt-4 flex gap-3">
          <button
            className="px-4 py-2.5 rounded-xl bg-slate-500 text-white text-sm font-medium hover:bg-slate-600 transition flex items-center gap-2"
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <Upload size={16} /> Seleccionar archivo
          </button>
          <button
            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
            onClick={handleSaveMaterial}
            disabled={isSaving}
            type="button"
          >
            {isSaving ? "Guardando..." : "Guardar material"}
          </button>
        </div>
      </div>

      <hr className="border-slate-200" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold">Mis Materiales</h2>
          <p className="text-slate-500 text-sm mt-1">
            Materiales de estudio correspondientes a tu nivel o de repaso.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
            <Filter size={16} />
            Filtrar por nivel:
          </label>
          <select 
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="border border-slate-300 rounded-xl px-4 py-2 bg-slate-50 text-sm font-medium outline-none focus:border-blue-500 focus:bg-white transition cursor-pointer"
          >
            <option value="Todos">Todos los niveles</option>
            {availableLevels.map(level => (
              <option key={level} value={level}>Nivel {level}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMaterials.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border-2 border-dashed rounded-2xl border-slate-200 bg-slate-50/50">
            <FileText size={48} className="text-slate-300 mb-4" />
            <p className="text-slate-600 font-medium">No hay materiales que coincidan con esta búsqueda.</p>
            <p className="text-slate-400 text-sm mt-1">Sube un nuevo material para verlo aquí.</p>
          </div>
        ) : (
          filteredMaterials.map((material) => (
            <div key={material.id_material} className={`${softCard} p-5 flex flex-col justify-between hover:border-blue-200 transition-colors`}>
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <FileText size={24} />
                  </div>
                  <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                    {material.nivel || "General"}
                  </span>
                </div>
                
                <h3 className="font-semibold text-lg line-clamp-2 leading-tight">{material.titulo}</h3>
                <p className="text-sm font-medium text-blue-600 mt-2 mb-2">{material.tema}</p>
                <p className="text-sm text-slate-500 line-clamp-3 mb-5">
                  {material.descripcion}
                </p>
              </div>
              
              <div className="flex gap-2">
                <a 
                  href={`http://localhost:3000/api/materials/${material.id_material}/download`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition text-sm font-medium"
                >
                  <Download size={16} /> Descargar
                </a>
                <button
                  className="px-4 py-2.5 rounded-xl bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition text-sm font-medium"
                  onClick={() => handleDeleteMaterial(material.id_material)}
                  disabled={deletingId === material.id_material}
                >
                  {deletingId === material.id_material ? "..." : "Eliminar"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}