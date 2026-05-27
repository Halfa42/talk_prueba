import React from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

export default function SocioSidebar({ orgModule, setOrgModule }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const menuClass = (active) =>
    `w-full flex items-center gap-3 text-left px-4 py-3 rounded-2xl text-sm border transition ${
      active
        ? "bg-blue-600 text-white border-blue-600 font-medium shadow-sm"
        : "bg-white border-transparent hover:bg-slate-50"
    }`;

  return (
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
        onClick={handleLogout}
        className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-2xl text-sm border border-red-200 text-red-600 hover:bg-red-50 transition"
      >
        <LogOut size={18} /> Cerrar sesión
      </button>
    </aside>
  );
}