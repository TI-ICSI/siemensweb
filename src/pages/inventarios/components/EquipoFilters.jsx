// src/pages/inventario/components/EquipoFilters.jsx
import { FaSearch, FaRedo } from 'react-icons/fa';

// Opciones para los filtros
const perfiles = ["Standard", "Workstation", "Ejecutiva", "Mini", "Tower"];

const estados = [
  "Baja",
  "Dañado Destrucción",
  "Donación",
  "En Reparación",
  "Nuevo",
  "Renovado",
  "Venta",
  "Usado con Garantía",
  "Usado Sin Garantía",
];

// Mapeo de valores mostrados a valores internos de Firebase
const estadoMap = {
  "Baja": "baja",
  "Dañado Destrucción": "danado_destruccion",
  "Donación": "donacion",
  "En Reparación": "reparacion",
  "Nuevo": "nuevo",
  "Renovado": "renovado",
  "Venta": "venta",
  "Usado con Garantía": "usado_garantia",
  "Usado Sin Garantía": "usado_sin_garantia",
};

const EquipoFilters = ({ filters, setFilters, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Manejador especial para el estado (convierte el valor mostrado a interno)
  const handleEstadoChange = (e) => {
    const valorMostrado = e.target.value;
    const valorInterno = estadoMap[valorMostrado] || '';
    setFilters(prev => ({ 
      ...prev, 
      estado: valorInterno,
      estadoMostrado: valorMostrado 
    }));
  };

  // Obtener el valor mostrado actual del estado
  const getEstadoMostrado = () => {
    const estadoInterno = filters.estado || '';
    const entrada = Object.entries(estadoMap).find(([ val]) => val === estadoInterno);
    return entrada ? entrada[0] : filters.estadoMostrado || '';
  };

  return (
    <div className="bg-white border border-icsi-border rounded-icsi-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-icsi-titleform">Filtros de equipos</h3>
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-icsi-text hover:text-icsi-primary transition-colors"
        >
          <FaRedo size={14} />
          Limpiar filtros
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Búsqueda general */}
        <div>
          <label className="block text-sm font-medium text-icsi-titleform mb-2">
            <FaSearch className="inline mr-1" size={12} />
            Buscar
          </label>
          <input
            type="text"
            name="busqueda"
            value={filters.busqueda || ''}
            onChange={handleChange}
            placeholder="Serial, perfil o ubicación..."
            className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
          />
        </div>

        {/* Filtro por Perfil */}
        <div>
          <label className="block text-sm font-medium text-icsi-titleform mb-2">
            Perfil
          </label>
          <select
            name="perfil"
            value={filters.perfil || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
          >
            <option value="">Todos</option>
            {perfiles.map(perfil => (
              <option key={perfil} value={perfil}>{perfil}</option>
            ))}
          </select>
        </div>

        {/* Filtro por Estado */}
        <div>
          <label className="block text-sm font-medium text-icsi-titleform mb-2">
            Estado
          </label>
          <select
            name="estado"
            value={getEstadoMostrado()}
            onChange={handleEstadoChange}
            className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
          >
            <option value="">Todos</option>
            {estados.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default EquipoFilters;