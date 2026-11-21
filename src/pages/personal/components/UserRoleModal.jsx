// src/pages/personal/components/UserRoleModal.jsx
import { useState } from 'react';
import { FaUserTag, FaExclamationCircle } from 'react-icons/fa';
import ModalShell from './ModalShell';
import { ROLE_OPTIONS, getRole } from '../constants/roles';

const UserRoleModal = ({ isOpen, user, onClose, onSave }) => {
  const [role, setRole] = useState(user?.role || 'tecnico');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!user) return null;

  const losesPortal = user.role === 'admin' && role !== 'admin';
  const unchanged = role === user.role;

  const handleSave = async () => {
    setSaving(true);
    setError('');
    const result = await onSave(user.uid, role);
    setSaving(false);
    if (!result.success) setError(result.error);
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title="Cambiar rol" Icon={FaUserTag} busy={saving}>
      <div className="space-y-4 p-6">
        <div>
          <p className="font-semibold text-icsi-titleform">{user.displayName}</p>
          <p className="text-sm text-icsi-text">{user.email}</p>
          <p className="mt-1 text-xs text-icsi-textLight">Rol actual: {getRole(user.role).label}</p>
        </div>

        <div className="space-y-2">
          {ROLE_OPTIONS.map((r) => (
            <label
              key={r.value}
              className={`flex cursor-pointer items-start gap-3 rounded-icsi border p-3 transition-colors ${
                role === r.value
                  ? 'border-icsi-primary bg-icsi-primary/5 ring-4 ring-icsi-primary/10'
                  : 'border-icsi-border hover:bg-icsi-background'
              }`}
            >
              <input
                type="radio"
                name="role"
                value={r.value}
                checked={role === r.value}
                onChange={() => setRole(r.value)}
                className="mt-1 accent-[#DC142B]"
              />
              <div>
                <p className="text-sm font-semibold text-icsi-titleform">{r.label}</p>
                <p className="text-xs text-icsi-text">{r.desc}</p>
              </div>
            </label>
          ))}
        </div>

        {losesPortal && (
          <div className="flex items-start gap-2 rounded-icsi border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <FaExclamationCircle size={15} className="mt-0.5 shrink-0" />
            <p>Perderá el acceso a este portal y se cerrarán sus sesiones abiertas.</p>
          </div>
        )}

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
        <button type="button" onClick={handleSave} disabled={saving || unchanged} className="btn-primary">
          {saving ? 'Guardando...' : 'Guardar rol'}
        </button>
      </div>
    </ModalShell>
  );
};

export default UserRoleModal;