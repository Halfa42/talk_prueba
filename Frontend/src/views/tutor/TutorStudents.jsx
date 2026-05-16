import React, { useEffect, useState } from "react";
import "../../styles/tutor/TutorStudents.css";

export default function TutorStudents({ softCard, onOpenStudent }) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/tutor-students?tutorId=1");
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
  {students.map((student) => (
    <div
      key={student.id_beneficiario}
      className={softCard + " p-5"}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-lg">
            {student.nombre} {student.apellido_paterno}
          </div>

          <div className="text-sm text-slate-500 mt-1">
            Nivel: {student.nivel}
          </div>

          <div className="text-sm text-slate-500">
            Idioma: {student.idioma}
          </div>

          <div className="text-sm text-slate-500">
            Matrícula: {student.matricula_folio}
          </div>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
          {student.nombre[0]}
        </div>
      </div>

      <div className="mt-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            student.estatus === "activo"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {student.estatus}
        </span>
      </div>

      <div className="mt-5">
        <button
          onClick={() => onOpenStudent(student, "registro")}
          className="w-full px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Ver ficha
        </button>
      </div>
    </div>
  ))}
</div>
  );
}