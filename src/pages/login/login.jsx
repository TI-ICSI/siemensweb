// src/pages/login/login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
  FaCheckCircle,
  FaArrowLeft,
} from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import authService from '../../services/authService';
import sisHeader from '../../assets/sis-header.png';
import sisIcon from '../../assets/sis-icon.png';

// Spinner reutilizable para los botones
const Spinner = () => (
  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

// Campo con icono a la izquierda y un elemento opcional a la derecha
const Field = ({ label, icon, right, ...inputProps }) => (
  <div>
    <label className="block text-sm font-medium text-icsi-titleform mb-1.5">{label}</label>
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-icsi-textLight pointer-events-none">
        {icon}
      </span>
      <input className={`input pl-10 ${right ? 'pr-11' : ''}`} {...inputProps} />
      {right}
    </div>
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const { login, error } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState(null); // { type: 'success' | 'error', text }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || submitting) return;

    setSubmitting(true);
    const success = await login(email, password);
    setSubmitting(false);

    if (success) navigate('/dashboard');
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!resetEmail || submitting) return;

    setSubmitting(true);
    setResetStatus(null);
    const result = await authService.resetPassword(resetEmail.trim());
    setSubmitting(false);

    setResetStatus(
      result.success
        ? {
            type: 'success',
            text: 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.',
          }
        : { type: 'error', text: result.error || 'No se pudo enviar el correo' },
    );
  };

  const backToLogin = () => {
    setMode('login');
    setResetStatus(null);
    setResetEmail('');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-icsi-background">
      {/* Panel de marca (solo escritorio) */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-icsi-primary to-[#8F0D1C] p-12 text-white">
        {/* Formas decorativas */}
        <div className="absolute -top-28 -right-24 h-80 w-80 rotate-[35deg] rounded-[4rem] bg-white/10" />
        <div className="absolute -top-8 -right-44 h-80 w-80 rotate-[20deg] rounded-[4rem] bg-white/5" />
        <div className="absolute -bottom-32 -left-28 h-96 w-96 rotate-[35deg] rounded-[4.5rem] bg-black/10" />
        <div className="absolute bottom-24 -left-48 h-80 w-80 rotate-[20deg] rounded-[4rem] bg-white/5" />

        <div className="relative z-10">
          {/* El logo es de color: se convierte a blanco para el fondo rojo */}
          <img src={sisIcon} alt="S.I.S" className="h-14 w-auto brightness-0 invert" />
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
            Sistema de Inventarios
            <br />
            Siemens
          </h1>
          <p className="mt-5 max-w-md text-lg text-white/80">
            Registra, consulta y exporta el inventario de equipos de cada inmueble.
          </p>
        </div>

        <p className="relative z-10 text-sm text-white/60">© 2026 ICSI Comercial</p>
      </aside>

      {/* Formulario */}
      <main className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Logo (solo móvil y tablet: en escritorio está en el panel rojo) */}
          <img
            src={sisHeader}
            alt="S.I.S - Sistema de Inventarios Siemens"
            className="mx-auto mb-8 h-14 w-auto lg:hidden"
          />

          {mode === 'login' ? (
            <>
              <h2 className="text-2xl font-bold text-icsi-titleform">Iniciar sesión</h2>
              <p className="mt-1 mb-8 text-sm text-icsi-text">
                Accede al panel de administración
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Field
                  label="Correo electrónico"
                  icon={<FaEnvelope size={15} />}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@empresa.com"
                  autoComplete="email"
                  required
                  autoFocus
                />

                <Field
                  label="Contraseña"
                  icon={<FaLock size={15} />}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
                  required
                  right={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-icsi-textLight hover:text-icsi-text transition-colors"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? <FaEyeSlash size={17} /> : <FaEye size={17} />}
                    </button>
                  }
                />

                <div className="text-right -mt-1">
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className="text-sm font-medium text-icsi-primary hover:underline focus:outline-none"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-icsi border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <FaExclamationCircle className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button type="submit" disabled={submitting} className="btn-primary w-full">
                  {submitting ? (
                    <>
                      <Spinner />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Ingresar'
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={backToLogin}
                className="mb-6 flex items-center gap-2 text-sm text-icsi-text hover:text-icsi-primary transition-colors"
              >
                <FaArrowLeft size={12} />
                Volver al inicio de sesión
              </button>

              <h2 className="text-2xl font-bold text-icsi-titleform">Recuperar contraseña</h2>
              <p className="mt-1 mb-8 text-sm text-icsi-text">
                Escribe tu correo y te enviaremos un enlace para crear una nueva contraseña.
              </p>

              <form onSubmit={handleReset} className="space-y-5">
                <Field
                  label="Correo electrónico"
                  icon={<FaEnvelope size={15} />}
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="correo@empresa.com"
                  autoComplete="email"
                  required
                  autoFocus
                />

                {resetStatus && (
                  <div
                    className={`flex items-start gap-2 rounded-icsi border p-3 text-sm ${
                      resetStatus.type === 'success'
                        ? 'border-green-200 bg-green-50 text-green-700'
                        : 'border-red-200 bg-red-50 text-red-700'
                    }`}
                  >
                    {resetStatus.type === 'success' ? (
                      <FaCheckCircle className="mt-0.5 shrink-0" />
                    ) : (
                      <FaExclamationCircle className="mt-0.5 shrink-0" />
                    )}
                    <span>{resetStatus.text}</span>
                  </div>
                )}

                <button type="submit" disabled={submitting} className="btn-primary w-full">
                  {submitting ? (
                    <>
                      <Spinner />
                      Enviando...
                    </>
                  ) : (
                    'Enviar enlace'
                  )}
                </button>
              </form>
            </>
          )}

          <p className="mt-10 border-t border-icsi-border pt-6 text-center text-xs text-icsi-textLight">
            © 2026 ICSI Comercial · Solo personal autorizado
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;