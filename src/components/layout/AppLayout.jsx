// src/components/layout/AppLayout.jsx
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import Sidebar from './Sidebar';

const COLLAPSED_KEY = 'sis.sidebarCollapsed';

// Lee la preferencia guardada (puede fallar en modo privado o con datos bloqueados)
const readCollapsed = () => {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === '1';
  } catch {
    return false;
  }
};

// Estructura común de todas las pantallas internas: barra lateral + header + contenido.
// Cada página se dibuja dentro de <Outlet />.
const AppLayout = ({ user, onLogout }) => {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(readCollapsed); // modo compacto en escritorio

  // Cajón en móvil: se guarda la ruta en la que se abrió y se considera abierto
  // solo mientras sigas en ella. Al navegar a otra página se cierra solo,
  // sin necesidad de un efecto.
  const [menuPath, setMenuPath] = useState(null);
  const menuOpen = menuPath === pathname;

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSED_KEY, next ? '1' : '0');
      } catch {
        /* sin almacenamiento: solo se pierde la preferencia */
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-icsi-background">
      <Sidebar
        user={user}
        onLogout={onLogout}
        open={menuOpen}
        onClose={() => setMenuPath(null)}
        collapsed={collapsed}
      />

      <div
        className={`transition-[padding] duration-200 ${collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'}`}
      >
        {/* Header con el nombre de la app */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-icsi-border bg-white px-4 sm:px-6 lg:px-8">
          {/* Móvil: abre el menú. Escritorio: contrae o expande la barra lateral */}
          <button
            onClick={() => {
              if (window.matchMedia('(min-width: 1024px)').matches) toggleCollapsed();
              else setMenuPath(pathname);
            }}
            className="rounded-lg p-2 text-icsi-text transition-colors hover:bg-icsi-background hover:text-icsi-primary"
            aria-label="Mostrar u ocultar el menú"
            title="Menú"
          >
            <FaBars size={18} />
          </button>

          <div className="min-w-0 leading-tight">
            <h1 className="truncate text-base font-bold text-icsi-titleform sm:text-lg">
              <span className="ml-2 hidden font-medium text-icsi-text sm:inline">
                <span className="font-bold text-icsi-primary">S</span>istema de{' '}
                <span className="font-bold text-icsi-primary">I</span>nventarios{' '}
                <span className="font-bold text-icsi-primary">S</span>iemens
              </span>
            </h1>
            <p className="hidden text-xs text-icsi-textLight sm:block">Panel de administración</p>
          </div>
        </header>

        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;