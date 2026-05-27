import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, UserCheck, FileText, LogOut } from "lucide-react";
import "../../styles/reviewer/ReviewerSidebar.css";

const sidebarItems = [
  ["",              "Dashboard",     LayoutDashboard],
  ["beneficiarios", "Beneficiarios", Users],
  ["tutores",       "Tutores",       UserCheck],
  ["bitacoras",     "Bitácoras",     FileText],
];

export default function ReviewerSidebar() {
  const navigate = useNavigate();

  const menuClass = ({ isActive }) =>
    `sidebar-link${isActive ? " sidebar-link-active" : ""}`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
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

      <button
        type="button"
        className="sidebar-logout"
        onClick={handleLogout}
      >
        <LogOut size={18} />
        Cerrar sesión
      </button>
    </aside>
  );
}