// src/components/common/ConfirmModal.jsx
import { FaSignOutAlt, FaExclamationTriangle } from 'react-icons/fa';
import Modal from './Modal';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar acción',
  message = '¿Estás seguro de que deseas realizar esta acción?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'danger',
  icon = null,
  loading = false
}) => {
  const variants = {
    danger: {
      bg: 'bg-red-600 hover:bg-red-700',
      text: 'text-white'
    },
    primary: {
      bg: 'bg-icsi-primary hover:bg-icsi-hover',
      text: 'text-white'
    },
    success: {
      bg: 'bg-green-600 hover:bg-green-700',
      text: 'text-white'
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center">
        {/* Ícono */}
        <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          {icon || <FaExclamationTriangle size={32} className="text-red-600" />}
        </div>
        
        {/* Mensaje */}
        <p className="text-icsi-text mb-6">
          {message}
        </p>
        
        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-100 text-icsi-text rounded-icsi hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2 rounded-icsi transition-colors flex items-center justify-center gap-2 ${variants[confirmVariant].bg} ${variants[confirmVariant].text} disabled:opacity-50`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </>
            ) : (
              <>
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Modal preconfigurado para logout
export const LogoutConfirmModal = ({ isOpen, onClose, onConfirm, loading }) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Cerrar Sesión"
      message="¿Estás seguro de que deseas cerrar sesión? Perderás el acceso al panel de administración hasta que vuelvas a iniciar sesión."
      confirmText="Cerrar Sesión"
      cancelText="Cancelar"
      confirmVariant="danger"
      icon={<FaSignOutAlt size={32} className="text-red-600" />}
      loading={loading}
    />
  );
};

export default ConfirmModal;