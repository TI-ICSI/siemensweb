// src/App.jsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/login/login';
import Dashboard from './pages/dashboard/Dashboard';
import Inventarios from './pages/inventarios/Inventarios';
import InventarioDetalle from './pages/inventarios/InventarioDetalle';
import Reportes from './pages/reportes/Reportes';
import Personal from './pages/personal/Personal';
import Perfil from './pages/perfil/Perfil';

function App() {
  const { user, isAdmin, loading, logout } = useAuth();
  const allowed = !!user && isAdmin;

  // Si hay una sesión abierta de alguien que no es admin (por ejemplo, una
  // sesión anterior), se cierra para que no quede "colgada" en el login.
  useEffect(() => {
    if (user && !isAdmin) logout();
  }, [user, isAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-icsi-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-icsi-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-icsi-text">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {!allowed ? (
          // Rutas públicas
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          // Rutas del panel: todas dentro del layout con barra lateral
          <>
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route element={<AppLayout user={user} onLogout={logout} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventarios" element={<Inventarios />} />
              <Route path="/inventario/:id" element={<InventarioDetalle />} />
              <Route path="/reportes" element={<Reportes />} />
              <Route path="/personal" element={<Personal />} />
              <Route path="/perfil" element={<Perfil />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;