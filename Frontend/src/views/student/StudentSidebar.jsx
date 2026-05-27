import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  ClipboardList,
  CalendarDays,
  Users,
  LogOut,
} from "lucide-react";

export default function StudentSidebar() {
  const navigate = useNavigate();

  // Mantenemos tu clase dinámica exactamente igual
  const menuClass = ({ isActive }) =>
    `w-full flex items-center gap-3 text-left px-4 py-3 rounded-2xl text-sm border transition ${
      isActive
        ? "bg-blue-600 text-white border-blue-600 font-medium shadow-sm"
        : "bg-white border-transparent hover:bg-slate-50"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    navigate("/");
  };

  return (
    <aside className="w-72 bg-white border-r border-slate-200 p-4 flex flex-col">
      <div className="space-y-2">
        <NavLink to="/estudiante" end className={menuClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>
        <NavLink to="/estudiante/avance" className={menuClass}>
          <GraduationCap size={18} />
          Mi avance
        </NavLink>
        <NavLink to="/estudiante/materiales" className={menuClass}>
          <BookOpen size={18} />
          Material de apoyo
        </NavLink>
        <NavLink to="/estudiante/tareas" className={menuClass}>
          <ClipboardList size={18} />
          Tareas
        </NavLink>
        <NavLink to="/estudiante/clases" className={menuClass}>
          <CalendarDays size={18} />
          Mis clases
        </NavLink>
        <NavLink to="/estudiante/perfil" className={menuClass}>
          <Users size={18} />
          Mi perfil
        </NavLink>
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