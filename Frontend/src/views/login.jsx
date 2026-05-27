import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react"; 

export default function HomeLogin() {
  const navigate = useNavigate();
  
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState(""); 
  const [showPassword, setShowPassword] = useState(false); 

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        correo,
        contrasena
      });
      
      const { token, rol } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("rol", rol);

      if (rol === "tutor") {
        navigate("/tutor");
      } else if (rol === "socio_formador") {
        navigate("/org");
      } else if (rol === "beneficiario") {
        navigate("/estudiante");
      } else if (rol === "revisor" || rol === "reviewer") {
        navigate("/revisor");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error al iniciar sesión", error);
      setError("Usuario o contraseña incorrectos"); 
    }
  };

  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2 gap-8 items-center p-6 lg:p-10">
      {/* Lado Izquierdo: Branding / Inicio */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
        <div className="p-8 relative bg-slate-50 flex-1 flex flex-col items-center justify-center min-h-[300px]">
          <h2 className="text-7xl md:text-8xl font-black tracking-tight text-slate-900">TALK!</h2>
        </div>
        <div className="px-8 py-12 bg-white text-center border-t border-slate-200">
          <h3 className="text-3xl font-semibold text-slate-800">Sobre nosotros</h3>
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="h-[3px] w-[60%] bg-slate-400 rounded-full"></div>
            <div className="h-[3px] w-[55%] bg-slate-400 rounded-full rotate-[-1deg]"></div>
            <div className="h-[3px] w-[50%] bg-slate-400 rounded-full rotate-[-2deg]"></div>
          </div>
        </div>
      </div>

      {/* Lado Derecho: Login */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-10 h-full flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-2">Iniciar sesión</h2>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <div className="space-y-4">
          <input
            className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            placeholder="Correo electrónico"
            type="email"
            value={correo} 
            onChange={(e) => setCorreo(e.target.value)} 
          />
          <div className="relative">
            <input
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 pr-12"
              placeholder="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={contrasena} 
              onChange={(e) => setContrasena(e.target.value)} 
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 hover:text-slate-700"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button
            onClick={handleLoginSubmit} 
            className="w-full rounded-2xl bg-blue-600 text-white py-3 mt-4 font-medium hover:bg-blue-700 transition"
          >
            Entrar a la plataforma
          </button>
        </div>
      </div>
    </div>
  );
}