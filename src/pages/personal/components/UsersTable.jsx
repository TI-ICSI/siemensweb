// src/pages/personal/components/UsersTable.jsx
import { FaUserTag, FaUserSlash, FaUserCheck, FaUsers } from 'react-icons/fa';
import { getRole } from '../constants/roles';

const formatDate = (date) =>
  date ? date.toLocaleDateString('es-MX', { dateStyle: 'medium' }) : '—';

const Th = ({ children, className = '' }) => (
  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-icsi-textLight ${className}`}>
    {children}
  </th>
);

const UsersTable = ({ users, currentUid, loading, onChangeRole, onToggleActive }) => {
  if (loading) {
    return (
      <div className="card py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-icsi-primary border-t-transparent" />
        <p className="mt-3 text-icsi-text">Cargando usuarios...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="card flex flex-col items-center py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-icsi-primary/10 text-icsi-primary">
          <FaUsers size={24} />
        </div>
        <h3 className="font-semibold text-icsi-titleform">No hay usuarios</h3>
        <p className="mt-1 text-sm text-icsi-text">Ningún usuario coincide con los filtros.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden !p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="border-b border-icsi-border bg-icsi-background/60">
            <tr>
              <Th className="pl-6">Usuario</Th>
              <Th>Rol</Th>
              <Th>Estado</Th>
              <Th>Creado</Th>
              <Th className="pr-6 text-right">Acciones</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-icsi-border">
            {users.map((u) => {
              const role = getRole(u.role);
              const isSelf = u.uid === currentUid;
              return (
                <tr key={u.uid} className={u.active ? '' : 'bg-icsi-background/40'}>
                  <td className="py-3 pl-6 pr-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${
                          u.active ? 'bg-icsi-primary/10 text-icsi-primary' : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {u.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className={`truncate font-semibold ${u.active ? 'text-icsi-titleform' : 'text-icsi-textLight'}`}>
                          {u.displayName}
                          {isSelf && (
                            <span className="ml-2 rounded-full bg-icsi-background px-2 py-0.5 text-xs font-medium text-icsi-text">
                              Tú
                            </span>
                          )}
                        </p>
                        <p className="truncate text-sm text-icsi-text">{u.email || '—'}</p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${role.badge}`}>
                      {role.label}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                        u.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${u.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {u.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-sm text-icsi-text">{formatDate(u.createdAt)}</td>

                  <td className="whitespace-nowrap py-3 pl-4 pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onChangeRole(u)}
                        disabled={isSelf}
                        className="rounded-lg p-2 text-amber-600 transition-colors hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                        title={isSelf ? 'No puedes cambiar tu propio rol' : 'Cambiar rol'}
                      >
                        <FaUserTag size={15} />
                      </button>
                      <button
                        onClick={() => onToggleActive(u)}
                        disabled={isSelf}
                        className={`rounded-lg p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent ${
                          u.active ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={
                          isSelf
                            ? 'No puedes desactivar tu propia cuenta'
                            : u.active
                              ? 'Desactivar cuenta'
                              : 'Reactivar cuenta'
                        }
                      >
                        {u.active ? <FaUserSlash size={16} /> : <FaUserCheck size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-icsi-border bg-icsi-background/60 px-6 py-3">
        <p className="text-sm text-icsi-text">
          Mostrando <span className="font-semibold">{users.length}</span>{' '}
          {users.length === 1 ? 'usuario' : 'usuarios'}
        </p>
      </div>
    </div>
  );
};

export default UsersTable;