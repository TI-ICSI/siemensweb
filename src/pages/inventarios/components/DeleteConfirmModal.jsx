// src/pages/inventarios/components/DeleteConfirmModal.jsx
import { FaExclamationTriangle, FaTrash } from 'react-icons/fa';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, inventoryName, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-icsi-lg shadow-xl max-w-md w-full transform transition-all animate-fade-in">
          
          <div className="p-6 text-center">
            {/* Ícono */}
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <FaExclamationTriangle size={32} className="text-red-600" />
            </div>
            
            {/* Título */}
            <h3 className="text-xl font-semibold text-icsi-titleform mb-2">
              Eliminar Inventario
            </h3>
            
            {/* Mensaje */}
            <p className="text-icsi-text mb-6">
              ¿Estás seguro de que deseas eliminar el inventario de <strong>{inventoryName}</strong>?
              <br />
              <span className="text-sm text-red-600">Esta acción no se puede deshacer.</span>
            </p>
            
            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gray-100 text-icsi-text rounded-icsi hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-icsi hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <FaTrash size={14} />
                    Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;