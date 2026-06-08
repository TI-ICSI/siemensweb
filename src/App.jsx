// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Inventarios from './pages/inventarios/Inventarios';
import InventarioDetalle from './pages/inventarios/InventarioDetalle';
import Reportes from './pages/reportes/Reportes';


function App() {
  const { user, isAdmin, loading } = useAuth();

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

  if (!user || !isAdmin) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/dashboard" 
          element={user && isAdmin ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={user ? "/dashboard" : "/login"} />} 
        />
        <Route 
          path="/inventarios"
          element={<Inventarios />} 
        />
        <Route 
          path="/inventario/:id" 
          element={<InventarioDetalle />} 
        />
        <Route 
          path="/reportes" 
          element={<Reportes />} 
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;