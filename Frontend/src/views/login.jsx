import React, { useState } from 'react';
import axios from 'axios';

export default function HomeLogin({ setAppScreen, roleView, setRoleView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        correo: email,
        contrasena: password,
      });

      const { token, rol } = response.data;

      // Save token (optional, for future requests)
      localStorage.setItem('token', token);

      // Redirect based on role
      if (rol === 'tutor') {
        setAppScreen('app');
        setRoleView('tutorview');
      } else if (rol === 'beneficiario') {
        setAppScreen('app');
        setRoleView('studentview');
      } else if (rol === 'socio_formador') {
        setAppScreen('app');
        setRoleView('orgview');
      } else {
        setError('Rol no reconocido');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo iniciar sesión');
    }
  };

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
        <h2 className="text-3xl font-bold mb-2">Iniciar sesión</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-4">
          <input
            className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            placeholder="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="w-full rounded-2xl bg-blue-600 text-white py-3 mt-4 font-medium hover:bg-blue-700 transition"
          >
            Entrar a la plataforma
          </button>
        </div>
      </div>
    </div>
  );
}