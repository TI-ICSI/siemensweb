// src/pages/inventarios/components/InventoryFilters.jsx
import { FaRedo, FaSearch } from 'react-icons/fa';

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const Label = ({ children }) => (
  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-icsi-textLight">
    {children}
  </label>
);

const InventoryFilters = ({ filters, setFilters, onReset, aniosDisponibles }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="card mb-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto] lg:items-end">
        {/* Inmueble (búsqueda) */}
        <div>
          <Label>Inmueble</Label>
          <div className="relative">
            <FaSearch size={13} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-icsi-textLight" />
            <input
              type="text"
              name="localidad"
              value={filters.localidad}
              onChange={handleChange}
              placeholder="Buscar por inmueble..."
              className="input pl-9 text-sm"
            />
          </div>
        </div>

        {/* Año */}
        <div>
          <Label>Año</Label>
          <select name="anio" value={filters.anio} onChange={handleChange} className="input text-sm">
            <option value="">Todos</option>
            {aniosDisponibles.map((anio) => (
              <option key={anio} value={anio}>{anio}</option>
            ))}
          </select>
        </div>

        {/* Mes */}
        <div>
          <Label>Mes</Label>
          <select name="mes" value={filters.mes} onChange={handleChange} className="input text-sm">
            <option value="">Todos</option>
            {meses.map((mes) => (
              <option key={mes} value={mes}>{mes}</option>
            ))}
          </select>
        </div>

        {/* Estatus (antes decía "Estado", pero filtra por el estatus del inventario) */}
        <div>
          <Label>Estatus</Label>
          <select name="estado" value={filters.estado} onChange={handleChange} className="input text-sm">
            <option value="">Todos</option>
            <option value="activo">Activo</option>
            <option value="completado">Completado</option>
            <option value="en_progreso">En progreso</option>
          </select>
        </div>

        {/* Limpiar */}
        <button
          onClick={onReset}
          disabled={!hasFilters}
          className="btn-secondary flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FaRedo size={12} />
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default InventoryFilters;