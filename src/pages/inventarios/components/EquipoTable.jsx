// src/pages/inventarios/components/EquipoTable.jsx
import {  FaImage, FaChevronRight } from 'react-icons/fa';
import { getEstadoInfo, getEsquemaBadge, getThumb } from '../constants/equipo';
import { EquipoLoading, EquipoEmpty } from './EquipoStates';

const Th = ({ children, className = '' }) => (
  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-icsi-textLight ${className}`}>
    {children}
  </th>
);

// Vista de filas: miniatura pequeña, fila clickeable (abre el detalle)
const EquipoTable = ({ equipos, onOpen, loading }) => {
  if (loading) return <EquipoLoading />;
  if (equipos.length === 0) return <EquipoEmpty />;

  return (
    <div className="card overflow-hidden !p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px]">
          <thead className="border-b border-icsi-border bg-icsi-background/60">
            <tr>
              <Th className="pl-6">Equipo</Th>
              <Th>Imagen</Th>
              <Th>Perfil</Th>
              <Th>Ubicación</Th>
              <Th>Estado</Th>
              <Th>Esquema</Th>
              <Th>Observaciones</Th>
              <Th className="w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-icsi-border">
            {equipos.map((eq) => {
              const thumb = getThumb(eq);
              const estado = getEstadoInfo(eq.estado);
              return (
                <tr
                  key={eq.id}
                  onClick={() => onOpen(eq)}
                  onKeyDown={(e) => e.key === 'Enter' && onOpen(eq)}
                  tabIndex={0}
                  role="button"
                  className="group cursor-pointer transition-colors hover:bg-icsi-background/60 focus:bg-icsi-background/60 focus:outline-none"
                >
                  <td className="whitespace-nowrap py-2.5 pl-6 pr-4 font-mono text-sm font-semibold text-icsi-titleform">
                    {eq.serial}
                  </td>

                  {/* Miniatura (pequeña, carga diferida) */}
                  <td className="px-4 py-2.5">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-10 w-14 rounded-md border border-icsi-border bg-icsi-background object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-14 items-center justify-center rounded-md border border-dashed border-icsi-border text-icsi-textLight">
                        <FaImage size={14} />
                      </div>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-4 py-2.5 text-sm text-icsi-text">{eq.perfil || '—'}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-sm text-icsi-text">{eq.ubicacion || '—'}</td>

                  <td className="whitespace-nowrap px-4 py-2.5">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${estado.badge}`}>
                      {estado.label}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-4 py-2.5">
                    {eq.esquema ? (
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getEsquemaBadge(eq.esquema)}`}>
                        {eq.esquema}
                      </span>
                    ) : (
                      <span className="text-sm text-icsi-textLight">—</span>
                    )}
                  </td>

                  <td className="px-4 py-2.5">
                    <p className="max-w-[200px] truncate text-sm text-icsi-text" title={eq.observaciones}>
                      {eq.observaciones || '—'}
                    </p>
                  </td>


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
          Mostrando <span className="font-semibold">{equipos.length}</span>{' '}
          {equipos.length === 1 ? 'equipo' : 'equipos'}
        </p>
      </div>
    </div>
  );
};

export default EquipoTable;