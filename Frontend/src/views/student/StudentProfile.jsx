import React, { useState, useEffect } from "react";
import axios from "axios";

export default function StudentProfile({ softCard }) {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : {};
  const usuarioId = user.id_usuario;

  const [profileData, setProfileData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    programa: "",
    nivel: "",
    tutor_nombre: "",
    tutor_apellido: "",
    tutor_materno: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    matricula: "",
    nueva_contrasena: "",
    verificar_contrasena: "",
  });
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (usuarioId) {
      fetch(`http://localhost:3000/api/student-profile/${usuarioId}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.message) {
            setProfileData(data);
          }
        })
        .catch((err) => console.error("Error cargando perfil:", err));
    }
  }, [usuarioId]);

  const handleChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async () => {
    setMsg(null);

    if (!passwordForm.matricula || !passwordForm.nueva_contrasena || !passwordForm.verificar_contrasena) {
      setMsg({ tipo: "error", texto: "Todos los campos son obligatorios" });
      return;
    }

    if (passwordForm.nueva_contrasena !== passwordForm.verificar_contrasena) {
      setMsg({ tipo: "error", texto: "Las contraseñas no coinciden" });
      return;
    }

    if (passwordForm.nueva_contrasena.length < 6) {
      setMsg({ tipo: "error", texto: "La contraseña debe tener al menos 6 caracteres" });
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3000/api/student-profile/${usuarioId}/change-password`, {
        matricula: passwordForm.matricula,
        nueva_contrasena: passwordForm.nueva_contrasena,
      });

      setMsg({ tipo: "ok", texto: response.data.message });
      
      setTimeout(() => {
        setIsModalOpen(false);
        setPasswordForm({ matricula: "", nueva_contrasena: "", verificar_contrasena: "" });
        setMsg(null);
      }, 2000);

    } catch (error) {
      setMsg({ tipo: "error", texto: error.response?.data?.message || "Error al cambiar la contraseña" });
    }
  };

  return (
    <div className="space-y-6 relative">
      <div>
        <h2 className="text-2xl font-bold">Mi perfil</h2>
        <p className="text-sm text-slate-500">Información personal y académica básica.</p>
      </div>
      
      <div className="grid xl:grid-cols-2 gap-6">
        <div className={softCard + " p-6 flex flex-col justify-between"}>
          <div>
            <h3 className="font-semibold text-lg mb-4 text-slate-800 border-b pb-2 border-slate-100">Datos Académicos</h3>
            <div className="space-y-4 text-sm mt-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-600">Nombre completo</span>
                <span className="text-slate-900 font-semibold">
                  {profileData.nombre} {profileData.apellido_paterno} {profileData.apellido_materno || ""}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-600">Programa</span>
                <span className="text-slate-900 font-semibold capitalize">{profileData.programa || "No asignado"}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-600">Nivel</span>
                <span className="text-slate-900 font-semibold">{profileData.nivel || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-600">Tutor asignado</span>
                <span className="text-slate-900 font-semibold">
                  {profileData.tutor_nombre 
                    ? `${profileData.tutor_nombre} ${profileData.tutor_apellido} ${profileData.tutor_materno || ""}`.trim() 
                    : "Sin asignar"}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
             <button 
               onClick={() => setIsModalOpen(true)}
               className="px-5 py-2.5 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-900 transition shadow-sm text-sm"
             >
               Cambiar contraseña
             </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Actualizar Contraseña</h3>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setMsg(null);
                  setPasswordForm({ matricula: "", nueva_contrasena: "", verificar_contrasena: "" });
                }} 
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-500 mb-4">
                Por seguridad, debes ingresar tu matrícula o folio asignado para verificar tu identidad antes de cambiar la contraseña.
              </p>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Matrícula / Folio</label>
                <input
                  type="text"
                  name="matricula"
                  value={passwordForm.matricula}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  placeholder="Ej. MAT-0001"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nueva Contraseña</label>
                <input
                  type="password"
                  name="nueva_contrasena"
                  value={passwordForm.nueva_contrasena}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Verificar Contraseña</label>
                <input
                  type="password"
                  name="verificar_contrasena"
                  value={passwordForm.verificar_contrasena}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  placeholder="••••••••"
                />
              </div>

              {msg && (
                <div className={`p-3 mt-4 rounded-xl text-sm font-medium ${msg.tipo === "ok" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
                  {msg.texto}
                </div>
              )}

              <button
                onClick={handleChangePassword}
                className="w-full px-4 py-3 mt-4 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-sm"
              >
                Guardar nueva contraseña
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}