import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/reviewer/ReviewerBeneficiarios.css";

export default function ReviewerBeneficiarios({ softCard }) {
  const [beneficiarios, setBeneficiarios] = useState([]);

  useEffect(() => {
    const loadBeneficiarios = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/org/beneficiarios"
        );
        setBeneficiarios(response.data);
      } catch (error) {
        console.error("Error cargando beneficiarios:", error);
      }
    };

    loadBeneficiarios();
  }, []);

  return (
    <div className="beneficiarios-grid">
      {beneficiarios.map((item) => {
        const nombreCompleto = [
          item.nombre,
          item.apellido_paterno,
          item.apellido_materno,
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div
            key={item.id_beneficiario}
            className={`${softCard} beneficiario-card`}
          >
            <div className="beneficiario-header">
              <div>
                <div className="beneficiario-nombre">
                  {nombreCompleto}
                </div>

                <div className="beneficiario-info">
                  Nivel: {item.nivel}
                </div>

                <div className="beneficiario-info">
                  Tutor: {item.tutor}
                </div>

                <div className="beneficiario-info">
                  Correo: {item.correo}
                </div>
              </div>

              <div className="beneficiario-avatar">
                {nombreCompleto[0]}
              </div>
            </div>

            <div className="beneficiario-status-container">
              <span
                className={`beneficiario-status ${
                  item.estatus === "activo"
                    ? "status-activo"
                    : "status-inactivo"
                }`}
              >
                {item.estatus}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}