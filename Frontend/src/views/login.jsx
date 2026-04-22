import React from 'react';

export default function HomeLogin({ setAppScreen, roleView, setRoleView }) {
  return (
    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center min-h-[75vh] mt-8">
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
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl">T</div>
          <div>
            <div className="font-semibold text-xl">TALK! Learning Platform</div>
            <div className="text-sm text-slate-500">Access portal</div>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-2">Iniciar sesión</h2>
        <p className="text-slate-500 mb-8">Ingresa con tus credenciales para acceder a la plataforma según tu rol.</p>
        
        <div className="space-y-4">
          <input className="w-full rounded-2xl border border-slate-300 px-4 py-3" placeholder="Correo electrónico" type="email" />
          <input className="w-full rounded-2xl border border-slate-300 px-4 py-3" placeholder="Contraseña" type="password" />
          
          <div className="pt-2">
            <label className="text-sm font-medium text-slate-700 mb-1 block">Selecciona tu rol (Prueba):</label>
            <select 
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 bg-white" 
              value={roleView} 
              onChange={(e) => setRoleView(e.target.value)}
            >
              <option value="org">Organización</option>
              <option value="tutor">TutorTEC</option>
              <option value="student">Beneficiario</option>
            </select>
          </div>

          <button 
            onClick={() => setAppScreen("app")} 
            className="w-full rounded-2xl bg-blue-600 text-white py-3 mt-4 font-medium hover:bg-blue-700 transition"
          >
            Entrar a la plataforma
          </button>
        </div>
      </div>
    </div>
  );
}