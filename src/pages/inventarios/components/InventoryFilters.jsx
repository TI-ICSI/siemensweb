// src/pages/inventarios/components/InventoryFilters.jsx
import { FaRedo } from 'react-icons/fa';

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const InventoryFilters = ({ filters, setFilters, onReset, aniosDisponibles }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    onReset();
  };

  return (
    <div className="bg-white border border-icsi-border rounded-icsi-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-icsi-titleform">Filtros de búsqueda</h3>
        <button
          onClick={handleClearFilters}
          className="flex items-center gap-2 text-sm text-icsi-text hover:text-icsi-primary transition-colors"
        >
          <FaRedo size={14} />
          Limpiar filtros
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtro por año */}
        <div>
          <label className="block text-sm font-medium text-icsi-titleform mb-2">
            Año
          </label>
          <select
            name="anio"
            value={filters.anio}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
          >
            <option value="">Todos</option>
            {aniosDisponibles.map(anio => (
              <option key={anio} value={anio}>{anio}</option>
            ))}
          </select>
        </div>

        {/* Filtro por mes */}
        <div>
          <label className="block text-sm font-medium text-icsi-titleform mb-2">
            Mes
          </label>
          <select
            name="mes"
            value={filters.mes}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
          >
            <option value="">Todos</option>
            {meses.map(mes => (
              <option key={mes} value={mes}>{mes}</option>
            ))}
          </select>
        </div>

        {/* Filtro por localidad */}
        <div>
          <label className="block text-sm font-medium text-icsi-titleform mb-2">
            Localidad
          </label>
          <input
            type="text"
            name="localidad"
            value={filters.localidad}
            onChange={handleChange}
            placeholder="Buscar por localidad..."
            className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
          />
        </div>

        {/* Filtro por estado */}
        <div>
          <label className="block text-sm font-medium text-icsi-titleform mb-2">
            Estado
          </label>
          <select
            name="estado"
            value={filters.estado}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
          >
            <option value="">Todos</option>
            <option value="activo">Activo</option>
            <option value="completado">Completado</option>
            <option value="en_progreso">En Progreso</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default InventoryFilters;