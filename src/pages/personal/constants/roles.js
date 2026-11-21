// src/pages/personal/constants/roles.js
// "value" es lo que se guarda en Firebase (claim y users/{uid}.role)
export const ROLE_OPTIONS = [
  {
    value: 'admin',
    label: 'Administrador',
    desc: 'Administra el portal, los usuarios y los inventarios',
    badge: 'bg-icsi-primary/10 text-icsi-primary',
  },
  {
    value: 'tecnico',
    label: 'Técnico',
    desc: 'Trabaja en campo con la app de inventarios',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    value: 'user',
    label: 'Usuario',
    desc: 'Cuenta básica de la app',
    badge: 'bg-gray-100 text-gray-700',
  },
];

// Roles que se ofrecen al dar de alta una cuenta nueva
export const CREATE_ROLES = ROLE_OPTIONS.filter((r) => r.value !== 'user');

export const getRole = (value) => ROLE_OPTIONS.find((r) => r.value === value) || ROLE_OPTIONS[2];