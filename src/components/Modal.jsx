// src/components/common/Modal.jsx
import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Fondo oscuro */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Contenido del modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`${sizes[size]} w-full bg-white rounded-icsi-lg shadow-xl transform transition-all animate-fade-in`}>
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-icsi-border">
            <h3 className="text-xl font-semibold text-icsi-titleform">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-icsi-textLight hover:text-icsi-primary transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>
          
          {/* Body */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;