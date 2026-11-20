// src/pages/inventarios/constants/equipo.js
// Catálogos y utilidades de equipos, compartidos por la tabla, las tarjetas,
// los filtros, el formulario y el modal de detalle.

export const PERFILES = ['Standard', 'Workstation', 'Ejecutiva', 'Mini', 'Tower'];

export const ESQUEMAS = ['CaaS', 'Activo Fijo'];

// "value" es lo que se guarda en Firebase; "label" lo que se muestra
export const ESTADOS = [
  { value: 'baja', label: 'Baja', badge: 'bg-red-100 text-red-700' },
  { value: 'danado_destruccion', label: 'Dañado Destrucción', badge: 'bg-red-100 text-red-700' },
  { value: 'donacion', label: 'Donación', badge: 'bg-purple-100 text-purple-700' },
  { value: 'reparacion', label: 'En Reparación', badge: 'bg-orange-100 text-orange-700' },
  { value: 'nuevo', label: 'Nuevo', badge: 'bg-green-100 text-green-700' },
  { value: 'renovado', label: 'Renovado', badge: 'bg-blue-100 text-blue-700' },
  { value: 'venta', label: 'Venta', badge: 'bg-yellow-100 text-yellow-700' },
  { value: 'usado_garantia', label: 'Usado con Garantía', badge: 'bg-indigo-100 text-indigo-700' },
  { value: 'usado_sin_garantia', label: 'Usado Sin Garantía', badge: 'bg-fuchsia-100 text-fuchsia-700' },
];

export const OBSERVACIONES = [
  'Etiqueta Dañada',
  'No carga imagen de Siemens',
  'No esta en AMTO',
  'No se puede instalar sistema operativo',
  'No tiene acciones en myIT',
  'Obtener Hash',
  'Sin caja',
  'Sin Cargador',
  'Sin Cargador y Sin Caja',
  'Sin etiqueta',
  'Sin imagen',
  'Otro',
];

// Datos de presentación de un estado (con valor de respaldo si es desconocido)
export const getEstadoInfo = (value) =>
  ESTADOS.find((e) => e.value === String(value || '').toLowerCase()) || {
    value,
    label: value || '—',
    badge: 'bg-gray-100 text-gray-700',
  };

export const getEsquemaBadge = (esquema) =>
  ({
    'Activo Fijo': 'bg-blue-100 text-blue-700',
    CaaS: 'bg-emerald-100 text-emerald-700',
  }[esquema] || 'bg-gray-100 text-gray-700');

// Imagen pequeña para listas: usa la miniatura si existe y, si no, la foto completa
export const getThumb = (equipo) => equipo?.thumbUrl || equipo?.imagenUrl || '';

// Fecha desde un Date, un Timestamp de Firestore o nada
export const formatDateTime = (value) => {
  const date = value?.toDate ? value.toDate() : value instanceof Date ? value : null;
  return date && !isNaN(date)
    ? date.toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })
    : '';
};