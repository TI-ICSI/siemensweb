// src/pages/reportes/Reportes.jsx
import { useEffect } from 'react';
import { FaSearch, FaFileExcel, FaChartBar, FaClipboardList, FaDesktop } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import InventorySelector from './components/InventorySelector';
import EquiposTable from './components/EquiposTable';
import useReportes from './hooks/useReportes';

const Stat = ({ Icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-icsi-lg border border-icsi-border px-4 py-2.5">
    <div className="flex h-10 w-10 items-center justify-center rounded-icsi bg-icsi-primary/10 text-icsi-primary">
      <Icon size={16} />
    </div>
    <div>
      <p className="text-xl font-bold leading-none text-icsi-titleform">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-icsi-textLight">{label}</p>
    </div>
  </div>
);

const Reportes = () => {
  const {
    inventarios,
    selectedInventarios,
    equipos,
    allEquipos,
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

  // Cargar equipos cuando cambia la selección (también cuando queda vacía)
  useEffect(() => {
    loadEquiposFromInventarios(selectedInventarios);
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

    // Ajustar el ancho de las columnas
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

  const hasSelection = selectedInventarios.length > 0;
  const searching = Boolean(filters.search);

  return (
    <div>
      {/* Encabezado */}
      <div className="card relative mb-6 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-1.5 bg-icsi-primary" />
        <div className="flex items-center gap-4 pl-2">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-icsi-lg bg-icsi-primary/10 text-icsi-primary">
            <FaChartBar size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-icsi-titleform">Reportes</h2>
            <p className="mt-1 text-icsi-text">Junta uno o más inventarios, consulta sus equipos y expórtalos a Excel</p>
          </div>
        </div>
      </div>

      {/* Paso 1: elegir inventarios */}
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

      {/* Paso 2: resumen, búsqueda y exportar */}
      {hasSelection && (
        <div className="card mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <Stat Icon={FaClipboardList} label="Inventarios" value={selectedInventarios.length} />
            <Stat Icon={FaDesktop} label="Equipos" value={loading ? '…' : allEquipos.length} />

            <div className="relative min-w-[220px] flex-1">
              <FaSearch size={13} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-icsi-textLight" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Buscar por número de serie..."
                className="input pl-9 text-sm"
              />
            </div>

            <button
              onClick={exportToExcel}
              disabled={loading || equipos.length === 0}
              className={`inline-flex items-center justify-center gap-2 rounded-icsi px-5 py-2.5 text-sm font-semibold transition-colors ${
                loading || equipos.length === 0
                  ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <FaFileExcel size={15} />
              Exportar a Excel ({equipos.length})
            </button>
          </div>
        </div>
      )}

      {/* Resultados (key: al cambiar la selección o la búsqueda vuelve a la primera página) */}
      <EquiposTable
        key={`${selectedInventarios.join(',')}|${filters.search}`}
        equipos={equipos}
        loading={loading}
        selectedCount={selectedInventarios.length}
        searching={searching}
      />
    </div>
  );
};

export default Reportes;