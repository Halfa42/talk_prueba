import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  CalendarDays,
  ClipboardList,
  FileText,
  FolderOpen,
  BookOpen,
  LogOut,
  X,
} from "lucide-react";
import KpiCard from "../components/KpiCard";

function ModalWrapper({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export default function OrgView({ onLogout }) {
  const [orgModule, setOrgModule] = useState("dashboard");

  const [beneficiarios, setBeneficiarios] = useState([]);
  const [tutores, setTutores] = useState([]);
  const [simpleTutores, setSimpleTutores] = useState([]);
  const [simpleBeneficiarios, setSimpleBeneficiarios] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);

  const [showBeneficiaryModal, setShowBeneficiaryModal] = useState(false);
  const [showTutorModal, setShowTutorModal] = useState(false);

  const [beneficiaryForm, setBeneficiaryForm] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo: "",
    contrasena: "",
    nivel: "",
    estatus: "Activa",
    tutorId: "",
    matricula_folio: "",
    idioma: "",
    periodo: "2026-A",
    fecha_inicio: "",
    fecha_fin: "",
  });

  const [tutorForm, setTutorForm] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo: "",
    contrasena: "",
    idioma: "",
    estatus: "Activa",
  });

  const [assignmentForm, setAssignmentForm] = useState({
    tutorId: "",
    beneficiarioId: "",
    periodo: "2026-A",
    fecha_inicio: "",
    fecha_fin: "",
    estatus: "Activa",
  });

  const [statusMessage, setStatusMessage] = useState("");

  const softCard = "bg-white rounded-2xl border border-slate-200 shadow-sm";
  const menuClass = (active) =>
    `w-full flex items-center gap-3 text-left px-4 py-3 rounded-2xl text-sm border transition ${
      active
        ? "bg-blue-600 text-white border-blue-600 font-medium shadow-sm"
        : "bg-white border-transparent hover:bg-slate-50"
    }`;

  const actionButtonClass =
    "px-3 py-1.5 rounded-lg text-xs font-medium transition";
  const editButtonClass =
    actionButtonClass + " bg-amber-100 text-amber-700 hover:bg-amber-200";
  const deleteButtonClass =
    actionButtonClass + " bg-red-100 text-red-600 hover:bg-red-200";

  const inputClass =
    "w-full rounded-xl border border-slate-300 px-4 py-3 bg-white";
  const labelClass = "text-sm font-medium text-slate-600 mb-2 block";

  const isActiveStatus = (value) => {
    const v = String(value || "").trim().toLowerCase();
    return v === "activa" || v === "activo";
  };

  const loadBeneficiarios = async () => {
    const response = await axios.get("http://localhost:3000/api/org/beneficiarios");
    setBeneficiarios(response.data);
  };

  const loadTutores = async () => {
    const response = await axios.get("http://localhost:3000/api/org/tutores");
    setTutores(response.data);
  };

  const loadSimpleTutores = async () => {
    const response = await axios.get("http://localhost:3000/api/org/tutores-simple");
    setSimpleTutores(response.data);
  };

  const loadSimpleBeneficiarios = async () => {
    const response = await axios.get(
      "http://localhost:3000/api/org/beneficiarios-simple"
    );
    setSimpleBeneficiarios(response.data);
  };

  const loadAsignaciones = async () => {
    const response = await axios.get("http://localhost:3000/api/org/asignaciones");
    setAsignaciones(response.data);
  };

  const loadAllData = async () => {
    try {
      await Promise.all([
        loadBeneficiarios(),
        loadTutores(),
        loadSimpleTutores(),
        loadSimpleBeneficiarios(),
        loadAsignaciones(),
      ]);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const resetBeneficiaryForm = () => {
    setBeneficiaryForm({
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      correo: "",
      contrasena: "",
      nivel: "",
      estatus: "Activa",
      tutorId: "",
      matricula_folio: "",
      idioma: "",
      periodo: "2026-A",
      fecha_inicio: "",
      fecha_fin: "",
    });
  };

  const resetTutorForm = () => {
    setTutorForm({
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      correo: "",
      contrasena: "",
      idioma: "",
      estatus: "Activa",
    });
  };

  const resetAssignmentForm = () => {
    setAssignmentForm({
      tutorId: "",
      beneficiarioId: "",
      periodo: "2026-A",
      fecha_inicio: "",
      fecha_fin: "",
      estatus: "Activa",
    });
  };

  const handleCreateBeneficiary = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    try {
      await axios.post("http://localhost:3000/api/org/beneficiarios", beneficiaryForm);
      await loadAllData();
      setShowBeneficiaryModal(false);
      resetBeneficiaryForm();
      setStatusMessage("Beneficiario agregado correctamente.");
    } catch (error) {
      setStatusMessage(
        `${error.response?.data?.message || "No se pudo agregar el beneficiario."}`
      );
    }
  };

  const handleCreateTutor = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    try {
      await axios.post("http://localhost:3000/api/org/tutores", tutorForm);
      await loadAllData();
      setShowTutorModal(false);
      resetTutorForm();
      setStatusMessage("✅ Tutor agregado correctamente.");
    } catch (error) {
      setStatusMessage(
        `❌ ${error.response?.data?.message || "No se pudo agregar el tutor."}`
      );
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    try {
      await axios.post("http://localhost:3000/api/org/asignaciones", assignmentForm);
      await loadAllData();
      resetAssignmentForm();
      setStatusMessage("✅ Asignación creada correctamente.");
    } catch (error) {
      setStatusMessage(
        `❌ ${error.response?.data?.message || "No se pudo crear la asignación."}`
      );
    }
  };

  const handleDeleteBeneficiary = async (id) => {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar este beneficiario?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:3000/api/org/beneficiarios/${id}`);
      await loadAllData();
      setStatusMessage("✅ Beneficiario eliminado correctamente.");
    } catch (error) {
      setStatusMessage(
        `❌ ${error.response?.data?.message || "No se pudo eliminar el beneficiario."}`
      );
    }
  };

  const handleDeleteTutor = async (id) => {
    const confirmed = window.confirm("¿Seguro que deseas eliminar este tutor?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:3000/api/org/tutores/${id}`);
      await loadAllData();
      setStatusMessage("✅ Tutor eliminado correctamente.");
    } catch (error) {
      setStatusMessage(
        `❌ ${error.response?.data?.message || "No se pudo eliminar el tutor."}`
      );
    }
  };

  const handleDeleteAssignment = async (id) => {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar esta asignación?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:3000/api/org/asignaciones/${id}`);
      await loadAllData();
      setStatusMessage("✅ Asignación eliminada correctamente.");
    } catch (error) {
      setStatusMessage(
        `❌ ${error.response?.data?.message || "No se pudo eliminar la asignación."}`
      );
    }
  };

  const renderContent = () => {
    if (orgModule === "dashboard")
      return (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <KpiCard
              title="Beneficiarios activos"
              value={beneficiarios.filter((b) => isActiveStatus(b.estatus)).length}
            />
            <KpiCard
              title="Tutores activos"
              value={tutores.filter((t) => isActiveStatus(t.estatus)).length}
            />
            <KpiCard
              title="Horas acumuladas"
              value={`${tutores
                .reduce((acc, tutor) => acc + Number(tutor.horas_acumuladas || 0), 0)
                .toFixed(0)} h`}
            />
          </div>

          <div className={softCard + " p-5"}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Asignaciones recientes</h2>
              <button
                onClick={() => setOrgModule("assignment")}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm"
              >
                Nueva asignación
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="text-left p-3">Beneficiario</th>
                    <th className="text-left p-3">Tutor</th>
                    <th className="text-left p-3">Nivel</th>
                    <th className="text-left p-3">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {asignaciones.slice(0, 5).map((item) => (
                    <tr
                      key={item.id_asignacion}
                      className="border-t border-slate-200 bg-white"
                    >
                      <td className="p-3">{item.beneficiario}</td>
                      <td className="p-3">{item.tutor}</td>
                      <td className="p-3">{item.nivel}</td>
                      <td className="p-3">{item.estatus}</td>
                    </tr>
                  ))}
                  {asignaciones.length === 0 && (
                    <tr>
                      <td className="p-4 text-slate-500" colSpan="4">
                        No hay asignaciones registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className={softCard + " p-5"}>
            <h3 className="font-semibold text-lg mb-4">Alertas operativas</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                2 tutores no han registrado sesión esta semana.
              </div>
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
                1 beneficiario tiene 3 faltas consecutivas.
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                5 materiales nuevos están pendientes de revisión.
              </div>
            </div>
          </div>
        </div>
      );

    if (orgModule === "beneficiaries")
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Gestión de beneficiarios</h2>
              <p className="text-sm text-slate-500">
                Consulta información académica, avance y tutor asignado.
              </p>
            </div>
            <button
              onClick={() => setShowBeneficiaryModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm"
            >
              Nuevo beneficiario
            </button>
          </div>

          <div className={softCard + " p-5"}>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="text-left p-3">Nombre</th>
                    <th className="text-left p-3">Nivel</th>
                    <th className="text-left p-3">Tutor</th>
                    <th className="text-left p-3">Asistencia</th>
                    <th className="text-left p-3">Estado</th>
                    <th className="text-left p-3">Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {beneficiarios.map((row) => (
                    <tr
                      key={row.id_beneficiario}
                      className="border-t border-slate-200 bg-white"
                    >
                      <td className="p-3">
                        {row.nombre} {row.apellido_paterno}
                      </td>
                      <td className="p-3">{row.nivel || "Sin nivel"}</td>
                      <td className="p-3">{row.tutor}</td>
                      <td className="p-3">--</td>
                      <td className="p-3">
                        {isActiveStatus(row.estatus) ? "Activa" : "No activa"}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button className={editButtonClass}>Modificar</button>
                          <button
                            onClick={() => handleDeleteBeneficiary(row.id_beneficiario)}
                            className={deleteButtonClass}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {beneficiarios.length === 0 && (
                    <tr>
                      <td className="p-4 text-slate-500" colSpan="6">
                        No hay beneficiarios registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );

    if (orgModule === "tutors")
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Gestión de tutores</h2>
              <p className="text-sm text-slate-500">
                Monitorea carga de trabajo y horas.
              </p>
            </div>
            <button
              onClick={() => setShowTutorModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm"
            >
              Nuevo tutor
            </button>
          </div>

          <div className={softCard + " p-5"}>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="text-left p-3">Nombre</th>
                    <th className="text-left p-3">Beneficiarios asignados</th>
                    <th className="text-left p-3">Horas acumuladas</th>
                    <th className="text-left p-3">Estado</th>
                    <th className="text-left p-3">Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tutores.map((row) => (
                    <tr
                      key={row.id_tutor}
                      className="border-t border-slate-200 bg-white"
                    >
                      <td className="p-3">
                        {row.nombre} {row.apellido_paterno}
                      </td>
                      <td className="p-3">
                        {row.beneficiarios_asignados} beneficiarios
                      </td>
                      <td className="p-3">
                        {Number(row.horas_acumuladas || 0).toFixed(0)} h
                      </td>
                      <td className="p-3">
                        {isActiveStatus(row.estatus) ? "Activa" : "No activa"}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button className={editButtonClass}>Modificar</button>
                          <button
                            onClick={() => handleDeleteTutor(row.id_tutor)}
                            className={deleteButtonClass}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {tutores.length === 0 && (
                    <tr>
                      <td className="p-4 text-slate-500" colSpan="5">
                        No hay tutores registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );

    if (orgModule === "assignment")
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">
              Asignación tutor-beneficiario
            </h2>
          </div>

          <div className="grid xl:grid-cols-2 gap-6">
            <form onSubmit={handleCreateAssignment} className={softCard + " p-5"}>
              <h3 className="font-semibold text-lg mb-4">Nueva asignación</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Tutor</label>
                  <select
                    className={inputClass}
                    value={assignmentForm.tutorId}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        tutorId: e.target.value,
                      })
                    }
                  >
                    <option value="">Selecciona tutor</option>
                    {simpleTutores.map((tutor) => (
                      <option key={tutor.id_tutor} value={tutor.id_tutor}>
                        {tutor.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Beneficiario</label>
                  <select
                    className={inputClass}
                    value={assignmentForm.beneficiarioId}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        beneficiarioId: e.target.value,
                      })
                    }
                  >
                    <option value="">Selecciona beneficiario</option>
                    {simpleBeneficiarios.map((beneficiario) => (
                      <option
                        key={beneficiario.id_beneficiario}
                        value={beneficiario.id_beneficiario}
                      >
                        {beneficiario.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Periodo</label>
                  <input
                    className={inputClass}
                    value={assignmentForm.periodo}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        periodo: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className={labelClass}>Estado</label>
                  <select
                    className={inputClass}
                    value={assignmentForm.estatus}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        estatus: e.target.value,
                      })
                    }
                  >
                    <option value="Activa">Activa</option>
                    <option value="No activa">No activa</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Fecha inicio</label>
                  <input
                    className={inputClass}
                    type="date"
                    value={assignmentForm.fecha_inicio}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        fecha_inicio: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className={labelClass}>Fecha fin</label>
                  <input
                    className={inputClass}
                    type="date"
                    value={assignmentForm.fecha_fin}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        fecha_fin: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white"
              >
                Guardar asignación
              </button>
            </form>

            <div className={softCard + " p-5"}>
              <h3 className="font-semibold text-lg mb-4">
                Asignaciones activas
              </h3>

              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="text-left p-3">Beneficiario</th>
                      <th className="text-left p-3">Tutor</th>
                      <th className="text-left p-3">Periodo</th>
                      <th className="text-left p-3">Estado</th>
                      <th className="text-left p-3">Opciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asignaciones.map((row) => (
                      <tr
                        key={row.id_asignacion}
                        className="border-t border-slate-200 bg-white"
                      >
                        <td className="p-3">{row.beneficiario}</td>
                        <td className="p-3">{row.tutor}</td>
                        <td className="p-3">{row.periodo || "Sin periodo"}</td>
                        <td className="p-3">{row.estatus}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button className={editButtonClass}>Modificar</button>
                            <button
                              onClick={() => handleDeleteAssignment(row.id_asignacion)}
                              className={deleteButtonClass}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {asignaciones.length === 0 && (
                      <tr>
                        <td className="p-4 text-slate-500" colSpan="5">
                          No hay asignaciones registradas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      );

    if (orgModule === "tracking")
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Seguimiento</h2>
          <div className="grid xl:grid-cols-2 gap-6">
            <div className={softCard + " p-5"}>
              <h3 className="font-semibold text-lg mb-4">
                Casos en seguimiento
              </h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  Carlos Vega — asistencia irregular
                </div>
                <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                  Fernanda Gil — requiere revisión académica
                </div>
              </div>
            </div>

            <div className={softCard + " p-5"}>
              <h3 className="font-semibold text-lg mb-4">Observaciones</h3>

              <select className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white mb-4">
                <option>Selecciona tutor</option>
                <option>Ana Ruiz</option>
                <option>Luis Rojas</option>
                <option>Paola Díaz</option>
              </select>

              <textarea
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                rows="6"
                placeholder="Registrar observaciones del caso"
              />

              <button className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white">
                Guardar observaciones
              </button>
            </div>
          </div>
        </div>
      );

    if (orgModule === "logs")
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Horas y evidencias</h2>
          <div className={softCard + " p-5"}>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="text-left p-3">Tutor</th>
                    <th className="text-left p-3">Horas</th>
                    <th className="text-left p-3">Sesiones</th>
                    <th className="text-left p-3">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Ana Ruiz", "41 h", "28", "Validado"],
                    ["Luis Rojas", "36 h", "22", "Pendiente"],
                    ["Paola Díaz", "29 h", "19", "Validado"],
                  ].map((row, i) => (
                    <tr key={i} className="border-t border-slate-200 bg-white">
                      {row.map((cell, index) => (
                        <td key={`${cell}-${index}`} className="p-3">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );

    if (orgModule === "reports")
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Reportes</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              "Reporte de beneficiarios",
              "Reporte de tutores",
              "Reporte de horas",
            ].map((item) => (
              <div key={item} className={softCard + " p-5"}>
                <div className="font-semibold">{item}</div>
                <button className="mt-4 px-3 py-2 rounded-xl bg-slate-100 text-sm">
                  Descargar
                </button>
              </div>
            ))}
          </div>
        </div>
      );

    if (orgModule === "materials")
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Material institucional</h2>

          <div className={softCard + " p-5 max-w-3xl"}>
            <h3 className="font-semibold text-lg mb-4">Subir material</h3>

            <input className={inputClass + " mb-3"} placeholder="Título" />

            <textarea
              className={inputClass + " mb-4"}
              rows="4"
              placeholder="Descripción"
            />

            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700">
                Subir archivo
              </button>
              <button className="px-4 py-2 rounded-xl bg-blue-600 text-white">
                Guardar material
              </button>
            </div>
          </div>
        </div>
      );

    return null;
  };

  return (
    <div className="flex min-h-[760px] bg-slate-50">
      <aside className="w-72 bg-white border-r border-slate-200 p-4 flex flex-col justify-between">
        <div className="space-y-2">
          <button
            onClick={() => setOrgModule("dashboard")}
            className={menuClass(orgModule === "dashboard")}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button
            onClick={() => setOrgModule("beneficiaries")}
            className={menuClass(orgModule === "beneficiaries")}
          >
            <GraduationCap size={18} /> Beneficiarios
          </button>
          <button
            onClick={() => setOrgModule("tutors")}
            className={menuClass(orgModule === "tutors")}
          >
            <Users size={18} /> Tutores
          </button>
          <button
            onClick={() => setOrgModule("assignment")}
            className={menuClass(orgModule === "assignment")}
          >
            <CalendarDays size={18} /> Asignaciones
          </button>
          <button
            onClick={() => setOrgModule("tracking")}
            className={menuClass(orgModule === "tracking")}
          >
            <ClipboardList size={18} /> Seguimiento
          </button>
          <button
            onClick={() => setOrgModule("logs")}
            className={menuClass(orgModule === "logs")}
          >
            <FileText size={18} /> Horas y evidencias
          </button>
          <button
            onClick={() => setOrgModule("reports")}
            className={menuClass(orgModule === "reports")}
          >
            <FolderOpen size={18} /> Reportes
          </button>
          <button
            onClick={() => setOrgModule("materials")}
            className={menuClass(orgModule === "materials")}
          >
            <BookOpen size={18} /> Material institucional
          </button>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-2xl text-sm border border-red-200 text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={18} /> Cerrar sesión
        </button>
      </aside>

      <main className="flex-1 p-6 space-y-6">
        {statusMessage && (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
            {statusMessage}
          </div>
        )}

        {renderContent()}
      </main>

      {showBeneficiaryModal && (
        <ModalWrapper
          title="Nuevo beneficiario"
          onClose={() => {
            setShowBeneficiaryModal(false);
            resetBeneficiaryForm();
          }}
        >
          <form onSubmit={handleCreateBeneficiary} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nombre</label>
                <input
                  className={inputClass}
                  value={beneficiaryForm.nombre}
                  onChange={(e) =>
                    setBeneficiaryForm({ ...beneficiaryForm, nombre: e.target.value })
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Apellido paterno</label>
                <input
                  className={inputClass}
                  value={beneficiaryForm.apellido_paterno}
                  onChange={(e) =>
                    setBeneficiaryForm({
                      ...beneficiaryForm,
                      apellido_paterno: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Apellido materno</label>
                <input
                  className={inputClass}
                  value={beneficiaryForm.apellido_materno}
                  onChange={(e) =>
                    setBeneficiaryForm({
                      ...beneficiaryForm,
                      apellido_materno: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Correo</label>
                <input
                  className={inputClass}
                  type="email"
                  value={beneficiaryForm.correo}
                  onChange={(e) =>
                    setBeneficiaryForm({ ...beneficiaryForm, correo: e.target.value })
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Contraseña</label>
                <input
                  className={inputClass}
                  type="password"
                  value={beneficiaryForm.contrasena}
                  onChange={(e) =>
                    setBeneficiaryForm({
                      ...beneficiaryForm,
                      contrasena: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Nivel</label>
                <select
                  className={inputClass}
                  value={beneficiaryForm.nivel}
                  onChange={(e) =>
                    setBeneficiaryForm({ ...beneficiaryForm, nivel: e.target.value })
                  }
                >
                  <option value="">Selecciona nivel</option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Tutor asignado</label>
                <select
                  className={inputClass}
                  value={beneficiaryForm.tutorId}
                  onChange={(e) =>
                    setBeneficiaryForm({ ...beneficiaryForm, tutorId: e.target.value })
                  }
                >
                  <option value="">Selecciona tutor</option>
                  {simpleTutores.map((tutor) => (
                    <option key={tutor.id_tutor} value={tutor.id_tutor}>
                      {tutor.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Estado</label>
                <select
                  className={inputClass}
                  value={beneficiaryForm.estatus}
                  onChange={(e) =>
                    setBeneficiaryForm({
                      ...beneficiaryForm,
                      estatus: e.target.value,
                    })
                  }
                >
                  <option value="Activa">Activa</option>
                  <option value="No activa">No activa</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Matrícula/Folio</label>
                <input
                  className={inputClass}
                  value={beneficiaryForm.matricula_folio}
                  onChange={(e) =>
                    setBeneficiaryForm({
                      ...beneficiaryForm,
                      matricula_folio: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Idioma</label>
                <input
                  className={inputClass}
                  value={beneficiaryForm.idioma}
                  onChange={(e) =>
                    setBeneficiaryForm({
                      ...beneficiaryForm,
                      idioma: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Periodo</label>
                <input
                  className={inputClass}
                  value={beneficiaryForm.periodo}
                  onChange={(e) =>
                    setBeneficiaryForm({
                      ...beneficiaryForm,
                      periodo: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Fecha inicio</label>
                <input
                  className={inputClass}
                  type="date"
                  value={beneficiaryForm.fecha_inicio}
                  onChange={(e) =>
                    setBeneficiaryForm({
                      ...beneficiaryForm,
                      fecha_inicio: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Fecha fin</label>
                <input
                  className={inputClass}
                  type="date"
                  value={beneficiaryForm.fecha_fin}
                  onChange={(e) =>
                    setBeneficiaryForm({
                      ...beneficiaryForm,
                      fecha_fin: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex-1 pr-4">
                {statusMessage && (
                  <span className="text-sm font-medium text-red-600 block">
                    {statusMessage}
                  </span>
                )}
              </div>
              
              <div className="flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setShowBeneficiaryModal(false);
                    resetBeneficiaryForm();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white"
                >
                  Guardar beneficiario
                </button>
              </div>
            </div>
          </form>
        </ModalWrapper>
      )}

      {showTutorModal && (
        <ModalWrapper
          title="Nuevo tutor"
          onClose={() => {
            setShowTutorModal(false);
            resetTutorForm();
          }}
        >
          <form onSubmit={handleCreateTutor} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nombre</label>
                <input
                  className={inputClass}
                  value={tutorForm.nombre}
                  onChange={(e) =>
                    setTutorForm({ ...tutorForm, nombre: e.target.value })
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Apellido paterno</label>
                <input
                  className={inputClass}
                  value={tutorForm.apellido_paterno}
                  onChange={(e) =>
                    setTutorForm({
                      ...tutorForm,
                      apellido_paterno: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Apellido materno</label>
                <input
                  className={inputClass}
                  value={tutorForm.apellido_materno}
                  onChange={(e) =>
                    setTutorForm({
                      ...tutorForm,
                      apellido_materno: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Correo</label>
                <input
                  className={inputClass}
                  type="email"
                  value={tutorForm.correo}
                  onChange={(e) =>
                    setTutorForm({ ...tutorForm, correo: e.target.value })
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Contraseña</label>
                <input
                  className={inputClass}
                  type="password"
                  value={tutorForm.contrasena}
                  onChange={(e) =>
                    setTutorForm({ ...tutorForm, contrasena: e.target.value })
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Idioma</label>
                <input
                  className={inputClass}
                  value={tutorForm.idioma}
                  onChange={(e) =>
                    setTutorForm({ ...tutorForm, idioma: e.target.value })
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Estado</label>
                <select
                  className={inputClass}
                  value={tutorForm.estatus}
                  onChange={(e) =>
                    setTutorForm({ ...tutorForm, estatus: e.target.value })
                  }
                >
                  <option value="Activa">Activa</option>
                  <option value="No activa">No activa</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowTutorModal(false);
                  resetTutorForm();
                }}
                className="px-4 py-2 rounded-xl bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white"
              >
                Guardar tutor
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}
    </div>
  );
}