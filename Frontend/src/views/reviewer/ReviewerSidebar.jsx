import React from "react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  FolderOpen,
  LogOut,
} from "lucide-react";

export default function ReviewerSidebar({ activeTab, setRevisorModule, onLogout }) {
  const menuClass = (path) => {
    const isActive = activeTab === path || (activeTab === "dashboard" && path === "");
    return `w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all text-left ${
      isActive
        ? "bg-blue-50 text-blue-600 shadow-sm"
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
    }`;
  };

  return (
    <div className="w-72 min-h-screen bg-white border-r border-slate-200 flex flex-col justify-between p-4">
      <div className="space-y-6">
        <div className="p-4 text-2xl font-black tracking-tight text-blue-600 border-b border-slate-100">
          TALK!
        </div>
        <nav className="space-y-1">
          <button onClick={() => setRevisorModule("")} className={menuClass("")}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => setRevisorModule("beneficiarios")} className={menuClass("beneficiarios")}>
            <Users size={18} /> Beneficiarios
          </button>
          <button onClick={() => setRevisorModule("tutores")} className={menuClass("tutores")}>
            <UserCheck size={18} /> Tutores
          </button>
          <button onClick={() => setRevisorModule("bitacoras")} className={menuClass("bitacoras")}>
            <FileText size={18} /> Bitácoras
          </button>
          <button onClick={() => setRevisorModule("reportes")} className={menuClass("reportes")}>
            <FolderOpen size={18} /> Reportes
          </button>
        </nav>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-red-500 hover:bg-red-50 transition-all text-left"
        >
          <LogOut size={18} /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}