// src/pages/personal/components/ModalShell.jsx
import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

// Estructura común de los modales de Personal: fondo, encabezado y botón de cerrar
const ModalShell = ({ isOpen, onClose, title, Icon, children, maxWidth = 'max-w-lg', busy = false }) => {
  // Cerrar con Esc (salvo mientras se guarda)
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && !busy && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, busy]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={busy ? undefined : onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative w-full ${maxWidth} overflow-hidden rounded-icsi-lg bg-white shadow-icsi-lg`}>
          <div className="flex items-center justify-between border-b border-icsi-border px-6 py-4">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="flex h-9 w-9 items-center justify-center rounded-icsi bg-icsi-primary/10 text-icsi-primary">
                  <Icon size={15} />
                </div>
              )}
              <h3 className="text-lg font-bold text-icsi-titleform">{title}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="rounded-lg p-2 text-icsi-textLight transition-colors hover:bg-icsi-background hover:text-icsi-primary disabled:opacity-50"
              aria-label="Cerrar"
            >
              <FaTimes size={18} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalShell;