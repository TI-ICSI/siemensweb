// src/pages/inventarios/components/EquipoDetailModal.jsx
import { useEffect } from 'react';
import { FaTimes, FaEdit, FaTrash, FaImage, FaSearchPlus } from 'react-icons/fa';
import { getEstadoInfo, getEsquemaBadge, formatDateTime } from '../constants/equipo';

const Field = ({ label, children }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wider text-icsi-textLight">{label}</p>
    <div className="mt-1 text-sm text-icsi-titleform">{children || <span className="text-icsi-textLight">—</span>}</div>
  </div>
);

// Información del equipo: datos a la izquierda y foto a la derecha
const EquipoDetailModal = ({ isOpen, equipo, onClose, onEdit, onDelete, onViewImage }) => {
  // Cerrar con Esc
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !equipo) return null;

  const estado = getEstadoInfo(equipo.estado);
  const updated = formatDateTime(equipo.updatedAt);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl overflow-hidden rounded-icsi-lg bg-white shadow-icsi-lg">
          {/* Encabezado */}
          <div className="flex items-center justify-between border-b border-icsi-border px-6 py-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-icsi-textLight">Equipo</p>
              <h3 className="truncate font-mono text-xl font-bold text-icsi-titleform">{equipo.serial}</h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-icsi-textLight transition-colors hover:bg-icsi-background hover:text-icsi-primary"
              aria-label="Cerrar"
            >
              <FaTimes size={18} />
            </button>
          </div>

          <div className="grid max-h-[calc(100vh-14rem)] grid-cols-1 gap-6 overflow-y-auto p-6 md:grid-cols-2">
            {/* Información (izquierda) */}
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${estado.badge}`}>{estado.label}</span>
                {equipo.esquema && (
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getEsquemaBadge(equipo.esquema)}`}>
                    {equipo.esquema}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-5">
                <Field label="Perfil">{equipo.perfil}</Field>
                <Field label="Ubicación física">{equipo.ubicacion}</Field>
              </div>

              <Field label="Observaciones">{equipo.observaciones}</Field>
              <Field label="Nota">
                {equipo.nota && <p className="whitespace-pre-wrap">{equipo.nota}</p>}
              </Field>

              <div className="border-t border-icsi-border pt-4">
                <div className="grid grid-cols-2 gap-5">
                  <Field label="Registrado por">
                    {equipo.createdByName || equipo.createdBy}
                  </Field>
                  <Field label="Fecha de registro">{formatDateTime(equipo.createdAt)}</Field>
                </div>
                {updated && (
                  <p className="mt-4 text-xs text-icsi-textLight">
                    Última actualización: {updated}
                    {equipo.updatedBy ? ` · ${equipo.updatedBy}` : ''}
                  </p>
                )}
              </div>
            </div>

            {/* Imagen (derecha) */}
            <div>
              {equipo.imagenUrl ? (
                <button
                  type="button"
                  onClick={() => onViewImage(equipo.imagenUrl)}
                  className="group relative block w-full overflow-hidden rounded-icsi-lg border border-icsi-border bg-icsi-background"
                  title="Ver imagen completa"
                >
                  <img src={equipo.imagenUrl} alt={equipo.serial} className="aspect-[4/3] w-full object-cover" />
                  <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-lg bg-black/55 text-white transition-colors group-hover:bg-black/75">
                    <FaSearchPlus size={14} />
                  </span>
                </button>
              ) : (
                <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-icsi-lg border border-dashed border-icsi-border bg-icsi-background text-icsi-textLight">
                  <FaImage size={32} />
                  <span className="text-sm">Sin imagen</span>
                </div>
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-wrap justify-end gap-3 border-t border-icsi-border bg-icsi-background/60 px-6 py-4">
            <button
              onClick={() => onDelete(equipo)}
              className="mr-auto flex items-center gap-2 rounded-icsi border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              <FaTrash size={13} />
              Eliminar
            </button>
            <button onClick={onClose} className="btn-secondary">Cerrar</button>
            <button onClick={() => onEdit(equipo)} className="btn-primary">
              <FaEdit size={14} />
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipoDetailModal;