// src/pages/reportes/Reportes.jsx
import { useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import DashboardHeader from '../dashboard/components/DashboardHeader';
import InventorySelector from './components/InventorySelector';
import EquiposTable from './components/EquiposTable';
import useReportes from './hooks/useReportes';
import useDashboardData from '../dashboard/hooks/useDashboardData';

const Reportes = () => {
  const { userName, userEmail } = useDashboardData();
  const {
    inventarios,
    selectedInventarios,
    equipos,
    loading,
    loadingInventarios,
    filters,
    setFilters,
    toggleInventario,
    selectAllInventarios,
    clearSelection,
    loadInventarios,
    loadEquiposFromInventarios
  } = useReportes();

  // Cargar inventarios al montar
  useEffect(() => {
    loadInventarios();
  }, [loadInventarios]);

  // Cargar equipos cuando cambia la selección
  useEffect(() => {
    if (selectedInventarios.length > 0) {
      loadEquiposFromInventarios(selectedInventarios);
    }
  }, [selectedInventarios, loadEquiposFromInventarios]);

  return (
    <div className="min-h-screen bg-icsi-background">
      <DashboardHeader userName={userName} userEmail={userEmail} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-icsi-titleform">
            Reporte de Equipos
          </h2>
          <p className="text-icsi-text mt-1">
            Selecciona uno o más inventarios para visualizar los equipos
          </p>
        </div>

        {/* Selector de inventarios */}
        <div className="mb-6">
          <InventorySelector
            inventarios={inventarios}
            selectedInventarios={selectedInventarios}
            onToggle={toggleInventario}
            onSelectAll={selectAllInventarios}
            onClear={clearSelection}
            loading={loadingInventarios}
          />
        </div>

        {/* Barra de búsqueda */}
        {selectedInventarios.length > 0 && equipos.length > 0 && (
          <div className="mb-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-icsi-textLight" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Buscar por número de serie..."
                className="w-full pl-10 pr-4 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
              />
            </div>
          </div>
        )}

        {/* Tabla de resultados */}
        <EquiposTable
          equipos={equipos}
          loading={loading}
          selectedCount={selectedInventarios.length}
        />
      </main>
    </div>
  );
};

export default Reportes;