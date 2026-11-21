// src/pages/personal/components/UserActiveModal.jsx
import { useState } from 'react';
import { FaUserSlash, FaUserCheck, FaExclamationCircle } from 'react-icons/fa';
import ModalShell from './ModalShell';

// Confirma desactivar (o reactivar) una cuenta
const UserActiveModal = ({ isOpen, user, onClose, onConfirm }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!user) return null;

  const deactivating = user.active; // si hoy está activa, la acción es desactivar

  const handleConfirm = async () => {
    setSaving(true);
    setError('');
    const result = await onConfirm(user.uid, !user.active);
    setSaving(false);
    if (!result.success) setError(result.error);
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={deactivating ? 'Desactivar cuenta' : 'Reactivar cuenta'}
      Icon={deactivating ? FaUserSlash : FaUserCheck}
      busy={saving}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 p-6">
        <div>
          <p className="font-semibold text-icsi-titleform">{user.displayName}</p>
          <p className="text-sm text-icsi-text">{user.email}</p>
        </div>

        <p className="text-sm text-icsi-text">
          {deactivating
            ? 'No podrá iniciar sesión y se cerrarán sus sesiones abiertas. Sus inventarios y registros se conservan. Puedes reactivarla cuando quieras.'
            : 'Podrá volver a iniciar sesión con su correo y contraseña.'}
        </p>

        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-icsi border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <FaExclamationCircle size={15} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t border-icsi-border bg-icsi-background/60 px-6 py-4">
        <button type="button" onClick={onClose} disabled={saving} className="btn-secondary">
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={saving}
          className={
            deactivating
              ? 'inline-flex items-center justify-center gap-2 rounded-icsi bg-red-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60'
              : 'btn-primary'
          }
        >
          {saving ? 'Guardando...' : deactivating ? 'Desactivar' : 'Reactivar'}
        </button>
      </div>
    </ModalShell>
  );
};

export default UserActiveModal;