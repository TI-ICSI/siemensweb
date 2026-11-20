// src/pages/perfil/Perfil.jsx
import { useState, useEffect } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import {
  FaUserCircle,
  FaEnvelope,
  FaUserShield,
  FaCalendarAlt,
  FaKey,
  FaPen,
  FaCheckCircle,
  FaExclamationCircle,
  FaSignInAlt,
  FaClipboardList,
  FaHistory,
} from 'react-icons/fa';
import { auth } from '../../../firebase/firebaseConfig';
import usePerfilActividad from './hooks/usePerfilActividad';

const ROLES = { admin: 'Administrador', tecnico: 'Técnico', user: 'Usuario' };

const NAME_MAX = 60;

const RESET_COOLDOWN = 60; // segundos antes de poder pedir otro correo

const RESET_ERRORS = {
  'auth/too-many-requests': 'Demasiados intentos. Intenta de nuevo más tarde',
  'auth/network-request-failed': 'Error de conexión. Revisa tu internet',
};

const formatDateTime = (value) => {
  const date = value instanceof Date ? value : value ? new Date(value) : null;
  return date && !isNaN(date)
    ? date.toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })
    : '—';
};

const formatDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !isNaN(date) ? date.toLocaleDateString('es-MX', { dateStyle: 'long' }) : '—';
};

const Field = ({ Icon, label, children }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-icsi bg-icsi-background text-icsi-textLight">
      <Icon size={14} />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wider text-icsi-textLight">{label}</p>
      <div className="mt-0.5 break-words font-semibold text-icsi-titleform">{children}</div>
    </div>
  </div>
);

const ActivityItem = ({ Icon, tone, title, detail, date }) => (
  <li className="flex items-start gap-3 py-2.5">
    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-icsi ${tone}`}>
      <Icon size={14} />
    </div>
    <div className="min-w-0">
      <p className="text-sm font-semibold text-icsi-titleform">{title}</p>
      {detail && <p className="truncate text-xs text-icsi-text">{detail}</p>}
      <p className="text-xs text-icsi-textLight">{date}</p>
    </div>
  </li>
);

const Perfil = ({ user, onUpdateName }) => {
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text }
  const [cooldown, setCooldown] = useState(0);

  // Edición del nombre
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState('');
  const [nameSaved, setNameSaved] = useState(false);

  const { loading: loadingActividad, inventarios } = usePerfilActividad(user?.uid);

  // Cuenta regresiva para volver a habilitar el botón
  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const meta = auth.currentUser?.metadata;
  const name = user?.displayName || user?.email?.split('@')[0] || 'Usuario';
  const initial = name.trim().charAt(0).toUpperCase() || 'U';

  const handleResetPassword = async () => {
    if (!user?.email || sending || cooldown > 0) return;
    setSending(true);
    setFeedback(null);
    try {
      await sendPasswordResetEmail(auth, user.email);
      setFeedback({
        type: 'success',
        text: `Te enviamos un correo a ${user.email} con el enlace para cambiar tu contraseña. Revisa también tu carpeta de spam.`,
      });
      setCooldown(RESET_COOLDOWN);
    } catch (error) {
      console.error('Error al enviar correo de restablecimiento:', error?.code);
      setFeedback({
        type: 'error',
        text: RESET_ERRORS[error?.code] || 'No se pudo enviar el correo. Intenta de nuevo',
      });
    } finally {
      setSending(false);
    }
  };

  const startEditName = () => {
    setNameDraft(name);
    setNameError('');
    setNameSaved(false);
    setEditingName(true);
  };

  const cancelEditName = () => {
    setEditingName(false);
    setNameError('');
  };

  const handleSaveName = async (e) => {
    e.preventDefault();
    const clean = nameDraft.trim().replace(/\s+/g, ' ');
    if (clean.length < 2) {
      setNameError('El nombre debe tener al menos 2 caracteres');
      return;
    }
    if (clean === name) {
      setEditingName(false);
      return;
    }

    setSavingName(true);
    setNameError('');
    const result = await onUpdateName(clean);
    setSavingName(false);

    if (result.success) {
      setEditingName(false);
      setNameSaved(true);
    } else {
      setNameError(result.error);
    }
  };

  return (
    <div>
      {/* Encabezado */}
      <div className="card relative mb-6 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-1.5 bg-icsi-primary" />
        <div className="flex items-center gap-4 pl-2">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-icsi-lg bg-icsi-primary/10 text-icsi-primary">
            <FaUserCircle size={26} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-icsi-titleform">Perfil</h2>
            <p className="mt-1 text-icsi-text">Consulta los datos de tu cuenta</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2.2fr_1fr]">
        {/* Información personal + seguridad */}
        <div className="card">
          <h3 className="text-lg font-bold text-icsi-titleform">Información personal</h3>

          <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-start">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3 md:w-48">
              <div className="rounded-full bg-icsi-primary/10 p-3">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-icsi-primary text-5xl font-bold text-white shadow-icsi-lg">
                  {initial}
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-icsi-primary/10 px-3 py-1 text-xs font-semibold text-icsi-primary">
                <FaUserShield size={11} />
                {ROLES[user?.role] || 'Usuario'}
              </span>
            </div>

            {/* Datos */}
            <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
              <div className={editingName ? 'sm:col-span-2' : ''}>
                <Field Icon={FaUserCircle} label="Nombre completo">
                  {editingName ? (
                    <form onSubmit={handleSaveName} className="space-y-2">
                      <input
                        type="text"
                        value={nameDraft}
                        onChange={(e) => setNameDraft(e.target.value)}
                        maxLength={NAME_MAX}
                        autoFocus
                        className="input"
                        placeholder="Tu nombre completo"
                        onKeyDown={(e) => e.key === 'Escape' && cancelEditName()}
                      />
                      {nameError && <p className="text-xs font-normal text-red-600">{nameError}</p>}
                      <div className="flex gap-2">
                        <button type="submit" disabled={savingName} className="btn-primary !px-4 !py-2 text-sm">
                          {savingName ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditName}
                          disabled={savingName}
                          className="btn-secondary !px-4 !py-2 text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>{name}</span>
                      <button
                        type="button"
                        onClick={startEditName}
                        className="rounded-lg p-1.5 text-icsi-textLight transition-colors hover:bg-icsi-primary/10 hover:text-icsi-primary"
                        title="Editar nombre"
                        aria-label="Editar nombre"
                      >
                        <FaPen size={12} />
                      </button>
                    </div>
                  )}
                  {nameSaved && !editingName && (
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-normal text-green-700">
                      <FaCheckCircle size={11} /> Nombre actualizado
                    </p>
                  )}
                </Field>
              </div>
              <Field Icon={FaEnvelope} label="Correo electrónico">{user?.email || '—'}</Field>
              <Field Icon={FaUserShield} label="Rol">{ROLES[user?.role] || 'Usuario'}</Field>
              <Field Icon={FaCalendarAlt} label="Cuenta creada">{formatDate(meta?.creationTime)}</Field>
            </div>
          </div>

          {/* Contraseña */}
          <div className="mt-8 border-t border-icsi-border pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-icsi bg-icsi-primary/10 text-icsi-primary">
                  <FaKey size={15} />
                </div>
                <div>
                  <p className="font-semibold text-icsi-titleform">Contraseña</p>
                  <p className="text-sm text-icsi-text">
                    Te enviaremos un enlace a tu correo para que elijas una nueva contraseña.
                  </p>
                </div>
              </div>

              <button
                onClick={handleResetPassword}
                disabled={sending || cooldown > 0}
                className="btn-secondary disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaKey size={13} />
                {sending
                  ? 'Enviando...'
                  : cooldown > 0
                    ? `Reenviar en ${cooldown} s`
                    : 'Cambiar contraseña'}
              </button>
            </div>

            {feedback && (
              <div
                role="status"
                className={`mt-4 flex items-start gap-3 rounded-icsi border p-4 text-sm ${
                  feedback.type === 'success'
                    ? 'border-green-200 bg-green-50 text-green-800'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
              >
                {feedback.type === 'success' ? (
                  <FaCheckCircle size={16} className="mt-0.5 shrink-0" />
                ) : (
                  <FaExclamationCircle size={16} className="mt-0.5 shrink-0" />
                )}
                <p>{feedback.text}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actividad reciente (self-start: no se estira a la altura de la otra tarjeta) */}
        <div className="card self-start !p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-icsi bg-icsi-primary/10 text-icsi-primary">
              <FaHistory size={15} />
            </div>
            <h3 className="text-base font-bold text-icsi-titleform">Actividad reciente</h3>
          </div>

          <ul className="mt-4 divide-y divide-icsi-border">
            <ActivityItem
              Icon={FaSignInAlt}
              tone="bg-blue-100 text-blue-700"
              title="Inició sesión"
              date={formatDateTime(meta?.lastSignInTime)}
            />

            {loadingActividad && (
              <li className="py-4 text-sm text-icsi-text">Cargando actividad...</li>
            )}

            {inventarios.map((inv) => (
              <ActivityItem
                key={inv.id}
                Icon={FaClipboardList}
                tone="bg-green-100 text-green-700"
                title="Creó un inventario"
                detail={`${inv.mes} ${inv.anio} · ${inv.localidad}`}
                date={formatDateTime(inv.createdAt)}
              />
            ))}

            {!loadingActividad && inventarios.length === 0 && (
              <li className="py-4 text-sm text-icsi-text">Aún no has creado inventarios.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Perfil;