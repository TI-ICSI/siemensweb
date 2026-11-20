// src/pages/inventarios/components/EquipoFilters.jsx
import { FaSearch, FaRedo } from 'react-icons/fa';
import { PERFILES, ESQUEMAS, ESTADOS } from '../constants/equipo';

const Label = ({ children }) => (
  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-icsi-textLight">
    {children}
  </label>
);

const EquipoFilters = ({ filters, setFilters, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="card mb-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_auto] lg:items-end">
        {/* Búsqueda general */}
        <div>
          <Label>Buscar</Label>
          <div className="relative">
            <FaSearch size={13} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-icsi-textLight" />
            <input
              type="text"
              name="busqueda"
              value={filters.busqueda || ''}
              onChange={handleChange}
              placeholder="Serial, perfil o ubicación..."
              className="input pl-9 text-sm"
            />
          </div>
        </div>

        {/* Perfil */}
        <div>
          <Label>Perfil</Label>
          <select name="perfil" value={filters.perfil || ''} onChange={handleChange} className="input text-sm">
            <option value="">Todos</option>
            {PERFILES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Estado (el valor es el que se guarda en Firebase) */}
        <div>
          <Label>Estado</Label>
          <select name="estado" value={filters.estado || ''} onChange={handleChange} className="input text-sm">
            <option value="">Todos</option>
            {ESTADOS.map((e) => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
        </div>

        {/* Esquema */}
        <div>
          <Label>Esquema</Label>
          <select name="esquema" value={filters.esquema || ''} onChange={handleChange} className="input text-sm">
            <option value="">Todos</option>
            {ESQUEMAS.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

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

export default EquipoFilters;