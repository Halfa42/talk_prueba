import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import SocioSidebar from "./socio/SocioSidebar";
import BeneficiaryModal from "./socio/BeneficiaryModal";
import TutorModal from "./socio/TutorModal";
import AssignmentModal from "./socio/AssignmentModal";
import HoursEvidenceModal from "./socio/HoursEvidenceModal";
import DashboardSection from "./socio/DashboardSection";
import BeneficiariesSection from "./socio/BeneficiariesSection";
import TutorsSection from "./socio/TutorsSection";
import AssignmentsSection from "./socio/AssignmentsSection";
import TrackingSection from "./socio/TrackingSection";
import ReportsSection from "./socio/ReportsSection";
import MaterialsSection from "./socio/MaterialsSection";
import HoursEvidenceSection from "./socio/HoursEvidenceSection";
import { formatInputDate, isActiveStatus } from "./socio/helpers";

export default function OrgView({ onLogout }) {
  const [orgModule, setOrgModule] = useState("dashboard");

  const [beneficiarios, setBeneficiarios] = useState([]);
  const [tutores, setTutores] = useState([]);
  const [simpleTutores, setSimpleTutores] = useState([]);
  const [simpleBeneficiarios, setSimpleBeneficiarios] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [seguimientos, setSeguimientos] = useState([]);
  const [hoursEvidence, setHoursEvidence] = useState([]);

  const [showBeneficiaryModal, setShowBeneficiaryModal] = useState(false);
  const [showTutorModal, setShowTutorModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showHoursEvidenceModal, setShowHoursEvidenceModal] = useState(false);

  const [editingBeneficiary, setEditingBeneficiary] = useState(null);
  const [editingTutor, setEditingTutor] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [editingHoursEvidence, setEditingHoursEvidence] = useState(null);

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
    id_asignacion: "",
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
    idioma: "",
    periodo: "2026-A",
    fecha_inicio: "",
    fecha_fin: "",
    estatus: "Activa",
  });

  const [trackingForm, setTrackingForm] = useState({
    tutorId: "",
    observacion: "",
  });

  const [hoursEvidenceForm, setHoursEvidenceForm] = useState({
    tutorId: "",
    horas: "",
    sesiones: "",
    estado: "Pendiente",
  });

  const [materialForm, setMaterialForm] = useState({
    titulo: "",
    descripcion: "",
  });
  const [selectedMaterialFile, setSelectedMaterialFile] = useState(null);

  const [statusMessage, setStatusMessage] = useState("");

  const materialFileInputRef = useRef(null);

  const softCard = "bg-white rounded-2xl border border-slate-200 shadow-sm";
  const actionButtonClass =
    "px-3 py-1.5 rounded-lg text-xs font-medium transition";
  const editButtonClass =
    actionButtonClass + " bg-amber-100 text-amber-700 hover:bg-amber-200";
  const deleteButtonClass =
    actionButtonClass + " bg-red-100 text-red-600 hover:bg-red-200";
  const inputClass =
    "w-full rounded-xl border border-slate-300 px-4 py-3 bg-white";
  const labelClass = "text-sm font-medium text-slate-600 mb-2 block";

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

  const loadSeguimientos = async () => {
    const response = await axios.get("http://localhost:3000/api/org/seguimiento");
    setSeguimientos(response.data);
  };

  const loadHoursEvidence = async () => {
    const response = await axios.get("http://localhost:3000/api/org/horas-evidencias");
    setHoursEvidence(response.data);
  };

  const loadAllData = async () => {
    try {
      await Promise.all([
        loadBeneficiarios(),
        loadTutores(),
        loadSimpleTutores(),
        loadSimpleBeneficiarios(),
        loadAsignaciones(),
        loadSeguimientos(),
        loadHoursEvidence(),
      ]);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
  if (!statusMessage) return;

  const timer = setTimeout(() => {
    setStatusMessage("");
  }, 3000);

  return () => clearTimeout(timer);
}, [statusMessage]);

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
      id_asignacion: "",
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
      idioma: "",
      periodo: "2026-A",
      fecha_inicio: "",
      fecha_fin: "",
      estatus: "Activa",
    });
  };

  const resetTrackingForm = () => {
    setTrackingForm({
      tutorId: "",
      observacion: "",
    });
  };

  const resetHoursEvidenceForm = () => {
    setHoursEvidenceForm({
      tutorId: "",
      horas: "",
      sesiones: "",
      estado: "Pendiente",
    });
  };

  const openCreateBeneficiaryModal = () => {
    setEditingBeneficiary(null);
    resetBeneficiaryForm();
    setShowBeneficiaryModal(true);
  };

  const openEditBeneficiaryModal = (beneficiario) => {
    setEditingBeneficiary(beneficiario.id_beneficiario);
    setBeneficiaryForm({
      nombre: beneficiario.nombre || "",
      apellido_paterno: beneficiario.apellido_paterno || "",
      apellido_materno: beneficiario.apellido_materno || "",
      correo: beneficiario.correo || "",
      contrasena: "",
      nivel: beneficiario.nivel || "",
      estatus: isActiveStatus(beneficiario.estatus) ? "Activa" : "No activa",
      tutorId: beneficiario.id_tutor ? String(beneficiario.id_tutor) : "",
      matricula_folio: beneficiario.matricula_folio || "",
      idioma: beneficiario.idioma || "",
      periodo: beneficiario.periodo || "2026-A",
      fecha_inicio: formatInputDate(beneficiario.fecha_inicio),
      fecha_fin: formatInputDate(beneficiario.fecha_fin),
      id_asignacion: beneficiario.id_asignacion || "",
    });
    setShowBeneficiaryModal(true);
  };

  const openCreateTutorModal = () => {
    setEditingTutor(null);
    resetTutorForm();
    setShowTutorModal(true);
  };

  const openEditTutorModal = (tutor) => {
    setEditingTutor(tutor.id_tutor);
    setTutorForm({
      nombre: tutor.nombre || "",
      apellido_paterno: tutor.apellido_paterno || "",
      apellido_materno: tutor.apellido_materno || "",
      correo: tutor.correo || "",
      contrasena: "",
      idioma: tutor.idioma || "",
      estatus: isActiveStatus(tutor.estatus) ? "Activa" : "No activa",
    });
    setShowTutorModal(true);
  };

  const openEditAssignmentModal = (assignment) => {
    setEditingAssignment(assignment.id_asignacion);
    setAssignmentForm({
      tutorId: assignment.id_tutor ? String(assignment.id_tutor) : "",
      beneficiarioId: assignment.id_beneficiario
        ? String(assignment.id_beneficiario)
        : "",
      idioma: assignment.idioma || "",
      periodo: assignment.periodo || "2026-A",
      fecha_inicio: formatInputDate(assignment.fecha_inicio),
      fecha_fin: formatInputDate(assignment.fecha_fin),
      estatus: assignment.estatus || "Activa",
    });
    setShowAssignmentModal(true);
  };

  const openCreateHoursEvidenceModal = () => {
    setEditingHoursEvidence(null);
    resetHoursEvidenceForm();
    setShowHoursEvidenceModal(true);
  };

  const openEditHoursEvidenceModal = (record) => {
    setEditingHoursEvidence(record.id_registro);
    setHoursEvidenceForm({
      tutorId: record.id_tutor ? String(record.id_tutor) : "",
      horas: record.horas ?? "",
      sesiones: record.sesiones ?? "",
      estado: record.estado || "Pendiente",
    });
    setShowHoursEvidenceModal(true);
  };

  const closeBeneficiaryModal = () => {
    setShowBeneficiaryModal(false);
    setEditingBeneficiary(null);
    resetBeneficiaryForm();
  };

  const closeTutorModal = () => {
    setShowTutorModal(false);
    setEditingTutor(null);
    resetTutorForm();
  };

  const closeAssignmentModal = () => {
    setShowAssignmentModal(false);
    setEditingAssignment(null);
    resetAssignmentForm();
  };

  const closeHoursEvidenceModal = () => {
    setShowHoursEvidenceModal(false);
    setEditingHoursEvidence(null);
    resetHoursEvidenceForm();
  };

  const handleCreateBeneficiary = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    try {
      await axios.post("http://localhost:3000/api/org/beneficiarios", beneficiaryForm);
      await loadAllData();
      closeBeneficiaryModal();
      setStatusMessage("✅ Beneficiario agregado correctamente.");
    } catch (error) {
      setStatusMessage(
        `❌ ${error.response?.data?.message || "No se pudo agregar el beneficiario."}`
      );
    }
  };

  const handleUpdateBeneficiary = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    try {
      await axios.put(
        `http://localhost:3000/api/org/beneficiarios/${editingBeneficiary}`,
        beneficiaryForm
      );
      await loadAllData();
      closeBeneficiaryModal();
      setStatusMessage("✅ Beneficiario actualizado correctamente.");
    } catch (error) {
      setStatusMessage(
        `❌ ${error.response?.data?.message || "No se pudo actualizar el beneficiario."}`
      );
    }
  };

  const handleCreateTutor = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    try {
      await axios.post("http://localhost:3000/api/org/tutores", tutorForm);
      await loadAllData();
      closeTutorModal();
      setStatusMessage("✅ Tutor agregado correctamente.");
    } catch (error) {
      setStatusMessage(
        `❌ ${error.response?.data?.message || "No se pudo agregar el tutor."}`
      );
    }
  };

  const handleUpdateTutor = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    try {
      await axios.put(
        `http://localhost:3000/api/org/tutores/${editingTutor}`,
        tutorForm
      );
      await loadAllData();
      closeTutorModal();
      setStatusMessage("✅ Tutor actualizado correctamente.");
    } catch (error) {
      setStatusMessage(
        `❌ ${error.response?.data?.message || "No se pudo actualizar el tutor."}`
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

  const handleUpdateAssignment = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    try {
      await axios.put(
        `http://localhost:3000/api/org/asignaciones/${editingAssignment}`,
        assignmentForm
      );
      await loadAllData();
      closeAssignmentModal();
      setStatusMessage("✅ Asignación actualizada correctamente.");
    } catch (error) {
      setStatusMessage(
        `❌ ${error.response?.data?.message || "No se pudo actualizar la asignación."}`
      );
    }
  };

  const handleSaveTracking = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    try {
      await axios.post("http://localhost:3000/api/org/seguimiento", trackingForm);
      await loadSeguimientos();
      resetTrackingForm();
      setStatusMessage("✅ Observación guardada correctamente.");
    } catch (error) {
      setStatusMessage(
        `❌ ${error.response?.data?.message || "No se pudo guardar la observación."}`
      );
    }
  };

  const handleCreateHoursEvidence = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    try {
      await axios.post(
        "http://localhost:3000/api/org/horas-evidencias",
        hoursEvidenceForm
      );
      await loadHoursEvidence();
      closeHoursEvidenceModal();
      setStatusMessage("✅ Registro creado correctamente.");
    } catch (error) {
      setStatusMessage(
        `❌ ${error.response?.data?.message || "No se pudo crear el registro."}`
      );
    }
  };

  const handleUpdateHoursEvidence = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    try {
      await axios.put(
        `http://localhost:3000/api/org/horas-evidencias/${editingHoursEvidence}`,
        hoursEvidenceForm
      );
      await loadHoursEvidence();
      closeHoursEvidenceModal();
      setStatusMessage("✅ Registro actualizado correctamente.");
    } catch (error) {
      setStatusMessage(
        `❌ ${error.response?.data?.message || "No se pudo actualizar el registro."}`
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

  const handleDeleteHoursEvidence = async (id) => {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar este registro?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:3000/api/org/horas-evidencias/${id}`);
      await loadHoursEvidence();
      setStatusMessage("✅ Registro eliminado correctamente.");
    } catch (error) {
      setStatusMessage(
        `❌ ${error.response?.data?.message || "No se pudo eliminar el registro."}`
      );
    }
  };

  const handleSaveMaterial = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    if (!selectedMaterialFile) {
      setStatusMessage("❌ Selecciona un archivo antes de guardar el material.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("titulo", materialForm.titulo);
      formData.append("descripcion", materialForm.descripcion);
      formData.append("archivo", selectedMaterialFile);

      await axios.post("http://localhost:3000/api/org/materiales", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMaterialForm({
        titulo: "",
        descripcion: "",
      });
      setSelectedMaterialFile(null);

      if (materialFileInputRef.current) {
        materialFileInputRef.current.value = "";
      }

      setStatusMessage("✅ Material guardado correctamente.");
    } catch (error) {
      setStatusMessage(
        `❌ ${error.response?.data?.message || "No se pudo guardar el material."}`
      );
    }
  };

  const renderContent = () => {
    if (orgModule === "dashboard") {
      return (
        <DashboardSection
          beneficiarios={beneficiarios}
          tutores={tutores}
          asignaciones={asignaciones}
          softCard={softCard}
          setOrgModule={setOrgModule}
        />
      );
    }

    if (orgModule === "beneficiaries") {
      return (
        <BeneficiariesSection
          beneficiarios={beneficiarios}
          softCard={softCard}
          editButtonClass={editButtonClass}
          deleteButtonClass={deleteButtonClass}
          onCreate={openCreateBeneficiaryModal}
          onEdit={openEditBeneficiaryModal}
          onDelete={handleDeleteBeneficiary}
        />
      );
    }

    if (orgModule === "tutors") {
      return (
        <TutorsSection
          tutores={tutores}
          softCard={softCard}
          editButtonClass={editButtonClass}
          deleteButtonClass={deleteButtonClass}
          onCreate={openCreateTutorModal}
          onEdit={openEditTutorModal}
          onDelete={handleDeleteTutor}
        />
      );
    }

    if (orgModule === "assignment") {
      return (
        <AssignmentsSection
          softCard={softCard}
          inputClass={inputClass}
          labelClass={labelClass}
          assignmentForm={assignmentForm}
          setAssignmentForm={setAssignmentForm}
          simpleTutores={simpleTutores}
          simpleBeneficiarios={simpleBeneficiarios}
          asignaciones={asignaciones}
          editButtonClass={editButtonClass}
          deleteButtonClass={deleteButtonClass}
          onSubmit={handleCreateAssignment}
          onDelete={handleDeleteAssignment}
          onEdit={openEditAssignmentModal}
        />
      );
    }

    if (orgModule === "tracking") {
      return (
        <TrackingSection
          softCard={softCard}
          seguimientos={seguimientos}
          simpleTutores={simpleTutores}
          trackingForm={trackingForm}
          setTrackingForm={setTrackingForm}
          onSubmit={handleSaveTracking}
        />
      );
    }

    if (orgModule === "logs") {
      return (
        <HoursEvidenceSection
          softCard={softCard}
          hoursEvidence={hoursEvidence}
          editButtonClass={editButtonClass}
          deleteButtonClass={deleteButtonClass}
          onCreate={openCreateHoursEvidenceModal}
          onEdit={openEditHoursEvidenceModal}
          onDelete={handleDeleteHoursEvidence}
        />
      );
    }

    if (orgModule === "reports") {
      return (
        <ReportsSection
          softCard={softCard}
          setStatusMessage={setStatusMessage}
        />
      );
    }

    if (orgModule === "materials") {
      return (
        <MaterialsSection
          softCard={softCard}
          inputClass={inputClass}
          materialForm={materialForm}
          setMaterialForm={setMaterialForm}
          selectedMaterialFile={selectedMaterialFile}
          materialFileInputRef={materialFileInputRef}
          setSelectedMaterialFile={setSelectedMaterialFile}
          onSubmit={handleSaveMaterial}
        />
      );
    }

    return null;
  };

  return (
    <div className="flex min-h-[760px] bg-slate-50">
      <SocioSidebar
        orgModule={orgModule}
        setOrgModule={setOrgModule}
        onLogout={onLogout}
      />

      <main className="flex-1 p-6 space-y-6">
        {statusMessage && (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
            {statusMessage}
          </div>
        )}

        {renderContent()}
      </main>

      <BeneficiaryModal
        open={showBeneficiaryModal}
        editingBeneficiary={editingBeneficiary}
        beneficiaryForm={beneficiaryForm}
        setBeneficiaryForm={setBeneficiaryForm}
        simpleTutores={simpleTutores}
        onClose={closeBeneficiaryModal}
        onSubmit={
          editingBeneficiary ? handleUpdateBeneficiary : handleCreateBeneficiary
        }
      />

      <TutorModal
        open={showTutorModal}
        editingTutor={editingTutor}
        tutorForm={tutorForm}
        setTutorForm={setTutorForm}
        onClose={closeTutorModal}
        onSubmit={editingTutor ? handleUpdateTutor : handleCreateTutor}
      />

      <AssignmentModal
        open={showAssignmentModal}
        assignmentForm={assignmentForm}
        setAssignmentForm={setAssignmentForm}
        simpleTutores={simpleTutores}
        simpleBeneficiarios={simpleBeneficiarios}
        onClose={closeAssignmentModal}
        onSubmit={handleUpdateAssignment}
      />

      <HoursEvidenceModal
        open={showHoursEvidenceModal}
        editingHoursEvidence={editingHoursEvidence}
        hoursEvidenceForm={hoursEvidenceForm}
        setHoursEvidenceForm={setHoursEvidenceForm}
        simpleTutores={simpleTutores}
        onClose={closeHoursEvidenceModal}
        onSubmit={
          editingHoursEvidence
            ? handleUpdateHoursEvidence
            : handleCreateHoursEvidence
        }
      />
    </div>
  );
}