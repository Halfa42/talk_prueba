import React, { useEffect, useState } from "react";
import "../../styles/reviewer/ReviewerBitacoras.css";

const API_BASE = "http://localhost:3000/api";

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Modal({
  bitacora,
  onClose,
  onMarkReviewed,
  onRejectBitacora,
  onDeleteBitacora,
  processingAction,
  reviewComment,
  onReviewCommentChange,
}) {
  if (!bitacora) return null;

  const imageItems = [
    { label: "Recordatorio", base64: bitacora.imagen_recordatorio_base64, type: bitacora.imagen_recordatorio_tipo },
    { label: "Sesión",       base64: bitacora.imagen_sesion_base64,       type: bitacora.imagen_sesion_tipo },
    { label: "Incidencia",   base64: bitacora.imagen_incidencia_base64,   type: bitacora.imagen_incidencia_tipo },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-container">

        {/* Header */}
        <div className="modal-header">
          <div>
            <h3>Detalle de bitácora</h3>
            <p>Revisa la información registrada por el tutor antes de marcarla revisada.</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={() => { onClose(); onReviewCommentChange(""); }}
          >
            Cerrar
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">

          {/* Top grid: bitacora data + beneficiary */}
          <div className="modal-grid-2">
            <div className="soft-card">
              <h4>Datos de la bitácora</h4>
              <div className="detail-row"><span className="label">Tipo:</span> {bitacora.tipo || "-"}</div>
              <div className="detail-row"><span className="label">Tema:</span> {bitacora.tema || "-"}</div>
              <div className="detail-row"><span className="label">Fecha bitácora:</span> {formatDate(bitacora.fecha)}</div>
              <div className="detail-row"><span className="label">Hora:</span> {bitacora.hora || "-"}</div>
              <div className="detail-row"><span className="label">Revisado:</span> {bitacora.revisado ? "Sí" : "No"}</div>
            </div>
            <div className="soft-card">
              <h4>Beneficiario y tutor</h4>
              <div className="detail-row"><span className="label">Beneficiario:</span> {bitacora.beneficiario}</div>
              <div className="detail-row"><span className="label">Tutor:</span> {bitacora.tutor}</div>
              <div className="detail-row"><span className="label">Matrícula / Folio:</span> {bitacora.matricula_folio || "-"}</div>
              <div className="detail-row"><span className="label">Nivel:</span> {bitacora.nivel || "-"}</div>
              <div className="detail-row"><span className="label">Idioma:</span> {bitacora.idioma_beneficiario || "-"}</div>
            </div>
          </div>

          {/* Description */}
          <div className="soft-card">
            <h4>Descripción</h4>
            <p style={{ whiteSpace: "pre-wrap", fontSize: "0.875rem", color: "#334155" }}>
              {bitacora.descripcion || "Sin descripción."}
            </p>
          </div>

          {/* Planning + session grid */}
          <div className="modal-grid-2">
            <div className="soft-card">
              <h4>Planeación / tareas</h4>
              <div className="detail-row">
                <span className="label">Planeación siguiente sesión:</span>
                <p style={{ marginTop: "0.25rem", color: "#334155" }}>{bitacora.planeacion_siguiente_sesion || "-"}</p>
              </div>
              <div className="detail-row">
                <span className="label">Tareas asignadas:</span>
                <p style={{ marginTop: "0.25rem", color: "#334155" }}>{bitacora.tareas_asignadas || "-"}</p>
              </div>
            </div>
            <div className="soft-card">
              <h4>Sesión registrada</h4>
              <div className="detail-row"><span className="label">Fecha sesión:</span> {formatDate(bitacora.fecha_sesion)}</div>
              <div className="detail-row"><span className="label">Horario:</span> {bitacora.hora_inicio || "-"} - {bitacora.hora_fin || "-"}</div>
              <div className="detail-row"><span className="label">Asistencia:</span> {bitacora.asistencia || "-"}</div>
              <div className="detail-row"><span className="label">Horas registradas:</span> {bitacora.horas_registradas ?? "0"}</div>
              <div className="detail-row">
                <span className="label">Aprobado padre/madre:</span>{" "}
                {bitacora.aprobado_padre_madre === true ? "Sí" : bitacora.aprobado_padre_madre === false ? "No" : "-"}
              </div>
            </div>
          </div>

          {/* Observations */}
          <div className="soft-card">
            <h4>Observaciones de sesión</h4>
            <p style={{ whiteSpace: "pre-wrap", fontSize: "0.875rem", color: "#334155" }}>
              {bitacora.observaciones || "Sin observaciones."}
            </p>
          </div>

          {/* Reviewer comment */}
          <div className="soft-card">
            <h4>Comentario del revisor</h4>
            <textarea
              className="review-textarea"
              rows={4}
              value={reviewComment}
              onChange={(e) => onReviewCommentChange(e.target.value)}
              placeholder="Agrega tus comentarios al revisar esta bitácora"
            />
          </div>

          {/* Images */}
          <div className="soft-card">
            <h4>Imágenes adjuntas</h4>
            <div className="image-grid">
              {imageItems.map((image) => (
                <div key={image.label} className="image-card">
                  <div className="image-card-label">{image.label}</div>
                  {image.base64 ? (
                    <img
                      src={`data:${image.type};base64,${image.base64}`}
                      alt={`${image.label} adjunta`}
                    />
                  ) : (
                    <div className="image-placeholder">No hay imagen</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
            >
              Cerrar
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => onRejectBitacora(bitacora.id, reviewComment)}
              disabled={processingAction.id === bitacora.id && processingAction.type !== "reject"}
            >
              {processingAction.id === bitacora.id && processingAction.type === "reject"
                ? "Rechazando..."
                : "Rechazar bitácora"}
            </button>
            <button
              type="button"
              className="btn btn-neutral"
              onClick={() => onDeleteBitacora(bitacora.id)}
              disabled={processingAction.id === bitacora.id && processingAction.type !== "delete"}
            >
              {processingAction.id === bitacora.id && processingAction.type === "delete"
                ? "Eliminando..."
                : "Eliminar bitácora"}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onMarkReviewed(bitacora.id, reviewComment)}
              disabled={processingAction.id === bitacora.id && processingAction.type !== "review"}
            >
              {processingAction.id === bitacora.id && processingAction.type === "review"
                ? "Marcando..."
                : "Marcar revisada"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ReviewerBitacoras({ softCard }) {
  const [bitacoras, setBitacoras]           = useState([]);
  const [msg, setMsg]                       = useState(null);
  const [processingAction, setProcessingAction] = useState({ id: null, type: null });
  const [reviewComment, setReviewComment]   = useState("");
  const [selectedBitacora, setSelectedBitacora] = useState(null);
  const [loadingList, setLoadingList]       = useState(true);
  const [detailLoading, setDetailLoading]   = useState(false);

  const normalizeBitacora = (row) => ({
    id:                       row.id_bitacora,
    tipo:                     row.tipo,
    descripcion:              row.descripcion,
    fecha:                    row.fecha,
    hora:                     row.hora,
    tema:                     row.tema,
    planeacion_siguiente_sesion: row.planeacion_siguiente_sesion,
    tareas_asignadas:         row.tareas_asignadas,
    revisado:                 row.revisado,
    beneficiario:             row.beneficiario,
    tutor:                    row.tutor,
    matricula_folio:          row.matricula_folio,
    nivel:                    row.nivel,
    idioma_beneficiario:      row.idioma_beneficiario,
    fecha_sesion:             row.fecha_sesion,
    hora_inicio:              row.hora_inicio,
    hora_fin:                 row.hora_fin,
    asistencia:               row.asistencia,
    horas_registradas:        row.horas_registradas,
    observaciones:            row.observaciones,
    aprobado_padre_madre:     row.aprobado_padre_madre,
    estado:                   row.revisado ? "Revisada" : "Pendiente",
  });

  const loadPendingBitacoras = async () => {
    setLoadingList(true);
    setMsg(null);
    try {
      const response = await fetch(`${API_BASE}/bitacoras/pendientes`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "No se pudo cargar las bitácoras pendientes");
      setBitacoras(data.map(normalizeBitacora));
    } catch (err) {
      setMsg({ tipo: "error", texto: err.message });
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadPendingBitacoras();
  }, []);

  const openBitacoraModal = async (id) => {
    setDetailLoading(true);
    setSelectedBitacora(null);
    setReviewComment("");
    setMsg(null);
    try {
      const response = await fetch(`${API_BASE}/bitacoras/${id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "No se pudo cargar la bitácora");
      setSelectedBitacora({
        ...normalizeBitacora(data),
        imagen_recordatorio_base64: data.imagen_recordatorio_base64,
        imagen_recordatorio_tipo:   data.imagen_recordatorio_tipo,
        imagen_sesion_base64:       data.imagen_sesion_base64,
        imagen_sesion_tipo:         data.imagen_sesion_tipo,
        imagen_incidencia_base64:   data.imagen_incidencia_base64,
        imagen_incidencia_tipo:     data.imagen_incidencia_tipo,
        comentario_revisor:         data.comentario_revisor || "",
      });
      setReviewComment(data.comentario_revisor || "");
    } catch (err) {
      setMsg({ tipo: "error", texto: err.message });
    } finally {
      setDetailLoading(false);
    }
  };

  const safeParseResponse = async (response, fallbackMessage) => {
    const text = await response.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = null; }
    if (!response.ok) throw new Error(data?.message || text || fallbackMessage);
    return data;
  };

  const handleMarkReviewed = async (id, comentarioRevisor) => {
    setProcessingAction({ id, type: "review" });
    setMsg(null);
    try {
      const response = await fetch(`${API_BASE}/bitacoras/${id}/revisar`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comentario_revisor: comentarioRevisor !== undefined ? comentarioRevisor : reviewComment }),
      });
      await safeParseResponse(response, "No se pudo marcar como revisada");
      setBitacoras((prev) => prev.filter((item) => item.id !== id));
      if (selectedBitacora?.id === id) setSelectedBitacora(null);
      setMsg({ tipo: "ok", texto: "Bitácora marcada como revisada." });
    } catch (err) {
      setMsg({ tipo: "error", texto: err.message });
    } finally {
      setProcessingAction({ id: null, type: null });
    }
  };

  const handleRejectBitacora = async (id, comentarioRevisor) => {
    setProcessingAction({ id, type: "reject" });
    setMsg(null);
    try {
      const response = await fetch(`${API_BASE}/bitacoras/${id}/rechazar`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comentario_revisor: comentarioRevisor !== undefined ? comentarioRevisor : "Rechazada por el revisor" }),
      });
      await safeParseResponse(response, "No se pudo rechazar la bitácora");
      setBitacoras((prev) => prev.filter((item) => item.id !== id));
      if (selectedBitacora?.id === id) setSelectedBitacora(null);
      setMsg({ tipo: "ok", texto: "Bitácora rechazada." });
    } catch (err) {
      setMsg({ tipo: "error", texto: err.message });
    } finally {
      setProcessingAction({ id: null, type: null });
    }
  };

  const handleDeleteBitacora = async (id) => {
    setProcessingAction({ id, type: "delete" });
    setMsg(null);
    try {
      const response = await fetch(`${API_BASE}/bitacoras/${id}`, { method: "DELETE" });
      await safeParseResponse(response, "No se pudo eliminar la bitácora");
      setBitacoras((prev) => prev.filter((item) => item.id !== id));
      if (selectedBitacora?.id === id) setSelectedBitacora(null);
      setMsg({ tipo: "ok", texto: "Bitácora eliminada." });
    } catch (err) {
      setMsg({ tipo: "error", texto: err.message });
    } finally {
      setProcessingAction({ id: null, type: null });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Page header */}
      <div className="page-header">
        <h2>Bitácoras por revisar</h2>
        <p>Revisa entradas y valida el seguimiento.</p>
      </div>

      {/* Alert */}
      {msg && (
        <div className={`alert ${msg.tipo === "ok" ? "alert-ok" : "alert-error"}`}>
          {msg.texto}
        </div>
      )}

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {loadingList ? (
          <div className={`soft-card ${softCard ?? ""}`}>Cargando bitácoras pendientes...</div>
        ) : bitacoras.length === 0 ? (
          <div className={`soft-card ${softCard ?? ""}`}>No hay bitácoras pendientes.</div>
        ) : (
          bitacoras.map((item) => (
            <div key={item.id} className={`soft-card bitacora-card ${softCard ?? ""}`}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div>
                  <h3>{item.tema || "Sin tema"}</h3>
                  <p className="description">{item.descripcion?.slice(0, 120) || "No hay descripción breve."}</p>
                  <div className="bitacora-meta">
                    <div><span className="label">Beneficiario:</span> {item.beneficiario}</div>
                    <div><span className="label">Tutor:</span> {item.tutor}</div>
                    <div><span className="label">Fecha:</span> {formatDate(item.fecha)}</div>
                    <div><span className="label">Tipo:</span> {item.tipo || "-"}</div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <span className="status-badge">{item.estado}</span>
                <div className="card-actions">
                  <button
                    type="button"
                    className="btn-sm btn-ghost"
                    onClick={() => openBitacoraModal(item.id)}
                  >
                    Ver detalles
                  </button>
                  <button
                    type="button"
                    className="btn-sm btn-danger"
                    onClick={() => handleRejectBitacora(item.id)}
                    disabled={processingAction.id === item.id}
                  >
                    {processingAction.id === item.id && processingAction.type === "reject" ? "Rechazando..." : "Rechazar"}
                  </button>
                  <button
                    type="button"
                    className="btn-sm btn-neutral"
                    onClick={() => handleDeleteBitacora(item.id)}
                    disabled={processingAction.id === item.id}
                  >
                    {processingAction.id === item.id && processingAction.type === "delete" ? "Eliminando..." : "Eliminar"}
                  </button>
                  <button
                    type="button"
                    className="btn-sm btn-primary"
                    onClick={() => handleMarkReviewed(item.id, "")}
                    disabled={processingAction.id === item.id}
                  >
                    {processingAction.id === item.id && processingAction.type === "review" ? "Marcando..." : "Marcar revisada"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {selectedBitacora && (
        <Modal
          bitacora={selectedBitacora}
          onClose={() => setSelectedBitacora(null)}
          onMarkReviewed={handleMarkReviewed}
          onRejectBitacora={handleRejectBitacora}
          onDeleteBitacora={handleDeleteBitacora}
          processingAction={processingAction}
          reviewComment={reviewComment}
          onReviewCommentChange={setReviewComment}
        />
      )}

      {/* Detail loading state */}
      {detailLoading && selectedBitacora === null && (
        <div className={`soft-card ${softCard ?? ""}`}>Cargando detalle de bitácora...</div>
      )}
    </div>
  );
}