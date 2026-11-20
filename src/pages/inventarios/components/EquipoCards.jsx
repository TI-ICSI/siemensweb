// src/pages/inventarios/components/EquipoCards.jsx
import { FaEdit, FaTrash, FaImage } from 'react-icons/fa';
import { getEstadoInfo, getEsquemaBadge, getThumb } from '../constants/equipo';
import { EquipoLoading, EquipoEmpty } from './EquipoStates';

// Vista de tarjetas: foto grande, datos principales y acciones
const EquipoCards = ({ equipos, onOpen, onEdit, onDelete, loading }) => {
  if (loading) return <EquipoLoading />;
  if (equipos.length === 0) return <EquipoEmpty />;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {equipos.map((eq) => {
          const thumb = getThumb(eq);
          const estado = getEstadoInfo(eq.estado);
          return (
            <div
              key={eq.id}
              onClick={() => onOpen(eq)}
              onKeyDown={(e) => e.key === 'Enter' && onOpen(eq)}
              tabIndex={0}
              role="button"
              className="group card cursor-pointer overflow-hidden !p-0 transition-shadow hover:shadow-icsi-lg focus:outline-none focus:ring-4 focus:ring-icsi-primary/10"
            >
              {/* Foto */}
              <div className="relative aspect-[4/3] bg-icsi-background">
                {thumb ? (
                  <img
                    src={thumb}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-icsi-textLight">
                    <FaImage size={22} />
                    <span className="text-xs">Sin imagen</span>
                  </div>
                )}
                <span
                  className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-semibold shadow-icsi ${estado.badge}`}
                >
                  {estado.label}
                </span>
              </div>

              {/* Datos */}
              <div className="p-3">
                <p className="truncate font-mono text-sm font-bold text-icsi-titleform">{eq.serial}</p>
                <p className="mt-0.5 truncate text-xs text-icsi-text">{eq.perfil || '—'}</p>
                <p className="truncate text-[11px] text-icsi-textLight">{eq.ubicacion || 'Sin ubicación'}</p>

                <div className="mt-2 flex items-center justify-between gap-1">
                  {eq.esquema ? (
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${getEsquemaBadge(eq.esquema)}`}>
                      {eq.esquema}
                    </span>
                  ) : (
                    <span />
                  )}
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(eq); }}
                      className="rounded-md bg-amber-50 p-1.5 text-amber-600 transition-colors hover:bg-amber-100"
                      title="Editar"
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(eq); }}
                      className="rounded-md bg-red-50 p-1.5 text-red-600 transition-colors hover:bg-red-100"
                      title="Eliminar"
                    >
                      <FaTrash size={11} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-icsi-text">
        Mostrando <span className="font-semibold">{equipos.length}</span>{' '}
        {equipos.length === 1 ? 'equipo' : 'equipos'}
      </p>
    </div>
  );
};

export default EquipoCards;