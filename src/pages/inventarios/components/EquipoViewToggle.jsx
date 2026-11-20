// src/pages/inventarios/components/EquipoViewToggle.jsx
import { FaThLarge, FaList } from 'react-icons/fa';

const OPTIONS = [
  { value: 'cards', label: 'Tarjetas', Icon: FaThLarge },
  { value: 'table', label: 'Filas', Icon: FaList },
];

// Selector segmentado: tarjetas o filas
const EquipoViewToggle = ({ value, onChange }) => (
  <div className="inline-flex rounded-icsi border border-icsi-border bg-white p-0.5" role="group" aria-label="Tipo de vista">
    {OPTIONS.map(({ value: v, label, Icon }) => (
      <button
        key={v}
        type="button"
        onClick={() => onChange(v)}
        aria-pressed={value === v}
        title={`Vista de ${label.toLowerCase()}`}
        className={`flex items-center gap-2 rounded-[0.6rem] px-3 py-1.5 text-sm font-medium transition-colors ${
          value === v
            ? 'bg-icsi-primary text-white shadow-icsi'
            : 'text-icsi-text hover:bg-icsi-background'
        }`}
      >
        <Icon size={13} />
        <span className="hidden sm:inline">{label}</span>
      </button>
    ))}
  </div>
);

export default EquipoViewToggle;