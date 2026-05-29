import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, UserCheck, FileText, LogOut } from "lucide-react";

const sidebarItems = [
  ["",              "Dashboard",     LayoutDashboard],
  ["beneficiarios", "Beneficiarios", Users],
  ["tutores",       "Tutores",       UserCheck],
  ["bitacoras",     "Bitácoras",     FileText],
];

export default function ReviewerSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    navigate("/", { replace: true });
  };

  const menuClass = ({ isActive }) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
      isActive
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
          {sidebarItems.map(([key, label, Icon]) => (
            <NavLink
              key={label}
              to={`/revisor${key ? `/${key}` : ""}`}
              end={key === ""}
              className={menuClass}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-red-500 hover:bg-red-50 transition-all text-left"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}