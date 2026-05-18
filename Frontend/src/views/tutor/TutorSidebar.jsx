import React from "react";
import { NavLink, useNavigate } from "react-router-dom"; 
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  FileText,
  Clock3,
  LogOut,
} from "lucide-react";
import "../../styles/tutor/TutorSidebar.css";

const sidebarItems = [
  ["", "Dashboard", LayoutDashboard],
  ["beneficiarios", "Mis alumnos", Users],
  ["materiales", "Materiales", BookOpen],
  ["tareas", "Tareas y evaluación", ClipboardList],
  ["sesiones", "Seguimiento de sesión", FileText],
  ["horas", "Horas acumuladas", Clock3],
];

export default function TutorSidebar() {
  const navigate = useNavigate();

  const menuClass = ({ isActive }) =>
    `w-full flex items-center gap-3 text-left px-4 py-3 rounded-2xl text-sm border transition ${isActive ? "bg-blue-600 text-white border-blue-600 font-medium shadow-sm" : "bg-white border-transparent hover:bg-slate-50"}`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    navigate("/");
  };

  return (
    <aside className="w-72 bg-white border-r border-slate-200 p-4 flex flex-col">
      <div className="space-y-2">
        {sidebarItems.map(([key, label, Icon]) => (
          <NavLink
            key={label}
            to={`/tutor${key ? `/${key}` : ""}`}
            end={key === ""} 
            className={menuClass}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="mt-auto w-full flex items-center gap-3 text-left px-4 py-3 rounded-2xl text-sm border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 transition"
      >
        <LogOut size={18} />
        Cerrar sesión
      </button>
    </aside>
  );
}