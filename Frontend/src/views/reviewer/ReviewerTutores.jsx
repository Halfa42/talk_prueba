import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/reviewer/ReviewerTutores.css";

export default function ReviewerTutores({ softCard }) {
  const [tutores, setTutores] = useState([]);

  useEffect(() => {
    const loadTutores = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/org/tutores"
        );
        setTutores(response.data);
      } catch (error) {
        console.error("Error cargando tutores:", error);
      }
    };
    loadTutores();
  }, []);

  return (
    <div className="tutores-grid">
      {tutores.map((tutor) => {
        const nombreCompleto = [
          tutor.nombre,
          tutor.apellido_paterno,
          tutor.apellido_materno,
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div key={tutor.id_tutor} className={`${softCard} tutor-card`}>
            <div className="tutor-card__header">
              <div className="tutor-card__info">
                <div className="tutor-card__name">{nombreCompleto}</div>
                <div className="tutor-card__detail">
                  Correo: {tutor.correo}
                </div>
                <div className="tutor-card__detail">
                  Idioma: {tutor.idioma || "N/A"}
                </div>
                <div className="tutor-card__detail">
                  Beneficiarios asignados: {tutor.beneficiarios_asignados}
                </div>
              </div>
              <div className="tutor-card__avatar">
                {nombreCompleto[0]}
              </div>
            </div>
            <div className="tutor-card__footer">
              <span
                className={`tutor-card__status ${
                  tutor.estatus === "activo"
                    ? "tutor-card__status--active"
                    : "tutor-card__status--inactive"
                }`}
              >
                {tutor.estatus}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}