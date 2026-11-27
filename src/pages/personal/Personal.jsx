// src/pages/personal/Personal.jsx
import { useState, useEffect, useMemo } from 'react';
import {
  FaUsers,
  FaUserPlus,
  FaUserShield,
  FaHardHat,
  FaUserSlash,
  FaSearch,
  FaRedo,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
} from 'react-icons/fa';
import usePersonal from './hooks/usePersonal';
import UsersTable from './components/UsersTable';
import UserCreateModal from './components/UserCreateModal';
import UserRoleModal from './components/UserRoleModal';
import UserActiveModal from './components/UserActiveModal';
import UserPasswordModal from './components/UserPasswordModal';
import { ROLE_OPTIONS } from './constants/roles';

const EMPTY_FILTERS = { busqueda: '', role: '', status: '' };

const Stat = ({ Icon, label, value, tone }) => (
  <div className="card flex items-center gap-4 !p-4">
    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-icsi ${tone}`}>
      <Icon size={18} />
    </div>
    <div>
      <p className="text-2xl font-bold leading-none text-icsi-titleform">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-icsi-textLight">{label}</p>
    </div>
  </div>
);

const Label = ({ children }) => (
  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-icsi-textLight">
    {children}
  </label>
);

const Personal = ({ user }) => {
  const { users, loading, loadError, reload, createUser, setUserRole, setUserActive, sendPasswordReset } = usePersonal();

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [createOpen, setCreateOpen] = useState(false);
  const [createKey, setCreateKey] = useState(0);
  const [roleTarget, setRoleTarget] = useState(null);
  const [activeTarget, setActiveTarget] = useState(null);
  const [passTarget, setPassTarget] = useState(null);
  const [notice, setNotice] = useState(null); // { type: 'success' | 'error', text }

  // El aviso se quita solo
  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(timer);
  }, [notice]);

  const stats = useMemo(
    () => ({
      total: users.length,
      admins: users.filter((u) => u.role === 'admin').length,
      tecnicos: users.filter((u) => u.role === 'tecnico').length,
      inactivos: users.filter((u) => !u.active).length,
    }),
    [users],
  );

  const filtered = useMemo(() => {
    const q = filters.busqueda.trim().toLowerCase();
    return users.filter((u) => {
      if (q && !`${u.displayName} ${u.email}`.toLowerCase().includes(q)) return false;
      if (filters.role && u.role !== filters.role) return false;
      if (filters.status === 'active' && !u.active) return false;
      if (filters.status === 'inactive' && u.active) return false;
      return true;
    });
  }, [users, filters]);

  const hasFilters = Object.values(filters).some(Boolean);
  const handleFilter = (e) => setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCreate = async (data) => {
    const result = await createUser(data);
    if (result.success) {
      setCreateOpen(false);
      setNotice({
        type: 'success',
        text: `Se creó la cuenta de ${data.displayName}. Comparte su contraseña inicial de forma segura.`,
      });
    }
    return result;
  };

  const handleSetRole = async (uid, role) => {
    const result = await setUserRole(uid, role);
    if (result.success) {
      setRoleTarget(null);
      setNotice({ type: 'success', text: 'Rol actualizado.' });
    }
    return result;
  };

  const handleSetActive = async (uid, active) => {
    const result = await setUserActive(uid, active);
    if (result.success) {
      setActiveTarget(null);
      setNotice({ type: 'success', text: active ? 'Cuenta reactivada.' : 'Cuenta desactivada.' });
    }
    return result;
  };

  const handleResetPassword = async (target) => {
    const result = await sendPasswordReset(target.email);
    if (result.success) {
      setPassTarget(null);
      setNotice({
        type: 'success',
        text: `Se envió el correo de restablecimiento a ${target.email}. Debe abrirlo y elegir su nueva contraseña (revisar también spam).`,
      });
    }
    return result;
  };

  const openCreate = () => {
    setCreateKey((k) => k + 1); // formulario limpio cada vez
    setCreateOpen(true);
  };

  return (
    <div>
      {/* Encabezado */}
      <div className="card relative mb-6 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-1.5 bg-icsi-primary" />
        <div className="flex flex-wrap items-center justify-between gap-4 pl-2">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-icsi-lg bg-icsi-primary/10 text-icsi-primary">
              <FaUsers size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-icsi-titleform">Personal</h2>
              <p className="mt-1 text-icsi-text">Administra las cuentas de administradores y técnicos</p>
            </div>
          </div>
          <button onClick={openCreate} className="btn-primary">
            <FaUserPlus size={14} />
            Nuevo usuario
          </button>
        </div>
      </div>

      {notice && (
        <div
          role="status"
          className={`mb-6 flex items-start gap-3 rounded-icsi border p-4 text-sm ${
            notice.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {notice.type === 'success' ? (
            <FaCheckCircle size={16} className="mt-0.5 shrink-0" />
          ) : (
            <FaExclamationCircle size={16} className="mt-0.5 shrink-0" />
          )}
          <p className="flex-1">{notice.text}</p>
          <button onClick={() => setNotice(null)} aria-label="Cerrar aviso" className="opacity-60 hover:opacity-100">
            <FaTimes size={13} />
          </button>
        </div>
      )}

      {/* Resumen */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat Icon={FaUsers} label="Usuarios" value={stats.total} tone="bg-icsi-primary/10 text-icsi-primary" />
        <Stat Icon={FaUserShield} label="Administradores" value={stats.admins} tone="bg-red-100 text-red-700" />
        <Stat Icon={FaHardHat} label="Técnicos" value={stats.tecnicos} tone="bg-blue-100 text-blue-700" />
        <Stat Icon={FaUserSlash} label="Inactivos" value={stats.inactivos} tone="bg-gray-200 text-gray-600" />
      </div>

      {/* Filtros */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_auto] lg:items-end">
          <div>
            <Label>Buscar</Label>
            <div className="relative">
              <FaSearch size={13} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-icsi-textLight" />
              <input
                type="text"
                name="busqueda"
                value={filters.busqueda}
                onChange={handleFilter}
                placeholder="Nombre o correo..."
                className="input pl-9 text-sm"
              />
            </div>
          </div>
          <div>
            <Label>Rol</Label>
            <select name="role" value={filters.role} onChange={handleFilter} className="input text-sm">
              <option value="">Todos</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Estado</Label>
            <select name="status" value={filters.status} onChange={handleFilter} className="input text-sm">
              <option value="">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
          <button
            onClick={() => setFilters(EMPTY_FILTERS)}
            disabled={!hasFilters}
            className="btn-secondary flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaRedo size={12} />
            Limpiar
          </button>
        </div>
      </div>

      {loadError ? (
        <div className="card flex flex-col items-center py-12 text-center">
          <FaExclamationCircle size={28} className="mb-3 text-icsi-primary" />
          <p className="font-semibold text-icsi-titleform">{loadError}</p>
          <button onClick={reload} className="btn-secondary mt-4">Reintentar</button>
        </div>
      ) : (
        <UsersTable
          users={filtered}
          currentUid={user?.uid}
          loading={loading}
          onChangeRole={setRoleTarget}
          onToggleActive={setActiveTarget}
          onResetPassword={setPassTarget}
        />
      )}

      {/* Modales (con key para que cada apertura empiece con datos frescos) */}
      <UserCreateModal key={`create-${createKey}`} isOpen={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />
      <UserRoleModal
        key={`role-${roleTarget?.uid}`}
        isOpen={Boolean(roleTarget)}
        user={roleTarget}
        onClose={() => setRoleTarget(null)}
        onSave={handleSetRole}
      />
      <UserActiveModal
        key={`active-${activeTarget?.uid}`}
        isOpen={Boolean(activeTarget)}
        user={activeTarget}
        onClose={() => setActiveTarget(null)}
        onConfirm={handleSetActive}
      />
      <UserPasswordModal
        key={`pass-${passTarget?.uid}`}
        isOpen={Boolean(passTarget)}
        user={passTarget}
        onClose={() => setPassTarget(null)}
        onConfirm={handleResetPassword}
      />
    </div>
  );
};

export default Personal;