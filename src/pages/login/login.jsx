// src/pages/login/Login.jsx
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Íconos de ojo
import logoEmpresa from '../../assets/icsiLogo.png'; // Ajusta la ruta de tu logo

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Aquí conectarás con Firebase
    setTimeout(() => {
      setLoading(false);
      // window.location.href = '/dashboard';
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-icsi-background p-4">
      <div className="card w-full max-w-md">
        
        {/* Header con Logo */}
        <div className="text-center pt-8 pb-6 px-8">
          {/* Logo de la compañía */}
          <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <img 
              src={logoEmpresa} 
              alt="Logo ICSI" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-icsi-titleform mb-1">
            Siemens Inventario
          </h1>
          <p className="text-sm text-icsi-text">Panel de Administración</p>
        </div>

        {/* Formulario */}
        <div className="px-8 pb-8">
          {!showResetPassword ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-icsi-titleform mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@icsi.com.mx"
                  required
                  autoFocus
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-icsi-titleform mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-icsi-textLight hover:text-icsi-primary transition-colors"
                    tabIndex="-1"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="text-right mb-6">
                <button
                  type="button"
                  onClick={() => setShowResetPassword(true)}
                  className="text-sm text-icsi-primary hover:underline focus:outline-none"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-icsi text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <span>→</span>
                    Iniciar Sesión
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={(e) => {
              e.preventDefault();
              setResetMessage('✅ Correo de recuperación enviado');
              setTimeout(() => {
                setShowResetPassword(false);
                setResetMessage(null);
                setResetEmail('');
              }, 3000);
            }}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-icsi-titleform mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className="input"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  autoFocus
                />
              </div>

              {resetMessage && (
                <div className={`mb-4 p-3 rounded-icsi text-sm ${
                  resetMessage.includes('✅') 
                    ? 'bg-green-50 border border-green-200 text-green-600'
                    : 'bg-red-50 border border-red-200 text-red-600'
                }`}>
                  {resetMessage}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary w-full mb-3"
              >
                Enviar correo de recuperación
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowResetPassword(false);
                  setResetMessage(null);
                  setResetEmail('');
                }}
                className="btn-secondary w-full"
              >
                ← Volver al inicio de sesión
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-icsi-border text-center">
            <p className="text-xs text-icsi-text">
              © 2026 ICSI COMERCIAL
            </p>
            <p className="text-xs text-icsi-textLight mt-1">
              Solo personal autorizado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;