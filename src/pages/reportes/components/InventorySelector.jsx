// src/pages/reportes/components/InventorySelector.jsx
import { useMemo, useState } from 'react';
import { FaCheck, FaClipboardList, FaDesktop, FaMapMarkerAlt, FaFilter } from 'react-icons/fa';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const norm = (v) => String(v ?? '').trim().toLowerCase();

// Casilla activable
const Check = ({ checked, onChange, label, count }) => (
  <label className="flex cursor-pointer items-center gap-2.5 rounded-icsi px-2 py-1.5 text-sm transition-colors hover:bg-icsi-background">
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    <span
      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border transition-colors ${
        checked ? 'border-icsi-primary bg-icsi-primary text-white' : 'border-gray-300 bg-white text-transparent'
      }`}
    >
      <FaCheck size={9} />
    </span>
    <span className={`min-w-0 flex-1 truncate ${checked ? 'font-semibold text-icsi-titleform' : 'text-icsi-text'}`}>
      {label}
    </span>
    {count !== undefined && <span className="text-xs text-icsi-textLight">{count}</span>}
  </label>
);

const Group = ({ title, selected, children }) => (
  <div>
    <div className="mb-1.5 flex items-center justify-between px-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-icsi-textLight">{title}</h4>
      {selected > 0 && (
        <span className="rounded-full bg-icsi-primary/10 px-2 py-0.5 text-xs font-semibold text-icsi-primary">
          {selected}
        </span>
      )}
    </div>
    {children}
  </div>
);

const toggleIn = (setter) => (value) =>
  setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

const InventorySelector = ({
  inventarios,
  selectedInventarios,
  onToggle,
  onSelectAll,
  onClear,
  loading
}) => {
  const [anios, setAnios] = useState([]);
  const [meses, setMeses] = useState([]);
  const [inmuebles, setInmuebles] = useState([]);

  // Opciones tomadas de los datos reales
  const aniosOpts = useMemo(
    () => [...new Set(inventarios.map((i) => i.anio).filter(Boolean))].sort((a, b) => b - a),
    [inventarios]
  );
  const inmueblesOpts = useMemo(
    () => [...new Set(inventarios.map((i) => i.localidad).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es')),
    [inventarios]
  );

  const totalFiltros = anios.length + meses.length + inmuebles.length;
  const hayFiltro = totalFiltros > 0;

  // Dentro de un grupo es "o"; entre grupos es "y". Sin filtros no se muestra nada.
  const visibles = useMemo(() => {
    if (!hayFiltro) return [];
    return inventarios.filter((inv) => {
      if (anios.length && !anios.includes(String(inv.anio))) return false;
      if (meses.length && !meses.some((m) => norm(m) === norm(inv.mes))) return false;
      if (inmuebles.length && !inmuebles.includes(inv.localidad)) return false;
      return true;
    });
  }, [inventarios, anios, meses, inmuebles, hayFiltro]);

  const limpiarFiltros = () => {
    setAnios([]);
    setMeses([]);
    setInmuebles([]);
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-1/4 rounded bg-gray-200" />
          <div className="h-40 rounded-icsi bg-gray-100" />
        </div>
      </div>
    );
  }

  if (inventarios.length === 0) {
    return (
      <div className="card flex flex-col items-center py-14 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-icsi-primary/10 text-icsi-primary">
          <FaClipboardList size={24} />
        </div>
        <h3 className="font-semibold text-icsi-titleform">No hay inventarios</h3>
        <p className="mt-1 text-sm text-icsi-text">Todavía no se ha registrado ningún inventario.</p>
      </div>
    );
  }

  const visiblesSeleccionados = visibles.filter((i) => selectedInventarios.includes(i.id)).length;

  return (
    <div className="card !p-0 overflow-hidden">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-icsi-border p-5">
        <div>
          <h3 className="text-lg font-bold text-icsi-titleform">Consultar inventarios</h3>
          <p className="text-sm text-icsi-text">Activa filtros a la izquierda y marca los inventarios que quieras juntar</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSelectAll(visibles.map((inv) => inv.id))}
            disabled={visibles.length === 0}
            className="btn-secondary !px-3 !py-2 text-sm disabled:opacity-40"
          >
            Seleccionar visibles ({visibles.length})
          </button>
          <button
            onClick={onClear}
            disabled={selectedInventarios.length === 0}
            className="btn-secondary !px-3 !py-2 text-sm disabled:opacity-40"
          >
            Limpiar selección
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
        {/* IZQUIERDA: filtros */}
        <aside className="border-b border-icsi-border bg-icsi-background/40 p-4 md:border-b-0 md:border-r">
          <div className="mb-3 flex items-center justify-between px-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-icsi-titleform">
              <FaFilter size={12} className="text-icsi-primary" /> Filtros
            </span>
            <button
              onClick={limpiarFiltros}
              disabled={!hayFiltro}
              className="text-xs font-semibold text-icsi-primary hover:underline disabled:cursor-not-allowed disabled:text-icsi-textLight disabled:no-underline"
            >
              Limpiar filtros
            </button>
          </div>

          <div className="max-h-[26rem] space-y-4 overflow-y-auto pr-1">
            <Group title="Año" selected={anios.length}>
              {aniosOpts.map((a) => (
                <Check
                  key={a}
                  label={String(a)}
                  checked={anios.includes(String(a))}
                  onChange={() => toggleIn(setAnios)(String(a))}
                />
              ))}
            </Group>

            <Group title="Mes" selected={meses.length}>
              <div className="grid grid-cols-2 gap-x-1">
                {MESES.map((m) => (
                  <Check
                    key={m}
                    label={m}
                    checked={meses.includes(m)}
                    onChange={() => toggleIn(setMeses)(m)}
                  />
                ))}
              </div>
            </Group>

            <Group title="Inmueble" selected={inmuebles.length}>
              {inmueblesOpts.map((l) => (
                <Check
                  key={l}
                  label={l}
                  checked={inmuebles.includes(l)}
                  onChange={() => toggleIn(setInmuebles)(l)}
                />
              ))}
            </Group>
          </div>
        </aside>

        {/* DERECHA: inventarios que cumplen los filtros */}
        <section className="flex min-h-[18rem] flex-col">
          <div className="max-h-[26rem] flex-1 overflow-y-auto p-5">
            {!hayFiltro ? (
              <div className="flex h-full min-h-[14rem] flex-col items-center justify-center text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-icsi-primary/10 text-icsi-primary">
                  <FaFilter size={18} />
                </div>
                <p className="font-semibold text-icsi-titleform">Elige uno o más filtros</p>
                <p className="mt-1 max-w-xs text-sm text-icsi-text">
                  Los inventarios irán apareciendo aquí conforme palomees año, mes o inmueble.
                </p>
              </div>
            ) : visibles.length === 0 ? (
              <div className="flex h-full min-h-[14rem] items-center justify-center text-center">
                <p className="text-sm text-icsi-text">Ningún inventario coincide con esos filtros.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                {visibles.map((inv) => {
                  const isSelected = selectedInventarios.includes(inv.id);
                  return (
                    <button
                      key={inv.id}
                      onClick={() => onToggle(inv.id)}
                      aria-pressed={isSelected}
                      className={`flex items-start gap-3 rounded-icsi-lg border p-3.5 text-left transition-all ${
                        isSelected
                          ? 'border-icsi-primary bg-icsi-primary/5 ring-4 ring-icsi-primary/10'
                          : 'border-icsi-border hover:border-icsi-primary/50 hover:bg-icsi-background'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                          isSelected
                            ? 'border-icsi-primary bg-icsi-primary text-white'
                            : 'border-icsi-border bg-white text-transparent'
                        }`}
                      >
                        <FaCheck size={10} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-icsi-titleform">
                          {inv.mes} {inv.anio}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-icsi-text">
                          <FaMapMarkerAlt size={11} className="shrink-0 text-icsi-textLight" />
                          <span className="truncate">
                            {inv.localidad}
                            {inv.estado ? `, ${inv.estado}` : ''}
                          </span>
                        </p>
                      </div>

                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-icsi-background px-2.5 py-1 text-xs font-semibold text-icsi-text">
                        <FaDesktop size={11} className="text-icsi-textLight" />
                        {inv.totalEquipos || 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pie */}
          <div className="border-t border-icsi-border bg-icsi-background/60 px-5 py-3">
            <p className="text-sm text-icsi-text">
              <span className="font-semibold text-icsi-titleform">{selectedInventarios.length}</span> inventarios
              seleccionados para el reporte
              {hayFiltro && (
                <span className="text-icsi-textLight">
                  {' '}· mostrando {visibles.length} ({visiblesSeleccionados} marcados)
                </span>
              )}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InventorySelector;