// src/pages/inventarios/components/InventoryTable.jsx
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaClock,
  FaChevronRight,
  FaClipboardList,
} from 'react-icons/fa';

const STATUS = {
  activo: { bg: 'bg-green-100', text: 'text-green-700', Icon: FaCheckCircle, label: 'Activo' },
  completado: { bg: 'bg-blue-100', text: 'text-blue-700', Icon: FaCheckCircle, label: 'Completado' },
  en_progreso: { bg: 'bg-yellow-100', text: 'text-yellow-700', Icon: FaClock, label: 'En progreso' },
};

const formatDate = (date) => (date ? date.toLocaleDateString('es-MX') : '');

const Th = ({ children, className = '' }) => (
  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-icsi-textLight ${className}`}>
    {children}
  </th>
);

const InventoryTable = ({ inventories, onViewDetails, loading }) => {
  if (loading) {
    return (
      <div className="card py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-icsi-primary border-t-transparent" />
        <p className="mt-3 text-icsi-text">Cargando inventarios...</p>
      </div>
    );
  }

  if (inventories.length === 0) {
    return (
      <div className="card flex flex-col items-center py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-icsi-primary/10 text-icsi-primary">
          <FaClipboardList size={24} />
        </div>
        <h3 className="font-semibold text-icsi-titleform">No hay inventarios</h3>
        <p className="mt-1 text-sm text-icsi-text">No se encontraron inventarios con los filtros seleccionados.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden !p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="border-b border-icsi-border bg-icsi-background/60">
            <tr>
              <Th className="pl-6">Inmueble</Th>
              <Th>Período</Th>
              <Th>Equipos</Th>
              <Th>Estado</Th>
              <Th>Creado por</Th>
              <Th>Estatus</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-icsi-border">
            {inventories.map((inv) => {
              const s = STATUS[inv.status?.toLowerCase()] || STATUS.activo;
              const creator = inv.createdByName || '—';
              return (
                <tr
                  key={inv.id}
                  onClick={() => onViewDetails(inv.id)}
                  onKeyDown={(e) => e.key === 'Enter' && onViewDetails(inv.id)}
                  tabIndex={0}
                  role="link"
                  className="group cursor-pointer transition-colors hover:bg-icsi-background/60 focus:bg-icsi-background/60 focus:outline-none"
                >
                  {/* Inmueble */}
                  <td className="whitespace-nowrap py-4 pl-6 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-icsi bg-icsi-primary/10 text-icsi-primary">
                        <FaBuilding size={16} />
                      </div>
                      <span className="text-sm font-semibold text-icsi-titleform">{inv.localidad || '—'}</span>
                    </div>
                  </td>

                  {/* Período */}
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-icsi-text">
                    {inv.mes} {inv.anio}
                  </td>

                  {/* Equipos */}
                  <td className="whitespace-nowrap px-4 py-4">
                    <span className="inline-flex min-w-[2.5rem] justify-center rounded-full bg-icsi-primary/10 px-2.5 py-1 text-sm font-semibold text-icsi-primary">
                      {(inv.totalEquipos || 0).toLocaleString()}
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="whitespace-nowrap px-4 py-4">
                    {inv.estado ? (
                      <span className="inline-flex items-center gap-1.5 text-sm text-icsi-text">
                        <FaMapMarkerAlt size={12} className="text-icsi-textLight" />
                        {inv.estado}
                      </span>
                    ) : (
                      <span className="text-sm text-icsi-textLight">—</span>
                    )}
                  </td>

                  {/* Creado por */}
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-icsi-background text-xs font-bold text-icsi-text">
                        {creator.charAt(0).toUpperCase()}
                      </div>
                      <div className="leading-tight">
                        <p className="text-sm text-icsi-titleform">{creator}</p>
                        <p className="text-xs text-icsi-textLight">{formatDate(inv.createdAt)}</p>
                      </div>
                    </div>
                  </td>

                  {/* Estatus */}
                  <td className="whitespace-nowrap px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${s.bg} ${s.text}`}
                    >
                      <s.Icon size={11} />
                      {s.label}
                    </span>
                  </td>

                  {/* Indicador de que la fila es clickeable */}
                  <td className="pr-4 text-icsi-textLight transition-transform group-hover:translate-x-0.5 group-hover:text-icsi-primary">
                    <FaChevronRight size={12} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-icsi-border bg-icsi-background/60 px-6 py-3">
        <p className="text-sm text-icsi-text">
          Mostrando <span className="font-semibold">{inventories.length}</span>{' '}
          {inventories.length === 1 ? 'inventario' : 'inventarios'}
        </p>
      </div>
    </div>
  );
};

export default InventoryTable;