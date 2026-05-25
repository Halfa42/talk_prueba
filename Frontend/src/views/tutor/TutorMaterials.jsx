import React, { useEffect, useState } from "react";
import "../../styles/tutor/TutorMaterials.css";

export default function TutorMaterials({ softCard, tutorUserId }) {
  const [materials, setMaterials] = useState([]);
  const [message, setMessage] = useState("");

  const loadMaterials = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/materials?userId=${tutorUserId}`
      );

      if (!response.ok) {
        throw new Error("No se pudieron cargar materiales");
      }

      const data = await response.json();
      setMaterials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setMessage("No se pudieron cargar los materiales.");
    }
  };

  useEffect(() => {
    if (tutorUserId) {
      loadMaterials();
    }
  }, [tutorUserId]);

  const handleDownload = (materialId) => {
    window.open(`http://localhost:3000/api/materials/${materialId}/download`, "_blank");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Material institucional</h2>
        <p className="text-sm text-slate-500">
          Consulta y descarga los materiales compartidos por el socio formador y los asociados a tus alumnos.
        </p>
      </div>

      <div className={softCard + " p-5"}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Biblioteca disponible</h3>
          <button
            className="px-4 py-2 rounded-xl bg-slate-100 text-sm"
            onClick={loadMaterials}
            type="button"
          >
            Actualizar
          </button>
        </div>

        {message && <p className="mb-4 text-sm text-red-600">{message}</p>}

        <div className="space-y-3 text-sm">
          {materials.length === 0 && (
            <div className="p-3 rounded-xl bg-slate-50 border text-slate-500">
              No hay materiales disponibles todavía.
            </div>
          )}

          {materials.map((item) => (
            <div
              key={item.id_material}
              className="w-full p-4 rounded-xl bg-slate-50 border"
            >
              <div className="font-medium">{item.titulo || "Sin título"}</div>

              <div className="text-xs text-slate-500 mt-1">
                {item.tema || "Sin tema"} · {item.nivel || "Sin nivel"}
              </div>

              {item.descripcion && (
                <div className="text-sm text-slate-600 mt-2">{item.descripcion}</div>
              )}

              {item.nombre && (
                <div className="text-xs text-slate-500 mt-2">
                  Beneficiario relacionado: {item.nombre} {item.apellido_paterno}
                </div>
              )}

              <div className="text-xs text-slate-500 mt-1">
                Archivo: {item.nombre_archivo_original || item.archivo_nombre || "Sin archivo"}
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  className="px-3 py-2 rounded-xl bg-white border hover:border-blue-300 transition"
                  onClick={() => handleDownload(item.id_material)}
                >
                  Descargar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}