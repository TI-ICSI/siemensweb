// src/pages/inventarios/components/EquipoImageModal.jsx
import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

// Visor de la foto completa (se abre encima del modal de detalle)
const EquipoImageModal = ({ isOpen, onClose, imageUrl }) => {
  // Cerrar con Esc
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80" onClick={onClose} />

      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
        aria-label="Cerrar imagen"
      >
        <FaTimes size={18} />
      </button>

      <img
        src={imageUrl}
        alt="Equipo"
        className="relative max-h-[90vh] max-w-full rounded-icsi-lg object-contain shadow-icsi-lg"
      />
    </div>
  );
};

export default EquipoImageModal;