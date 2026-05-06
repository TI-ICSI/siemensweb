// src/pages/dashboard/components/DashboardHeader.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSignOutAlt, FaUserCircle, FaHome } from 'react-icons/fa';
import { LogoutConfirmModal } from '../../../components/ConfirmModal';
import { auth } from '../../../../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import logoEmpresa from '../../../assets/icsiLogo.png'; // Ajusta la ruta según donde tengas tu logo

const DashboardHeader = ({ userName, userEmail }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setLoading(false);
      setShowLogoutModal(false);
    }
  };

  // Verificar si estamos en el dashboard para no mostrar el botón de inicio
  const isDashboard = location.pathname === '/dashboard';

  return (
    <>
      <header className="bg-white border-b border-icsi-border shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo y título - Clickable */}
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <img 
                src={logoEmpresa} 
                alt="Logo ICSI" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-icsi-titleform">
                  Panel de Administración
                </h1>
                <p className="text-xs text-icsi-text">
                  Gestión de Inventarios ICSI
                </p>
              </div>
            </button>

            {/* Acciones del usuario */}
            <div className="flex items-center space-x-4">
              {/* Botón de Inicio - Solo visible si no estamos en dashboard */}
              {!isDashboard && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  title="Ir al inicio"
                >
                  <FaHome size={16} />
                  <span className="hidden sm:inline text-sm">Inicio</span>
                </button>
              )}

              {/* Info del usuario */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-icsi-titleform">
                    {userName || 'Administrador'}
                  </p>
                  <p className="text-xs text-icsi-text">
                    {userEmail}
                  </p>
                </div>
                <div className="w-10 h-10 bg-icsi-background rounded-full flex items-center justify-center">
                  <FaUserCircle size={24} className="text-icsi-text" />
                </div>
              </div>

              {/* Botón logout */}
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <FaSignOutAlt size={16} />
                <span className="hidden sm:inline text-sm">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modal de confirmación */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        loading={loading}
      />
    </>
  );
};

export default DashboardHeader;