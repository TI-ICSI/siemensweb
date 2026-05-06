// src/pages/inventario/components/EquipoImageModal.jsx
import { FaTimes } from 'react-icons/fa';

const EquipoImageModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-icsi-lg shadow-xl max-w-4xl w-full">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
          >
            <FaTimes size={24} />
          </button>
          <img
            src={imageUrl}
            alt="Equipo"
            className="w-full h-auto rounded-icsi-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default EquipoImageModal;