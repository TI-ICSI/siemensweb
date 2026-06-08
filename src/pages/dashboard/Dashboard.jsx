// src/pages/dashboard/Dashboard.jsx
import { useNavigate } from 'react-router-dom';
import DashboardHeader from './components/DashboardHeader';
import StatsCard from './components/StatsCard';
import RecentInventoryTable from './components/RecentInventoryTable';
import useDashboardData from './hooks/useDashboardData';
import { 
  FaBoxes, 
  FaCalendarAlt, 
  FaSpinner,
 
} from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    userName,
    userEmail,
    inventories,
    stats,
    loading,
  } = useDashboardData();

  const handleViewDetails = (inventoryId) => {
    navigate(`/inventario/${inventoryId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-icsi-background flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-icsi-primary mx-auto mb-4" />
          <p className="text-icsi-text">Cargando panel de control...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-icsi-background">
      <DashboardHeader userName={userName} userEmail={userEmail} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bienvenida */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-icsi-titleform">
            ¡Bienvenido, {userName}!
          </h2>
          <p className="text-icsi-text mt-1">
            Aquí tienes un resumen de los inventarios y estadísticas
          </p>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Inventarios"
            value={stats.totalInventories}
            icon={<FaCalendarAlt size={32} />}
            color="blue"
            trend="up"
            trendValue="+12% vs mes anterior"
          />
          <StatsCard
            title="Equipos Registrados"
            value={stats.totalEquipos.toLocaleString()}
            icon={<FaBoxes size={32} />}
            color="red"
            trend="up"
            trendValue={`+${stats.promedioEquipos} promedio`}
          />
          <button
            onClick={() => navigate('/inventarios')}
            className="bg-white border border-icsi-border rounded-icsi-lg p-6 text-center hover:shadow-icsi transition-all group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              📋
            </div>
            <h3 className="font-semibold text-icsi-titleform mb-1">
              Ver Todos los Inventarios
            </h3>
            <p className="text-sm text-icsi-text">
              Consulta y gestiona todos los inventarios
            </p>
          </button>

          <button
            onClick={() => navigate('/reportes')}
            className="bg-white border border-icsi-border rounded-icsi-lg p-6 text-center hover:shadow-icsi transition-all group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              📊
            </div>
            <h3 className="font-semibold text-icsi-titleform mb-1">
              Generar Reporte
            </h3>
            <p className="text-sm text-icsi-text">
               Puedes juntar la información de inventarios
            </p>
          </button>

        </div>

        {/* Tabla de inventarios recientes */}
        <RecentInventoryTable
          inventories={inventories}
          onViewDetails={handleViewDetails}
        />
      </main>
    </div>
  );
};

export default Dashboard;