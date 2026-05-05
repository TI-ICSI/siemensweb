// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Login from './pages/login/Login';
//import AdminDashboard from './pages/dashboard/AdminDashboard'; // Lo haremos después

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F2F2F2'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #D91A2A',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/dashboard" />} 
        />
        {/*<Route 
          path="/dashboard" 
          element={user && isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} 
        />*/}
        <Route 
          path="/" 
          element={<Navigate to={user ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;