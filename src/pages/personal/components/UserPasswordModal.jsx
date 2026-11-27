// src/pages/personal/components/UserPasswordModal.jsx
import { useState } from 'react';
import { FaKey, FaExclamationCircle, FaEnvelope } from 'react-icons/fa';
import ModalShell from './ModalShell';

// Confirma el envío del correo para restablecer la contraseña de una cuenta
const UserPasswordModal = ({ isOpen, user, onClose, onConfirm }) => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  if (!user) return null;

  const handleConfirm = async () => {
    setSending(true);
    setError('');
    const result = await onConfirm(user);
    setSending(false);
    if (!result.success) setError(result.error);
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Restablecer contraseña"
      Icon={FaKey}
      busy={sending}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 p-6">
        <div>
          <p className="font-semibold text-icsi-titleform">{user.displayName}</p>
          <p className="text-sm text-icsi-text">{user.email}</p>
        </div>

        <div className="flex items-start gap-3 rounded-icsi bg-icsi-background p-3 text-sm text-icsi-text">
          <FaEnvelope size={15} className="mt-0.5 shrink-0 text-icsi-primary" />
          <p>
            Se enviará un correo a <span className="font-semibold">{user.email}</span> con un enlace para elegir una
            contraseña nueva. Su contraseña actual sigue funcionando hasta que la cambie.
          </p>
        </div>

        <p className="text-xs text-icsi-textLight">
          La persona debe tener acceso a ese correo. Si no le llega, pídele que revise la carpeta de spam.
        </p>

        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-icsi border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <FaExclamationCircle size={15} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t border-icsi-border bg-icsi-background/60 px-6 py-4">
        <button type="button" onClick={onClose} disabled={sending} className="btn-secondary">
          Cancelar
        </button>
        <button type="button" onClick={handleConfirm} disabled={sending} className="btn-primary">
          {sending ? 'Enviando...' : 'Enviar correo'}
        </button>
      </div>
    </ModalShell>
  );
};

export default UserPasswordModal;