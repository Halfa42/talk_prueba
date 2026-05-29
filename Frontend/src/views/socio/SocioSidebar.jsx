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
    navigate("/", { replace: true });
  };

  const menuClass = (active) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all text-left ${
      active
        ? "bg-blue-50 text-blue-600 shadow-sm"
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
    }`;

  return (
    <div className="w-72 min-h-screen bg-white border-r border-slate-200 flex flex-col justify-between p-4">
      <div className="space-y-6">
        <div className="p-4 text-2xl font-black tracking-tight text-blue-600 border-b">
          TALK!
        </div>
        <nav className="space-y-1">
          <button onClick={() => setOrgModule("dashboard")} className={menuClass(orgModule === "dashboard")}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => setOrgModule("beneficiaries")} className={menuClass(orgModule === "beneficiaries")}>
            <GraduationCap size={18} /> Beneficiarios
          </button>
          <button onClick={() => setOrgModule("tutors")} className={menuClass(orgModule === "tutors")}>
            <Users size={18} /> Tutores
          </button>
          <button onClick={() => setOrgModule("assignment")} className={menuClass(orgModule === "assignment")}>
            <CalendarDays size={18} /> Asignaciones
          </button>
          <button onClick={() => setOrgModule("tracking")} className={menuClass(orgModule === "tracking")}>
            <ClipboardList size={18} /> Seguimiento
          </button>
          <button onClick={() => setOrgModule("logs")} className={menuClass(orgModule === "logs")}>
            <FileText size={18} /> Horas y evidencias
          </button>
          <button onClick={() => setOrgModule("reports")} className={menuClass(orgModule === "reports")}>
            <FolderOpen size={18} /> Reportes
          </button>
          <button onClick={() => setOrgModule("materials")} className={menuClass(orgModule === "materials")}>
            <BookOpen size={18} /> Material institucional
          </button>
        </nav>
      </div>

      <div className="border-t pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-red-500 hover:bg-red-50 transition-all text-left"
        >
          <LogOut size={18} /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}