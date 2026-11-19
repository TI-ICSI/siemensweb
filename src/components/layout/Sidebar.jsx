// src/components/layout/Sidebar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaChartPie,
  FaClipboardList,
  FaFileAlt,
  FaUsers,
  FaUserCircle,
  FaSignOutAlt,
  FaTimes,
} from 'react-icons/fa';
import { LogoutConfirmModal } from '../ConfirmModal';
import sisHeader from '../../assets/sis-header.png';
import sisIcon from '../../assets/sis-icon.png';

// Menú agrupado. "match" decide cuándo el elemento se marca como activo
// (por ejemplo, el detalle /inventario/:id mantiene activo "Inventarios").
const MENU = [
  {
    title: 'Principal',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: FaChartPie, match: (p) => p === '/dashboard' },
      { to: '/inventarios', label: 'Inventarios', icon: FaClipboardList, match: (p) => p.startsWith('/inventario') },
      { to: '/reportes', label: 'Reportes', icon: FaFileAlt, match: (p) => p.startsWith('/reportes') },
    ],
  },
  {
    title: 'Administración',
    items: [
      { to: '/personal', label: 'Personal', icon: FaUsers, match: (p) => p.startsWith('/personal') },
    ],
  },
  {
    title: 'Cuenta',
    items: [
      { to: '/perfil', label: 'Perfil', icon: FaUserCircle, match: (p) => p.startsWith('/perfil') },
    ],
  },
];

// "open" / "onClose": menú deslizable en móvil.
// "collapsed": modo compacto (solo iconos), solo en escritorio.
// El botón que lo activa vive en el header (AppLayout).
const Sidebar = ({ user, onLogout, open, onClose, collapsed }) => {
  const { pathname } = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const name = user?.displayName || 'Administrador';
  const initial = name.charAt(0).toUpperCase();

  // Clases que solo aplican en escritorio (lg) cuando está contraída
  const hideWhenCollapsed = collapsed ? 'lg:hidden' : '';
  const centerWhenCollapsed = collapsed ? 'lg:justify-center lg:px-0' : '';

  const handleLogout = async () => {
    setLoggingOut(true);
    await onLogout();
    // Al cerrar sesión App cambia a las rutas públicas y este componente se desmonta
    setLoggingOut(false);
    setShowLogoutModal(false);
  };

  return (
    <>
      {/* Fondo oscuro (solo móvil, con el menú abierto) */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-icsi-border bg-white transition-[transform,width] duration-200 lg:translate-x-0 ${
          collapsed ? 'lg:w-[72px]' : 'lg:w-64'
        } ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className={`flex h-16 shrink-0 items-center justify-between px-5 ${centerWhenCollapsed}`}>
          <Link to="/dashboard">
            {/* Logo completo (siempre en móvil; en escritorio si está expandida) */}
            <img src={sisHeader} alt="S.I.S" className={`h-9 w-auto ${hideWhenCollapsed}`} />
            {/* Solo el icono, cuando está contraída en escritorio */}
            <img
              src={sisIcon}
              alt="S.I.S"
              className={`hidden h-9 w-auto ${collapsed ? 'lg:block' : ''}`}
            />
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-icsi-textLight hover:bg-icsi-background lg:hidden"
            aria-label="Cerrar menú"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
          {MENU.map((group, index) => (
            <div key={group.title} className="mb-6">
              {/* Contraída: el título del grupo se cambia por una línea separadora */}
              <p
                className={`mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-icsi-textLight ${hideWhenCollapsed}`}
              >
                {group.title}
              </p>
              {index > 0 && (
                <div className={`mx-2 mb-3 hidden border-t border-icsi-border ${collapsed ? 'lg:block' : ''}`} />
              )}

              <ul className="space-y-1">
                {group.items.map(({ to, label, icon: Icon, match }) => {
                  const active = match(pathname);
                  return (
                    <li key={to}>
                      <Link
                        to={to}
                        title={collapsed ? label : undefined}
                        className={`flex items-center gap-3 rounded-icsi px-3 py-2.5 text-sm transition-colors ${centerWhenCollapsed} ${
                          active
                            ? 'bg-icsi-primary/10 font-semibold text-icsi-primary'
                            : 'font-medium text-icsi-text hover:bg-icsi-background hover:text-icsi-titleform'
                        }`}
                      >
                        <Icon size={16} className="shrink-0" />
                        <span className={hideWhenCollapsed}>{label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Usuario y cerrar sesión (abajo) */}
        <div className="shrink-0 border-t border-icsi-border p-3">
          <div
            className={`mb-2 flex items-center gap-3 px-2 py-2 ${centerWhenCollapsed}`}
            title={collapsed ? `${name} · ${user?.email || ''}` : undefined}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-icsi-primary/10 text-sm font-bold text-icsi-primary">
              {initial}
            </div>
            <div className={`min-w-0 ${hideWhenCollapsed}`}>
              <p className="truncate text-sm font-semibold text-icsi-titleform">{name}</p>
              <p className="truncate text-xs text-icsi-textLight">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            title={collapsed ? 'Cerrar sesión' : undefined}
            className={`flex w-full items-center gap-3 rounded-icsi px-3 py-2.5 text-sm font-medium text-icsi-text transition-colors hover:bg-red-50 hover:text-red-600 ${centerWhenCollapsed}`}
          >
            <FaSignOutAlt size={16} className="shrink-0" />
            <span className={hideWhenCollapsed}>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        loading={loggingOut}
      />
    </>
  );
};

export default Sidebar;