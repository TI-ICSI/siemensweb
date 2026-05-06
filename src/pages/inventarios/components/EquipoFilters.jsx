// src/pages/inventario/components/EquipoFilters.jsx
import { FaSearch } from 'react-icons/fa';

const EquipoFilters = ({ filters, setFilters, tipos, estadosFisicos, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white border border-icsi-border rounded-icsi-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-icsi-titleform">Filtros de equipos</h3>
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-icsi-text hover:text-icsi-primary transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Limpiar filtros
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Búsqueda por serial */}
        <div>
          <label className="block text-sm font-medium text-icsi-titleform mb-2">
            <FaSearch className="inline mr-1" size={12} />
            Buscar
          </label>
          <input
            type="text"
            name="busqueda"
            value={filters.busqueda}
            onChange={handleChange}
            placeholder="Serial, tipo o ubicación..."
            className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
          />
        </div>

        {/* Filtro por tipo */}
        <div>
          <label className="block text-sm font-medium text-icsi-titleform mb-2">
            Tipo de equipo
          </label>
          <select
            name="tipo"
            value={filters.tipo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
          >
            <option value="">Todos</option>
            {tipos.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        {/* Filtro por estado físico */}
        <div>
          <label className="block text-sm font-medium text-icsi-titleform mb-2">
            Estado físico
          </label>
          <select
            name="estadoFisico"
            value={filters.estadoFisico}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
          >
            <option value="">Todos</option>
            {estadosFisicos.map(estado => (
              <option key={estado} value={estado}>
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default EquipoFilters;