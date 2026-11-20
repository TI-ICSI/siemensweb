// src/pages/inventarios/components/EquipoStates.jsx
import { FaDesktop } from 'react-icons/fa';

export const EquipoLoading = () => (
  <div className="card py-16 text-center">
    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-icsi-primary border-t-transparent" />
    <p className="mt-3 text-icsi-text">Cargando equipos...</p>
  </div>
);

export const EquipoEmpty = () => (
  <div className="card flex flex-col items-center py-16 text-center">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-icsi-primary/10 text-icsi-primary">
      <FaDesktop size={24} />
    </div>
    <h3 className="font-semibold text-icsi-titleform">No hay equipos</h3>
    <p className="mt-1 text-sm text-icsi-text">No se encontraron equipos en este inventario.</p>
  </div>
);