import { useState } from "react";
import { Bell, BookOpen, CalendarDays, ClipboardList, FileText, GraduationCap, LayoutDashboard, Search, Upload, Users, Clock3, FolderOpen, CheckCircle2 } from "lucide-react";

export default function TalkFullMockup() {
  const [appScreen, setAppScreen] = useState("landing");
  const [roleView, setRoleView] = useState("tutor");
  const [tutorModule, setTutorModule] = useState("dashboard");
  const [orgModule, setOrgModule] = useState("dashboard");
  const [studentModule, setStudentModule] = useState("dashboard");
  const [sessionTab, setSessionTab] = useState("registro");
  const [selectedStudent, setSelectedStudent] = useState({
    name: "María López",
    level: "Nivel A2",
    program: "Inglés",
    status: "Activo",
    attendance: "92%",
    diagnostic: "A1",
    current: "A2",
  });

  const shell = "min-h-screen bg-slate-100 text-slate-800 p-6";
  const card = "bg-white rounded-3xl shadow-sm border border-slate-200";
  const softCard = "bg-white rounded-2xl border border-slate-200 shadow-sm";
  const sidebar = "w-72 bg-white border-r border-slate-200 p-4 space-y-2";
  const contentWrap = "flex-1 p-6 space-y-6";

  const menuClass = (active) =>
    `w-full flex items-center gap-3 text-left px-4 py-3 rounded-2xl text-sm border transition ${active ? "bg-blue-600 text-white border-blue-600 font-medium shadow-sm" : "bg-white border-transparent hover:bg-slate-50"}`;

  const topSelector = (active) =>
    `px-4 py-2 rounded-2xl text-sm border transition ${active ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`;

  const tabClass = (active) =>
    `px-4 py-2 rounded-xl text-sm border transition ${active ? "bg-blue-600 text-white border-blue-600" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`;

  const KpiCard = ({ title, value, hint }) => (
    <div className={softCard + " p-4"}>
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
      <div className="text-xs text-slate-500 mt-2">{hint}</div>
    </div>
  );

  const LandingScreen = () => (
    <div className={card + " overflow-hidden"}>
      <div className="bg-white p-6 md:p-8">
        <div className="rounded-[2rem] border-2 border-slate-300 min-h-[720px] overflow-hidden">
          <div className="p-2 border-b border-slate-200">
            <div className="rounded-[1.8rem] border-2 border-slate-300 min-h-[360px] px-8 py-8 relative bg-slate-50 flex items-center justify-center">
              <div className="absolute top-8 right-8 flex gap-3">
                <button
                  onClick={() => setAppScreen("register")}
                  className="px-5 py-2 rounded-xl border-2 border-slate-400 bg-white text-slate-700 text-sm font-medium"
                >
                  Regístrate
                </button>
                <button
                  onClick={() => setAppScreen("login")}
                  className="px-5 py-2 rounded-xl border-2 border-slate-400 bg-white text-slate-700 text-sm font-medium"
                >
                  Acceso
                </button>
              </div>

              <div className="text-center">
                <h2 className="text-7xl md:text-8xl font-black tracking-tight text-slate-900">TALK!</h2>
              </div>
            </div>
          </div>

          <div className="px-8 md:px-16 py-12 md:py-14 bg-white">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-4xl font-semibold text-slate-800">Sobre nosotros</h3>
              <div className="mt-10 space-y-8 flex flex-col items-center">
                <div className="h-[3px] w-[75%] bg-slate-500 rounded-full"></div>
                <div className="h-[3px] w-[72%] bg-slate-500 rounded-full rotate-[-1deg]"></div>
                <div className="h-[3px] w-[65%] bg-slate-500 rounded-full rotate-[-2deg]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AuthScreen = ({ mode }) => (
    <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6 items-stretch">
      <div className={card + " p-10 flex flex-col justify-between"}>
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl">T</div>
            <div><div className="font-semibold text-xl">TALK! Learning Platform</div><div className="text-sm text-slate-500">Access portal</div></div>
          </div>
          <h2 className="text-3xl font-bold">{mode === "login" ? "Iniciar sesión" : "Registro de acceso"}</h2>
          <p className="text-slate-500 mt-3">{mode === "login" ? "Ingresa con tus credenciales para acceder a la plataforma según tu rol." : "Completa tus datos para crear una cuenta de acceso dentro de la demo."}</p>
        </div>
        <div className="mt-8 text-sm text-slate-500">Roles disponibles: Organización, TutorTEC y Beneficiario.</div>
      </div>
      <div className={card + " p-10"}>
        <div className="space-y-4">
          {mode === "register" && <input className="w-full rounded-2xl border border-slate-300 px-4 py-3" placeholder="Nombre completo" />}
          <input className="w-full rounded-2xl border border-slate-300 px-4 py-3" placeholder="Correo electrónico" />
          <input className="w-full rounded-2xl border border-slate-300 px-4 py-3" placeholder="Contraseña" type="password" />
          <select className="w-full rounded-2xl border border-slate-300 px-4 py-3 bg-white" value={roleView} onChange={(e) => setRoleView(e.target.value)}>
            <option value="org">Organización</option>
            <option value="tutor">TutorTEC</option>
            <option value="student">Beneficiario</option>
          </select>
          {mode === "register" && <input className="w-full rounded-2xl border border-slate-300 px-4 py-3" placeholder="Confirmar contraseña" type="password" />}
          <button onClick={() => setAppScreen("app")} className="w-full rounded-2xl bg-blue-600 text-white py-3 font-medium">{mode === "login" ? "Entrar a la plataforma" : "Crear cuenta y entrar"}</button>
          <button onClick={() => setAppScreen("landing")} className="w-full rounded-2xl bg-slate-100 py-3">Volver al inicio</button>
        </div>
      </div>
    </div>
  );

  const AppHeader = () => null;

  const TutorDashboard = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <KpiCard title="Alumnos asignados" value="8" hint="2 con seguimiento prioritario" />
        <KpiCard title="Sesiones esta semana" value="11" hint="3 pendientes de registrar" />
        <KpiCard title="Tareas por revisar" value="6" hint="4 vencen hoy" />
        <KpiCard title="Horas acumuladas" value="47.5 h" hint="41 h ya validadas" />
      </div>
      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className={softCard + " p-5"}>
            <div className="flex items-center justify-between mb-4">
              <div><h2 className="text-xl font-semibold">Panel operativo</h2><p className="text-sm text-slate-500">Accesos rápidos para continuar con tus actividades del día.</p></div>
              <button onClick={() => setTutorModule("session")} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm">Nueva sesión</button>
            </div>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <button onClick={() => setTutorModule("students")} className="p-4 rounded-2xl border bg-slate-50 text-left"><Users className="mb-3" size={18} /><div className="font-medium">Mis alumnos</div><div className="text-slate-500 mt-1">Consulta perfiles y avance.</div></button>
              <button onClick={() => setTutorModule("materials")} className="p-4 rounded-2xl border bg-slate-50 text-left"><FolderOpen className="mb-3" size={18} /><div className="font-medium">Materiales</div><div className="text-slate-500 mt-1">Sube recursos por tema.</div></button>
              <button onClick={() => setTutorModule("tasks")} className="p-4 rounded-2xl border bg-slate-50 text-left"><ClipboardList className="mb-3" size={18} /><div className="font-medium">Tareas</div><div className="text-slate-500 mt-1">Asigna y revisa entregas.</div></button>
              <button onClick={() => setTutorModule("hours")} className="p-4 rounded-2xl border bg-slate-50 text-left"><Clock3 className="mb-3" size={18} /><div className="font-medium">Horas</div><div className="text-slate-500 mt-1">Consulta horas registradas.</div></button>
            </div>
          </div>
          <div className={softCard + " p-5"}>
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-lg">Próximas sesiones</h3><button className="text-sm text-blue-600">Ver calendario</button></div>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="text-left p-3">Alumno</th><th className="text-left p-3">Tema</th><th className="text-left p-3">Horario</th><th className="text-left p-3">Estado</th></tr></thead><tbody>{[["María López","Speaking practice","10:00 - 11:00","Confirmada"],["Carlos Vega","Vocabulary review","12:00 - 13:00","Pendiente"],["Fernanda Gil","Reading comprehension","16:00 - 17:00","Confirmada"]].map((row,i)=><tr key={i} className="border-t border-slate-200 bg-white">{row.map((cell)=><td key={cell} className="p-3">{cell}</td>)}</tr>)}</tbody></table>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className={softCard + " p-5"}><h3 className="font-semibold text-lg mb-4">Pendientes</h3><div className="space-y-3 text-sm"><div className="p-3 rounded-xl bg-amber-50 border border-amber-200">3 sesiones aún no tienen bitácora.</div><div className="p-3 rounded-xl bg-red-50 border border-red-200">2 entregas requieren calificación hoy.</div><div className="p-3 rounded-xl bg-blue-50 border border-blue-200">5 materiales nuevos fueron compartidos por organización.</div></div></div>
          <div className={softCard + " p-5"}><h3 className="font-semibold text-lg mb-4">Actividad reciente</h3><div className="space-y-3 text-sm text-slate-600"><div className="flex gap-3"><CheckCircle2 size={16} className="mt-0.5 text-green-600" />Se validó la sesión de María López.</div><div className="flex gap-3"><Upload size={16} className="mt-0.5 text-blue-600" />Subiste material de listening A2.</div><div className="flex gap-3"><FileText size={16} className="mt-0.5 text-slate-600" />Registraste bitácora de Carlos Vega.</div></div></div>
        </div>
      </div>
    </div>
  );

  const TutorStudents = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold">Mis alumnos</h2><p className="text-sm text-slate-500">Consulta información general, progreso y accesos rápidos por beneficiario.</p></div><button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm">Exportar lista</button></div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[["María López","Nivel A2","Buen avance"],["Carlos Vega","Nivel A1","Requiere seguimiento"],["Fernanda Gil","Nivel B1","Entrega constante"],["Diego Lara","Nivel A2","Asistencia regular"],["Sofía Cruz","Nivel A1","Material pendiente"],["Luis Peña","Nivel A2","Sesión programada"]].map(([name, level, status]) => (
          <div key={name} className={softCard + " p-5"}>
            <div className="flex items-start justify-between"><div><div className="font-semibold text-lg">{name}</div><div className="text-sm text-slate-500 mt-1">{level}</div></div><div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">{name[0]}</div></div>
            <div className="mt-4 inline-block text-sm px-3 py-2 rounded-xl bg-slate-100">{status}</div>
            <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
              <button onClick={() => { setSelectedStudent({ name, level, program: "Inglés", status: status.includes("seguimiento") ? "Seguimiento" : "Activo", attendance: name === "Carlos Vega" ? "78%" : "92%", diagnostic: level.includes("A1") ? "A1" : "A2", current: level.replace("Nivel ", "") }); setTutorModule("session"); setSessionTab("registro"); }} className="px-3 py-2 rounded-xl bg-blue-600 text-white">Ver ficha</button>
              <button onClick={() => { setSelectedStudent({ name, level, program: "Inglés", status: status.includes("seguimiento") ? "Seguimiento" : "Activo", attendance: name === "Carlos Vega" ? "78%" : "92%", diagnostic: level.includes("A1") ? "A1" : "A2", current: level.replace("Nivel ", "") }); setTutorModule("session"); }} className="px-3 py-2 rounded-xl bg-slate-100">Abrir sesión</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TutorMaterials = () => (
    <div className="space-y-6"><div><h2 className="text-2xl font-bold">Material para beneficiario</h2><p className="text-sm text-slate-500">Carga recursos por tema, nivel y alumno.</p></div><div className="grid xl:grid-cols-3 gap-6"><div className="xl:col-span-2 space-y-6"><div className={softCard + " p-5"}><h3 className="font-semibold text-lg mb-4">Nuevo material</h3><div className="grid md:grid-cols-2 gap-4"><input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Título del material" /><input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Tema" /><input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Nivel" /><select className="rounded-xl border border-slate-300 px-4 py-3 bg-white"><option>Asignar a beneficiario</option></select></div><textarea className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3" rows="4" placeholder="Descripción del recurso" /><div className="mt-4 flex gap-3"><button className="px-4 py-2 rounded-xl bg-blue-600 text-white">Subir archivo</button><button className="px-4 py-2 rounded-xl bg-slate-100">Guardar material</button></div></div></div><div className={softCard + " p-5"}><h3 className="font-semibold text-lg mb-4">Recientes</h3><div className="space-y-3 text-sm"><div className="p-3 rounded-xl bg-slate-50 border">Tema 1 — Presentaciones</div><div className="p-3 rounded-xl bg-slate-50 border">Tema 2 — Rutinas diarias</div><div className="p-3 rounded-xl bg-slate-50 border">Listening practice A2</div></div></div></div></div>
  );

  const TutorTasks = () => (
    <div className="space-y-6"><div><h2 className="text-2xl font-bold">Tareas y evaluación</h2><p className="text-sm text-slate-500">Publica actividades y revisa entregas con retroalimentación.</p></div><div className="grid xl:grid-cols-2 gap-6"><div className={softCard + " p-5"}><h3 className="font-semibold text-lg mb-4">Asignar tarea</h3><input className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3" placeholder="Título de la tarea" /><textarea className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3" rows="4" placeholder="Instrucciones" /><div className="grid md:grid-cols-2 gap-3"><input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Beneficiario" /><input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Fecha límite" /></div><button className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white">Publicar tarea</button></div><div className={softCard + " p-5"}><h3 className="font-semibold text-lg mb-4">Entregas por revisar</h3><div className="space-y-3">{["Vocabulary worksheet — María López","Reading practice — Carlos Vega","Listening exercise — Sofía Cruz"].map((item) => <div key={item} className="p-3 rounded-xl bg-slate-50 border flex items-center justify-between text-sm"><span>{item}</span><button className="px-3 py-2 rounded-xl bg-white border">Calificar</button></div>)}</div></div></div></div>
  );

  const SessionTabs = () => (
    <div className="flex flex-wrap gap-2">{[["registro","Registro"],["bitacora","Bitácora"],["evidencias","Evidencias"],["tareas","Tareas"],["materiales","Materiales"]].map(([key, label]) => <button key={key} onClick={() => setSessionTab(key)} className={tabClass(sessionTab === key)}>{label}</button>)}</div>
  );

  const SessionMainPanel = () => {
    if (sessionTab === "registro") return <div className={softCard + " p-5"}><h3 className="font-semibold text-lg mb-4">Registro de sesión</h3><div className="grid md:grid-cols-2 gap-4"><input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Beneficiario" value={selectedStudent.name} readOnly /><input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Fecha" /><input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Hora inicio" /><input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Hora fin" /></div><textarea className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3" rows="5" placeholder="Tema abordado y observaciones" /><div className="mt-4 flex gap-3"><button className="px-4 py-2 rounded-xl bg-blue-600 text-white">Guardar sesión</button><button className="px-4 py-2 rounded-xl bg-slate-100">Marcar asistencia</button></div></div>;
    if (sessionTab === "bitacora") return <div className={softCard + " p-5"}><h3 className="font-semibold text-lg mb-4">Bitácora</h3><div className="grid md:grid-cols-2 gap-4"><select className="rounded-xl border border-slate-300 px-4 py-3 bg-white"><option>Tipo de registro</option><option>Seguimiento</option><option>Incidencia</option><option>Acuerdo</option></select><input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Fecha" /></div><textarea className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3" rows="6" placeholder="Describe la incidencia, acuerdo u observación relevante" /><button className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white">Guardar bitácora</button></div>;
    if (sessionTab === "evidencias") return <div className={softCard + " p-5"}><h3 className="font-semibold text-lg mb-4">Evidencias</h3><div className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center bg-slate-50"><Upload className="mx-auto mb-3 text-slate-500" /><div className="font-medium">Arrastra archivos o imágenes aquí</div><div className="text-sm text-slate-500 mt-1">También puedes cargar enlaces o documentos PDF.</div><button className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white">Seleccionar archivo</button></div></div>;
    if (sessionTab === "tareas") return <div className={softCard + " p-5"}><h3 className="font-semibold text-lg mb-4">Tareas derivadas de la sesión</h3><input className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3" placeholder="Título de la actividad" /><textarea className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3" rows="5" placeholder="Indicación para el beneficiario" /><div className="grid md:grid-cols-2 gap-3"><input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Fecha límite" /><input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Adjuntar apoyo opcional" /></div><button className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white">Asignar tarea</button></div>;
    return <div className={softCard + " p-5"}><h3 className="font-semibold text-lg mb-4">Materiales usados en sesión</h3><div className="grid md:grid-cols-2 gap-4"><div className="p-4 rounded-2xl border bg-slate-50">Vocabulary list A2</div><div className="p-4 rounded-2xl border bg-slate-50">Reading worksheet</div><div className="p-4 rounded-2xl border bg-slate-50">Listening practice</div><div className="p-4 rounded-2xl border bg-slate-50">Guide for speaking exercise</div></div></div>;
  };

  const TutorSession = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold">Seguimiento de sesión</h2><p className="text-sm text-slate-500">Workspace central del tutor para registrar la clase, documentar seguimiento y generar actividades.</p></div><div className="flex gap-2"><button onClick={() => setTutorModule("students")} className="px-4 py-2 rounded-xl bg-slate-100 text-sm">Volver a alumnos</button><button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm">Guardar progreso</button></div></div>
      <div className="grid xl:grid-cols-[300px,1fr,320px] gap-6">
        <div className="space-y-4">
          <div className={softCard + " p-5"}><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">{selectedStudent.name[0]}</div><div><div className="font-semibold">{selectedStudent.name}</div><div className="text-sm text-slate-500">{selectedStudent.level} · {selectedStudent.program}</div></div></div><div className="mt-4 space-y-3 text-sm text-slate-600"><div className="flex justify-between"><span>Estado</span><span className="font-medium text-blue-700">{selectedStudent.status}</span></div><div className="flex justify-between"><span>Asistencia</span><span>{selectedStudent.attendance}</span></div><div className="flex justify-between"><span>Nivel diagnóstico</span><span>{selectedStudent.diagnostic}</span></div><div className="flex justify-between"><span>Nivel actual</span><span>{selectedStudent.current}</span></div></div></div>
          <div className={softCard + " p-5"}><h3 className="font-semibold mb-3">Atajos</h3><div className="space-y-2 text-sm"><button onClick={() => setSessionTab("registro")} className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 border">Registrar sesión</button><button onClick={() => setSessionTab("bitacora")} className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 border">Agregar bitácora</button><button onClick={() => setSessionTab("evidencias")} className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 border">Subir evidencia</button><button onClick={() => setSessionTab("tareas")} className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 border">Asignar tarea</button><button onClick={() => setSessionTab("materiales")} className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 border">Ver materiales</button></div></div>
          <div className={softCard + " p-5"}><h3 className="font-semibold mb-3">Sesiones recientes</h3><div className="space-y-2 text-sm"><div className="p-3 rounded-xl bg-slate-50 border">07/03 · Speaking practice</div><div className="p-3 rounded-xl bg-slate-50 border">03/03 · Vocabulary review</div><div className="p-3 rounded-xl bg-slate-50 border">28/02 · Listening A2</div></div></div>
        </div>
        <div className="space-y-4"><SessionTabs /> <SessionMainPanel /></div>
        <div className="space-y-4">
          <div className={softCard + " p-5"}><h3 className="font-semibold mb-4">Resumen de avance</h3><div className="space-y-3 text-sm"><div className="flex justify-between"><span>Tareas completadas</span><span>12</span></div><div className="flex justify-between"><span>Comentarios abiertos</span><span>2</span></div><div className="flex justify-between"><span>Materiales compartidos</span><span>8</span></div><div className="flex justify-between"><span>Última entrega</span><span>Hace 2 días</span></div></div></div>
          <div className={softCard + " p-5"}><h3 className="font-semibold mb-4">Horas</h3><div className="h-28 rounded-2xl bg-slate-50 border flex items-center justify-center text-slate-500">1.5 h en esta sesión</div><div className="text-sm text-slate-500 mt-3">Las horas se registran con base en la sesión y su seguimiento.</div></div>
          <div className={softCard + " p-5"}><h3 className="font-semibold mb-4">Bitácoras recientes</h3><div className="space-y-3 text-sm"><div className="p-3 rounded-xl bg-slate-50 border">Seguimiento: mejorar fluidez oral.</div><div className="p-3 rounded-xl bg-slate-50 border">Acuerdo: repasar verbos.</div><div className="p-3 rounded-xl bg-slate-50 border">Evidencia: worksheet cargado.</div></div></div>
        </div>
      </div>
    </div>
  );

  const TutorHours = () => (
    <div className="space-y-6"><div><h2 className="text-2xl font-bold">Horas acumuladas</h2><p className="text-sm text-slate-500">Consulta horas registradas, validadas y pendientes de revisión.</p></div><div className={softCard + " p-5"}><div className="space-y-3 text-sm"><div className="flex justify-between"><span>Horas registradas</span><span className="font-semibold">47.5 h</span></div><div className="flex justify-between"><span>Horas validadas</span><span className="font-semibold">41 h</span></div><div className="flex justify-between"><span>Pendientes</span><span className="font-semibold">6.5 h</span></div></div></div><div className={softCard + " p-5"}><div className="h-72 rounded-2xl bg-slate-50 border flex items-center justify-center text-slate-500">Gráfica o historial de horas por sesión</div></div></div>
  );

  const TutorContent = () => {
    if (tutorModule === "dashboard") return <TutorDashboard />;
    if (tutorModule === "students") return <TutorStudents />;
    if (tutorModule === "materials") return <TutorMaterials />;
    if (tutorModule === "tasks") return <TutorTasks />;
    if (tutorModule === "session") return <TutorSession />;
    return <TutorHours />;
  };

  const OrgContent = () => {
    if (orgModule === "dashboard") return <div className="space-y-6"><div className="grid md:grid-cols-4 gap-4"><KpiCard title="Beneficiarios activos" value="42" hint="5 con seguimiento prioritario" /><KpiCard title="Tutores activos" value="12" hint="2 pendientes de validación" /><KpiCard title="Sesiones registradas" value="186" hint="11 por revisar" /><KpiCard title="Horas acumuladas" value="394 h" hint="352 h validadas" /></div><div className="grid xl:grid-cols-3 gap-6"><div className="xl:col-span-2 space-y-6"><div className={softCard + " p-5"}><div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold">Asignaciones recientes</h2><button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm">Nueva asignación</button></div><div className="overflow-hidden rounded-2xl border border-slate-200"><table className="w-full text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="text-left p-3">Beneficiario</th><th className="text-left p-3">Tutor</th><th className="text-left p-3">Periodo</th><th className="text-left p-3">Estado</th></tr></thead><tbody>{[["María López","Ana Ruiz","2026-A","Activa"],["Carlos Vega","Luis Rojas","2026-A","Activa"],["Fernanda Gil","Paola Díaz","2026-A","Seguimiento"]].map((row,i)=><tr key={i} className="border-t border-slate-200 bg-white">{row.map((cell)=><td key={cell} className="p-3">{cell}</td>)}</tr>)}</tbody></table></div></div><div className={softCard + " p-5"}><h3 className="font-semibold text-lg mb-4">Alertas operativas</h3><div className="grid md:grid-cols-3 gap-4 text-sm"><div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">2 tutores no han registrado sesión esta semana.</div><div className="p-4 rounded-2xl bg-red-50 border border-red-200">1 beneficiario tiene 3 faltas consecutivas.</div><div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">5 materiales nuevos están pendientes de revisión.</div></div></div></div><div className={softCard + " p-5"}><h3 className="font-semibold text-lg mb-4">Resumen general</h3><div className="space-y-3 text-sm text-slate-600"><div className="flex justify-between"><span>Sesiones hoy</span><span>14</span></div><div className="flex justify-between"><span>Casos en seguimiento</span><span>6</span></div><div className="flex justify-between"><span>Materiales publicados</span><span>28</span></div><div className="flex justify-between"><span>Reportes del periodo</span><span>4</span></div></div></div></div></div>;
    if (orgModule === "beneficiaries") return <div className="space-y-6"><div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold">Gestión de beneficiarios</h2><p className="text-sm text-slate-500">Consulta información académica, avance, asistencia y tutor asignado.</p></div><button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm">Nuevo beneficiario</button></div><div className={softCard + " p-5"}><div className="overflow-hidden rounded-2xl border border-slate-200"><table className="w-full text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="text-left p-3">Nombre</th><th className="text-left p-3">Nivel</th><th className="text-left p-3">Tutor</th><th className="text-left p-3">Asistencia</th><th className="text-left p-3">Estado</th></tr></thead><tbody>{[["María López","A2","Ana Ruiz","92%","Activa"],["Carlos Vega","A1","Luis Rojas","78%","Seguimiento"],["Fernanda Gil","B1","Paola Díaz","95%","Activa"],["Diego Lara","A2","Ana Ruiz","88%","Activa"]].map((row,i)=><tr key={i} className="border-t border-slate-200 bg-white">{row.map((cell)=><td key={cell} className="p-3">{cell}</td>)}</tr>)}</tbody></table></div></div></div>;
    if (orgModule === "tutors") return <div className="space-y-6"><div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold">Gestión de tutores</h2><p className="text-sm text-slate-500">Monitorea carga de trabajo, horas acumuladas y beneficiarios asignados.</p></div><button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm">Nuevo tutor</button></div><div className="grid md:grid-cols-3 gap-4">{[["Ana Ruiz","8 beneficiarios","41 h"],["Luis Rojas","6 beneficiarios","36 h"],["Paola Díaz","5 beneficiarios","29 h"]].map(([name,load,hours])=><div key={name} className={softCard + " p-5"}><div className="font-semibold text-lg">{name}</div><div className="text-sm text-slate-500 mt-1">{load}</div><div className="mt-4 inline-block rounded-xl bg-slate-100 px-3 py-2 text-sm">{hours}</div></div>)}</div></div>;
    if (orgModule === "assignment") return <div className="space-y-6"><div><h2 className="text-2xl font-bold">Asignación tutor-beneficiario</h2><p className="text-sm text-slate-500">Relaciona tutores con beneficiarios por periodo y programa.</p></div><div className="grid xl:grid-cols-2 gap-6"><div className={softCard + " p-5"}><h3 className="font-semibold text-lg mb-4">Nueva asignación</h3><div className="grid md:grid-cols-2 gap-4"><select className="rounded-xl border border-slate-300 px-4 py-3 bg-white"><option>Selecciona tutor</option></select><select className="rounded-xl border border-slate-300 px-4 py-3 bg-white"><option>Selecciona beneficiario</option></select><input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Periodo" /><input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Programa" /></div><button className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white">Guardar asignación</button></div><div className={softCard + " p-5"}><h3 className="font-semibold text-lg mb-4">Asignaciones activas</h3><div className="space-y-3 text-sm"><div className="p-3 rounded-xl bg-slate-50 border">María López — Ana Ruiz</div><div className="p-3 rounded-xl bg-slate-50 border">Carlos Vega — Luis Rojas</div><div className="p-3 rounded-xl bg-slate-50 border">Fernanda Gil — Paola Díaz</div></div></div></div></div>;
    if (orgModule === "tracking") return <div className="space-y-6"><div><h2 className="text-2xl font-bold">Seguimiento académico</h2><p className="text-sm text-slate-500">Revisa avance, tareas, asistencia y observaciones por beneficiario.</p></div><div className={softCard + " p-5"}><div className="overflow-hidden rounded-2xl border border-slate-200"><table className="w-full text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="text-left p-3">Beneficiario</th><th className="text-left p-3">Nivel actual</th><th className="text-left p-3">Tareas</th><th className="text-left p-3">Observaciones</th></tr></thead><tbody>{[["María López","A2","12/14","Buen desempeño"],["Carlos Vega","A1","8/14","Reforzar asistencia"],["Fernanda Gil","B1","14/14","Constante"]].map((row,i)=><tr key={i} className="border-t border-slate-200 bg-white">{row.map((cell)=><td key={cell} className="p-3">{cell}</td>)}</tr>)}</tbody></table></div></div></div>;
    if (orgModule === "logs") return <div className="space-y-6"><div><h2 className="text-2xl font-bold">Horas, bitácoras y evidencias</h2><p className="text-sm text-slate-500">Supervisión operativa del trabajo de tutores y seguimiento por sesión.</p></div><div className="grid xl:grid-cols-[1fr,320px] gap-6"><div className={softCard + " p-5"}><div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-lg">Registros recientes</h3><div className="flex gap-2 text-sm"><button className="px-3 py-2 rounded-xl bg-slate-100">Filtrar</button><button className="px-3 py-2 rounded-xl bg-slate-100">Exportar</button></div></div><div className="overflow-hidden rounded-2xl border border-slate-200"><table className="w-full text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="text-left p-3">Tutor</th><th className="text-left p-3">Alumno</th><th className="text-left p-3">Tipo</th><th className="text-left p-3">Fecha</th><th className="text-left p-3">Estado</th></tr></thead><tbody>{[["Ana Ruiz","María López","Bitácora","10/03/2026","Validado"],["Luis Rojas","Carlos Vega","Evidencia","10/03/2026","Pendiente"],["Paola Díaz","Fernanda Gil","Sesión","09/03/2026","Validado"]].map((row,i)=><tr key={i} className="border-t border-slate-200 bg-white">{row.map((cell)=><td key={cell} className="p-3">{cell}</td>)}</tr>)}</tbody></table></div></div><div className="space-y-6"><div className={softCard + " p-5"}><h3 className="font-semibold mb-4">Resumen</h3><div className="space-y-3 text-sm"><div className="flex justify-between"><span>Bitácoras</span><span>71</span></div><div className="flex justify-between"><span>Evidencias</span><span>58</span></div><div className="flex justify-between"><span>Sesiones por validar</span><span>11</span></div></div></div><div className={softCard + " p-5"}><h3 className="font-semibold mb-4">Alertas</h3><div className="space-y-3 text-sm"><div className="p-3 rounded-xl bg-amber-50 border border-amber-200">4 bitácoras aún no tienen revisión.</div><div className="p-3 rounded-xl bg-red-50 border border-red-200">2 sesiones exceden horas esperadas.</div></div></div></div></div></div>;
    if (orgModule === "reports") return <div className="space-y-6"><div><h2 className="text-2xl font-bold">Reportes básicos</h2><p className="text-sm text-slate-500">Consulta resúmenes del periodo y descargas sencillas.</p></div><div className="grid md:grid-cols-3 gap-4">{["Reporte de avance","Reporte de horas","Reporte de asistencia"].map((item)=><div key={item} className={softCard + " p-5"}><div className="font-semibold">{item}</div><button className="mt-4 px-3 py-2 rounded-xl bg-slate-100 text-sm">Descargar</button></div>)}</div></div>;
    return <div className="space-y-6"><div><h2 className="text-2xl font-bold">Material institucional</h2><p className="text-sm text-slate-500">Publica y organiza recursos para uso de tutores.</p></div><div className="grid xl:grid-cols-2 gap-6"><div className={softCard + " p-5"}><h3 className="font-semibold text-lg mb-4">Subir material</h3><input className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3" placeholder="Título" /><textarea className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3" rows="4" placeholder="Descripción" /><button className="px-4 py-2 rounded-xl bg-blue-600 text-white">Guardar material</button></div><div className={softCard + " p-5"}><h3 className="font-semibold text-lg mb-4">Biblioteca</h3><div className="space-y-3 text-sm"><div className="p-3 rounded-xl bg-slate-50 border">Guía de sesión inicial</div><div className="p-3 rounded-xl bg-slate-50 border">Material A1</div><div className="p-3 rounded-xl bg-slate-50 border">Formato de bitácora</div></div></div></div></div>;
  };

  const StudentContent = () => {
    if (studentModule === "dashboard") return <div className="space-y-6"><div className="grid md:grid-cols-4 gap-4"><KpiCard title="Nivel actual" value="A2" hint="Subiste desde A1 diagnóstico" /><KpiCard title="Tareas pendientes" value="3" hint="1 vence mañana" /><KpiCard title="Clases esta semana" value="2" hint="Próxima hoy 12:00" /><KpiCard title="Asistencia" value="92%" hint="Muy buen seguimiento" /></div><div className="grid xl:grid-cols-3 gap-6"><div className="xl:col-span-2 space-y-6"><div className={softCard + " p-5"}><div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold">Próximas clases</h2><button className="text-sm text-blue-600">Ver calendario</button></div><div className="grid md:grid-cols-2 gap-4">{[["Lunes 10:00","Inglés A2","Tema: presentaciones"],["Miércoles 12:00","Inglés A2","Tema: rutinas"],["Viernes 11:00","Inglés A2","Tema: listening"],["Tutor","Ana Ruiz","Sesión confirmada"]].map(([a,b,c],i)=><div key={i} className="p-4 rounded-2xl border bg-slate-50"><div className="font-semibold">{a}</div><div className="text-sm text-slate-500 mt-2">{b}</div><div className="text-sm mt-3">{c}</div></div>)}</div></div><div className={softCard + " p-5"}><h3 className="font-semibold text-lg mb-4">Recursos recientes</h3><div className="grid md:grid-cols-2 gap-4 text-sm"><div className="p-4 rounded-2xl border bg-slate-50">Guía visual — presentaciones</div><div className="p-4 rounded-2xl border bg-slate-50">Actividad de vocabulario</div><div className="p-4 rounded-2xl border bg-slate-50">Ejercicio de lectura</div><div className="p-4 rounded-2xl border bg-slate-50">Práctica auditiva</div></div></div></div><div className="space-y-6"><div className={softCard + " p-5"}><h3 className="font-semibold mb-4">Tareas pendientes</h3><div className="space-y-3 text-sm"><div className="p-3 rounded-xl bg-slate-50 border">Worksheet de vocabulario — vence mañana</div><div className="p-3 rounded-xl bg-slate-50 border">Listening exercise — pendiente</div></div></div><div className={softCard + " p-5"}><h3 className="font-semibold mb-4">Mi avance</h3><div className="space-y-3 text-sm"><div className="flex justify-between"><span>Nivel diagnóstico</span><span>A1</span></div><div className="flex justify-between"><span>Nivel actual</span><span>A2</span></div><div className="flex justify-between"><span>Comentarios nuevos</span><span>4</span></div></div></div></div></div></div>;
    if (studentModule === "progress") return <div className="space-y-6"><div><h2 className="text-2xl font-bold">Mi avance</h2><p className="text-sm text-slate-500">Consulta tu progreso de forma clara y sencilla.</p></div><div className={softCard + " p-5"}><div className="overflow-hidden rounded-2xl border border-slate-200"><table className="w-full text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="text-left p-3">Área</th><th className="text-left p-3">Estado</th><th className="text-left p-3">Comentario</th></tr></thead><tbody>{[["Speaking","En progreso","Practica frases cortas"],["Reading","Bien","Muy buena comprensión"],["Listening","En progreso","Repasa audios cortos"]].map((row,i)=><tr key={i} className="border-t border-slate-200 bg-white">{row.map((cell)=><td key={cell} className="p-3">{cell}</td>)}</tr>)}</tbody></table></div></div></div>;
    if (studentModule === "materials") return <div className="space-y-6"><div><h2 className="text-2xl font-bold">Material de apoyo</h2><p className="text-sm text-slate-500">Recursos organizados por tema para estudiar de manera sencilla.</p></div><div className="grid md:grid-cols-3 gap-4">{["Presentaciones básicas","Vocabulario visual","Lectura corta A2","Audio de práctica","Ejercicio interactivo","Guía de repaso"].map((item)=><div key={item} className={softCard + " p-5"}><div className="font-semibold">{item}</div><button className="mt-4 px-3 py-2 rounded-xl bg-slate-100 text-sm">Abrir</button></div>)}</div></div>;
    if (studentModule === "tasks") return <div className="space-y-6"><div><h2 className="text-2xl font-bold">Tareas</h2><p className="text-sm text-slate-500">Revisa tus actividades y entrega tus trabajos.</p></div><div className="grid xl:grid-cols-2 gap-6"><div className={softCard + " p-5"}><h3 className="font-semibold text-lg mb-4">Pendientes</h3><div className="space-y-3 text-sm"><div className="p-3 rounded-xl bg-slate-50 border">Worksheet de vocabulario — vence mañana</div><div className="p-3 rounded-xl bg-slate-50 border">Lectura corta — entregar viernes</div></div></div><div className={softCard + " p-5"}><h3 className="font-semibold text-lg mb-4">Subir entrega</h3><input className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3" placeholder="Nombre de la tarea" /><textarea className="w-full rounded-xl border border-slate-300 px-4 py-3 mb-3" rows="4" placeholder="Comentario para tu tutor" /><button className="px-4 py-2 rounded-xl bg-blue-600 text-white">Adjuntar archivo</button></div></div></div>;
    if (studentModule === "classes") return <div className="space-y-6"><div><h2 className="text-2xl font-bold">Mis clases</h2><p className="text-sm text-slate-500">Consulta tus próximas sesiones y el historial de clases.</p></div><div className="grid md:grid-cols-3 gap-4">{[["Lunes","10:00","Tema: presentaciones"],["Miércoles","12:00","Tema: rutinas"],["Viernes","11:00","Tema: listening"],["Tutor","Ana Ruiz","Clase confirmada"],["Última clase","Hace 3 días","Con retroalimentación"]].map(([a,b,c],i)=><div key={i} className={softCard + " p-5"}><div className="font-semibold">{a}</div><div className="text-sm text-slate-500 mt-2">{b}</div><div className="text-sm mt-3">{c}</div></div>)}</div></div>;
    return <div className="space-y-6"><div><h2 className="text-2xl font-bold">Mi perfil</h2><p className="text-sm text-slate-500">Información personal y académica básica.</p></div><div className="grid xl:grid-cols-2 gap-6"><div className={softCard + " p-5"}><div className="space-y-3 text-sm"><div className="flex justify-between"><span>Nombre</span><span>María López</span></div><div className="flex justify-between"><span>Programa</span><span>Inglés</span></div><div className="flex justify-between"><span>Nivel</span><span>A2</span></div><div className="flex justify-between"><span>Tutor</span><span>Ana Ruiz</span></div></div></div><div className={softCard + " p-5"}><h3 className="font-semibold mb-4">Comentarios recientes</h3><div className="space-y-3 text-sm"><div className="p-3 rounded-xl bg-slate-50 border">Muy buen esfuerzo en la última actividad.</div><div className="p-3 rounded-xl bg-slate-50 border">Repasa vocabulario antes de la próxima clase.</div></div></div></div></div>;
  };

  return (
    <div className={shell}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">TALK! Learning Platform</h1><p className="text-slate-600 mt-2">Demo visual de la plataforma TALK! para organización, TutorTEC y beneficiario.</p></div>
          <div className="flex gap-2"><button onClick={() => setAppScreen("landing")} className={topSelector(appScreen === "landing")}>Inicio</button><button onClick={() => setAppScreen("login")} className={topSelector(appScreen === "login")}>Login</button><button onClick={() => setAppScreen("register")} className={topSelector(appScreen === "register")}>Registro</button><button onClick={() => setAppScreen("app")} className={topSelector(appScreen === "app")}>Plataforma</button></div>
        </div>

        {appScreen === "landing" && <LandingScreen />}
        {appScreen === "login" && <AuthScreen mode="login" />}
        {appScreen === "register" && <AuthScreen mode="register" />}

        {appScreen === "app" && (
          <>
            <div className="flex flex-wrap gap-3"><button onClick={() => setRoleView("tutor")} className={topSelector(roleView === "tutor")}>Vista Tutor</button><button onClick={() => setRoleView("org")} className={topSelector(roleView === "org")}>Vista Organización</button><button onClick={() => setRoleView("student")} className={topSelector(roleView === "student")}>Vista Beneficiario</button></div>

            {roleView === "tutor" && <div className={card + " overflow-hidden"}><div className="flex min-h-[860px] bg-slate-50"><aside className={sidebar}><button onClick={() => setTutorModule("dashboard")} className={menuClass(tutorModule === "dashboard")}><LayoutDashboard size={18} />Dashboard</button><button onClick={() => setTutorModule("students")} className={menuClass(tutorModule === "students")}><Users size={18} />Mis alumnos</button><button onClick={() => setTutorModule("materials")} className={menuClass(tutorModule === "materials")}><BookOpen size={18} />Materiales</button><button onClick={() => setTutorModule("tasks")} className={menuClass(tutorModule === "tasks")}><ClipboardList size={18} />Tareas y evaluación</button><button onClick={() => setTutorModule("session")} className={menuClass(tutorModule === "session")}><FileText size={18} />Seguimiento de sesión</button><button onClick={() => setTutorModule("hours")} className={menuClass(tutorModule === "hours")}><Clock3 size={18} />Horas acumuladas</button></aside><main className={contentWrap}>{TutorContent()}</main></div></div>}

            {roleView === "org" && <div className={card + " overflow-hidden"}><div className="flex min-h-[760px] bg-slate-50"><aside className={sidebar}><button onClick={() => setOrgModule("dashboard")} className={menuClass(orgModule === "dashboard")}><LayoutDashboard size={18} />Dashboard</button><button onClick={() => setOrgModule("beneficiaries")} className={menuClass(orgModule === "beneficiaries")}><GraduationCap size={18} />Beneficiarios</button><button onClick={() => setOrgModule("tutors")} className={menuClass(orgModule === "tutors")}><Users size={18} />Tutores</button><button onClick={() => setOrgModule("assignment")} className={menuClass(orgModule === "assignment")}><CalendarDays size={18} />Asignaciones</button><button onClick={() => setOrgModule("tracking")} className={menuClass(orgModule === "tracking")}><ClipboardList size={18} />Seguimiento</button><button onClick={() => setOrgModule("logs")} className={menuClass(orgModule === "logs")}><FileText size={18} />Horas y evidencias</button><button onClick={() => setOrgModule("reports")} className={menuClass(orgModule === "reports")}><FolderOpen size={18} />Reportes</button><button onClick={() => setOrgModule("materials")} className={menuClass(orgModule === "materials")}><BookOpen size={18} />Material institucional</button></aside><main className={contentWrap}>{OrgContent()}</main></div></div>}

            {roleView === "student" && <div className={card + " overflow-hidden"}><div className="flex min-h-[720px] bg-slate-50"><aside className={sidebar}><button onClick={() => setStudentModule("dashboard")} className={menuClass(studentModule === "dashboard")}><LayoutDashboard size={18} />Dashboard</button><button onClick={() => setStudentModule("progress")} className={menuClass(studentModule === "progress")}><GraduationCap size={18} />Mi avance</button><button onClick={() => setStudentModule("materials")} className={menuClass(studentModule === "materials")}><BookOpen size={18} />Material de apoyo</button><button onClick={() => setStudentModule("tasks")} className={menuClass(studentModule === "tasks")}><ClipboardList size={18} />Tareas</button><button onClick={() => setStudentModule("classes")} className={menuClass(studentModule === "classes")}><CalendarDays size={18} />Mis clases</button><button onClick={() => setStudentModule("profile")} className={menuClass(studentModule === "profile")}><Users size={18} />Mi perfil</button></aside><main className={contentWrap}>{StudentContent()}</main></div></div>}
          </>
        )}
      </div>
    </div>
  );
}

