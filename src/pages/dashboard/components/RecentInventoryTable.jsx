// src/pages/dashboard/components/RecentInventoryTable.jsx
import { FaCheckCircle, FaClock, FaChevronRight, FaArrowRight } from 'react-icons/fa';

const STATUS = {
  activo: { bg: 'bg-green-100', text: 'text-green-700', Icon: FaCheckCircle, label: 'Activo' },
  completado: { bg: 'bg-blue-100', text: 'text-blue-700', Icon: FaCheckCircle, label: 'Completado' },
  en_progreso: { bg: 'bg-yellow-100', text: 'text-yellow-700', Icon: FaClock, label: 'En progreso' },
};

const formatDate = (value) => {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  return date && !isNaN(date) ? date.toLocaleDateString('es-MX') : '—';
};

const RecentInventoryTable = ({ inventories, onViewDetails, onViewAll }) => (
  <div className="card h-full !p-0 overflow-hidden">
    <div className="flex items-center justify-between px-6 py-5">
      <h3 className="text-lg font-semibold text-icsi-titleform">Inventarios recientes</h3>
      <button
        onClick={onViewAll}
        className="flex items-center gap-1.5 text-sm font-medium text-icsi-primary hover:underline"
      >
        Ver todos <FaArrowRight size={11} />
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-y border-icsi-border bg-icsi-background/60">
          <tr className="text-left text-xs font-semibold uppercase tracking-wider text-icsi-textLight">
            <th className="px-6 py-3">Período</th>
            <th className="px-3 py-3">Inmueble</th>
            <th className="px-3 py-3 text-right">Equipos</th>
            <th className="px-3 py-3">Fecha</th>
            <th className="px-3 py-3">Estatus</th>
            <th className="w-8 px-3 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-icsi-border">
          {inventories.map((inv) => {
            const s = STATUS[inv.status?.toLowerCase()] || STATUS.activo;
            return (
              <tr
                key={inv.id}
                onClick={() => onViewDetails(inv.id)}
                className="cursor-pointer transition-colors hover:bg-icsi-background/60"
              >
                <td className="whitespace-nowrap px-6 py-3.5 text-sm font-semibold text-icsi-titleform">
                  {inv.mes} {inv.anio}
                </td>
                <td className="px-3 py-3.5 text-sm">
                  <p className="text-icsi-titleform">{inv.localidad}</p>
                  <p className="text-xs text-icsi-textLight">{inv.estado}</p>
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-right text-sm font-semibold text-icsi-primary">
                  {(inv.totalEquipos || 0).toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-sm text-icsi-text">
                  {formatDate(inv.createdAt)}
                </td>
                <td className="whitespace-nowrap px-3 py-3.5">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${s.bg} ${s.text}`}
                  >
                    <s.Icon size={11} />
                    {s.label}
                  </span>
                </td>
                <td className="px-3 py-3.5 text-icsi-textLight">
                  <FaChevronRight size={11} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    {inventories.length === 0 && (
      <div className="py-12 text-center text-sm text-icsi-text">No hay inventarios registrados</div>
    )}
  </div>
);

export default RecentInventoryTable;