// src/pages/dashboard/Dashboard.jsx
import { useNavigate } from 'react-router-dom';
import { FaBoxes, FaClipboardList, FaSpinner } from 'react-icons/fa';
import StatsCard from './components/StatsCard';
import MonthlyEquiposChart from './components/MonthlyEquiposChart';
import RecentInventoryTable from './components/RecentInventoryTable';
import useDashboardData from './hooks/useDashboardData';

const Dashboard = () => {
  const navigate = useNavigate();
  const { userName, stats, monthlyAll, monthly12, recent, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <FaSpinner className="mx-auto mb-4 animate-spin text-4xl text-icsi-primary" />
          <p className="text-icsi-text">Cargando panel de control...</p>
        </div>
      </div>
    );
  }

  // Últimos 6 meses para las minigráficas de las tarjetas
  const last6 = monthly12.slice(-6);
  const firstName = userName.trim().split(' ')[0];

  return (
    <div>
      {/* Bienvenida */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-icsi-titleform">
          ¡Bienvenido{firstName ? `, ${firstName}` : ''}!
        </h2>
        <p className="mt-1 text-icsi-text">Aquí tienes un resumen de tus inventarios y estadísticas</p>
      </div>

      {/* Métricas */}
      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <StatsCard
          id="inventarios"
          title="Total Inventarios"
          value={stats.totalInventories.toLocaleString()}
          icon={<FaClipboardList size={24} />}
          tone="red"
          trend={stats.inventariosTrend.trend}
          trendText={stats.inventariosTrend.text}
          spark={last6.map((m) => m.inventarios)}
        />
        <StatsCard
          id="equipos"
          title="Equipos Registrados"
          value={stats.totalEquipos.toLocaleString()}
          icon={<FaBoxes size={24} />}
          tone="blue"
          trend={stats.equiposTrend.trend}
          trendText={stats.equiposTrend.text}
          subtitle={`${stats.promedioEquipos} equipos por inventario en promedio`}
          spark={last6.map((m) => m.total)}
        />
      </div>

      {/* Gráfica mensual + inventarios recientes */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <MonthlyEquiposChart data12={monthly12} dataAll={monthlyAll} />
        </div>
        <div className="xl:col-span-3">
          <RecentInventoryTable
            inventories={recent}
            onViewDetails={(id) => navigate(`/inventario/${id}`)}
            onViewAll={() => navigate('/inventarios')}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;