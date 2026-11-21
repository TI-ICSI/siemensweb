// src/pages/personal/components/UserCreateModal.jsx
import { useState } from 'react';
import { FaUserPlus, FaEye, FaEyeSlash, FaMagic, FaCopy, FaCheck, FaExclamationCircle } from 'react-icons/fa';
import ModalShell from './ModalShell';
import { CREATE_ROLES } from '../constants/roles';

const MIN_PASSWORD = 8;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Contraseña aleatoria sin caracteres que se confundan (0/O, 1/l/I)
const generatePassword = (length = 12) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const values = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(values, (v) => chars[v % chars.length]).join('');
};

const Label = ({ children }) => (
  <label className="mb-1.5 block text-sm font-medium text-icsi-titleform">{children}</label>
);

const UserCreateModal = ({ isOpen, onClose, onCreate }) => {
  const [form, setForm] = useState({ displayName: '', email: '', password: '', role: 'tecnico' });
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleGenerate = () => {
    setForm((prev) => ({ ...prev, password: generatePassword() }));
    setShowPassword(true);
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(form.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* sin permiso del portapapeles: se puede copiar a mano */
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = form.displayName.trim().replace(/\s+/g, ' ');
    const email = form.email.trim().toLowerCase();

    if (displayName.length < 2) return setError('Escribe el nombre completo');
    if (!EMAIL.test(email)) return setError('El correo no es válido');
    if (form.password.length < MIN_PASSWORD) {
      return setError(`La contraseña debe tener al menos ${MIN_PASSWORD} caracteres`);
    }

    setSaving(true);
    setError('');
    const result = await onCreate({ displayName, email, password: form.password, role: form.role });
    setSaving(false);
    if (!result.success) setError(result.error);
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title="Nuevo usuario" Icon={FaUserPlus} busy={saving}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4 p-6">
          <div>
            <Label>Nombre completo *</Label>
            <input
              type="text"
              value={form.displayName}
              onChange={set('displayName')}
              className="input"
              placeholder="Ej: Ana Torres"
              maxLength={60}
              autoFocus
            />
          </div>

          <div>
            <Label>Correo electrónico *</Label>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              className="input"
              placeholder="nombre@icsi.com.mx"
              autoComplete="off"
            />
          </div>

          <div>
            <Label>Rol *</Label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CREATE_ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, role: r.value }))}
                  aria-pressed={form.role === r.value}
                  className={`rounded-icsi border p-3 text-left transition-colors ${
                    form.role === r.value
                      ? 'border-icsi-primary bg-icsi-primary/5 ring-4 ring-icsi-primary/10'
                      : 'border-icsi-border hover:bg-icsi-background'
                  }`}
                >
                  <p className="text-sm font-semibold text-icsi-titleform">{r.label}</p>
                  <p className="mt-0.5 text-xs text-icsi-text">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Contraseña inicial *</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => {
                    set('password')(e);
                    setCopied(false);
                  }}
                  className="input pr-11 font-mono"
                  placeholder={`Mínimo ${MIN_PASSWORD} caracteres`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-icsi-textLight hover:text-icsi-primary"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
              <button type="button" onClick={handleGenerate} className="btn-secondary !px-3" title="Generar contraseña">
                <FaMagic size={14} />
              </button>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!form.password}
                className="btn-secondary !px-3 disabled:opacity-50"
                title="Copiar contraseña"
              >
                {copied ? <FaCheck size={14} className="text-green-600" /> : <FaCopy size={14} />}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-icsi-textLight">
              Compártela de forma segura. El usuario podrá cambiarla desde su perfil con un enlace por correo.
            </p>
          </div>

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
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Creando...' : 'Crear usuario'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

export default UserCreateModal;