// src/pages/reportes/components/EquiposTable.jsx
import { useState } from 'react';
import { FaClipboardList, FaDesktop, FaSearch } from 'react-icons/fa';

const PAGE_SIZE = 100;

const Empty = ({ Icon, title, children }) => (
  <div className="card flex flex-col items-center py-14 text-center">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-icsi-primary/10 text-icsi-primary">
      <Icon size={24} />
    </div>
    <h3 className="font-semibold text-icsi-titleform">{title}</h3>
    <p className="mt-1 max-w-sm text-sm text-icsi-text">{children}</p>
  </div>
);

const Th = ({ children, className = '' }) => (
  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-icsi-textLight ${className}`}>
    {children}
  </th>
);

const EquiposTable = ({ equipos, loading, selectedCount, searching = false }) => {
  const [limit, setLimit] = useState(PAGE_SIZE);

  if (loading) {
    return (
      <div className="card py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-icsi-primary border-t-transparent" />
        <p className="mt-3 text-icsi-text">Cargando equipos...</p>
      </div>
    );
  }

  if (selectedCount === 0) {
    return (
      <Empty Icon={FaClipboardList} title="Selecciona inventarios">
        Marca uno o más inventarios arriba para ver sus equipos y exportarlos a Excel.
      </Empty>
    );
  }

  if (equipos.length === 0) {
    return searching ? (
      <Empty Icon={FaSearch} title="Sin resultados">
        Ningún equipo coincide con ese número de serie.
      </Empty>
    ) : (
      <Empty Icon={FaDesktop} title="No hay equipos">
        Los inventarios seleccionados no tienen equipos registrados.
      </Empty>
    );
  }

  const shown = equipos.slice(0, limit);

  return (
    <div className="card !p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead className="border-b border-icsi-border bg-icsi-background/60">
            <tr>
              <Th className="pl-6">Número de serie</Th>
              <Th>Perfil</Th>
              <Th>Ubicación específica</Th>
              <Th>Inventario</Th>
              <Th className="pr-6">Localidad</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-icsi-border">
            {shown.map((eq) => (
              <tr key={`${eq.inventarioId}-${eq.id}`} className="transition-colors hover:bg-icsi-background/60">
                <td className="whitespace-nowrap py-3 pl-6 pr-4 font-mono text-sm font-semibold text-icsi-titleform">
                  {eq.serial}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="inline-flex rounded-full bg-icsi-background px-2.5 py-1 text-xs font-medium text-icsi-text">
                    {eq.perfil || '—'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-icsi-text">{eq.ubicacion || '—'}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-icsi-text">{eq.inventarioNombre}</td>
                <td className="whitespace-nowrap py-3 pl-4 pr-6 text-sm text-icsi-text">{eq.inventarioLocalidad || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-icsi-border bg-icsi-background/60 px-6 py-3">
        <p className="text-sm text-icsi-text">
          Mostrando <span className="font-semibold">{shown.length}</span> de{' '}
          <span className="font-semibold">{equipos.length}</span> equipos
        </p>
        {shown.length < equipos.length && (
          <button
            onClick={() => setLimit((l) => l + PAGE_SIZE)}
            className="btn-secondary !px-3 !py-1.5 text-sm"
          >
            Mostrar {Math.min(PAGE_SIZE, equipos.length - shown.length)} más
          </button>
        )}
      </div>
    </div>
  );
};

export default EquiposTable;