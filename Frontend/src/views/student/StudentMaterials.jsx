import React, { useState, useEffect } from "react";
import { FileText, Download, Filter } from "lucide-react";

export default function StudentMaterials({ softCard }) {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : {};
  const studentId = user.id_beneficiario || user.id_usuario;

  const [materials, setMaterials] = useState([]);
  const [filterLevel, setFilterLevel] = useState("Todos");
  const [availableLevels, setAvailableLevels] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!studentId || studentId === "undefined") return;
      try {
        const res = await fetch(`http://localhost:3000/api/student-dashboard/${studentId}/materials`);
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setMaterials(data);
          
          const levels = [...new Set(data.map(m => m.nivel).filter(Boolean))].sort();
          setAvailableLevels(levels);
        }
      } catch (error) {
        console.error("Error cargando los materiales:", error);
      }
    };
    
    fetchMaterials();
  }, [studentId]);

  const filteredMaterials = filterLevel === "Todos" 
    ? materials 
    : materials.filter(m => m.nivel === filterLevel);

  return (
    <div className="space-y-6">
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
            <p className="text-slate-400 text-sm mt-1">Espera a que tu tutor comparta contenido nuevo.</p>
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
              
              <a 
                href={`http://localhost:3000${material.archivo_url}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition text-sm font-medium"
              >
                <Download size={16} />
                Descargar material
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}