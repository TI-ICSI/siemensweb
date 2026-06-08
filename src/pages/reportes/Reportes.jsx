// src/pages/reportes/Reportes.jsx
import { useEffect } from 'react';
import { FaSearch, FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
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

  // Función para exportar a Excel
  const exportToExcel = () => {
    if (equipos.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Preparar los datos para exportar (solo los campos solicitados)
    const datosExportar = equipos.map(eq => ({
      'Número de serie': eq.serial || '',
      Perfil: eq.perfil || '',
      'Ubicación específica': eq.ubicacion || '',
      'Inventario': eq.inventarioNombre || '',
      'Localidad': eq.inventarioLocalidad || '',
      'Estado': eq.inventarioEstado || ''
    }));

    // Crear hoja de trabajo
    const ws = XLSX.utils.json_to_sheet(datosExportar);
    
    // Ajustar el ancho de las columnas (opcional)
    ws['!cols'] = [
      { wch: 20 }, // Número de serie
      { wch: 15 }, // Perfil
      { wch: 25 }, // Ubicación específica
      { wch: 25 }, // Inventario
      { wch: 20 }, // Localidad
      { wch: 15 }  // Estado
    ];

    // Crear libro de trabajo
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte_Equipos');

    // Generar nombre de archivo con fecha
    const fecha = new Date();
    const nombreArchivo = `reporte_equipos_${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()}_${fecha.getHours()}-${fecha.getMinutes()}.xlsx`;
    
    // Descargar archivo
    XLSX.writeFile(wb, nombreArchivo);
  };

  // Obtener los nombres de los inventarios seleccionados para el resumen
  const getSelectedInventariosNombres = () => {
    const selected = inventarios.filter(inv => selectedInventarios.includes(inv.id));
    return selected.map(inv => `${inv.anio} - ${inv.mes} (${inv.localidad})`).join(', ');
  };

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

        {/* Barra de búsqueda y botón de exportar */}
        {selectedInventarios.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-icsi-textLight" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Buscar por número de serie..."
                  className="w-full pl-10 pr-4 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
                />
              </div>
              <button
                onClick={exportToExcel}
                disabled={equipos.length === 0}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-icsi transition-colors ${
                  equipos.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <FaFileExcel size={18} />
                Exportar a Excel ({equipos.length} equipos)
              </button>
            </div>
            
            {/* Mostrar resumen de inventarios seleccionados */}
            {selectedInventarios.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-icsi">
                <p className="text-sm text-blue-700">
                  <span className="font-semibold">📊 Resumen:</span> {selectedInventarios.length} inventario(s) seleccionado(s)
                </p>
                <p className="text-xs text-blue-600 mt-1 truncate">
                  {getSelectedInventariosNombres()}
                </p>
              </div>
            )}
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