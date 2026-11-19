// src/pages/personal/Personal.jsx
import { FaUsers } from 'react-icons/fa';

// Marcador de posición: se construye en la Parte 6
const Personal = () => (
  <div>
    <h2 className="text-2xl font-bold text-icsi-titleform">Personal</h2>
    <p className="mt-1 text-icsi-text">Administra las cuentas de administradores y técnicos</p>

    <div className="card mt-8 flex flex-col items-center py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-icsi-primary/10 text-icsi-primary">
        <FaUsers size={24} />
      </div>
      <h3 className="font-semibold text-icsi-titleform">Próximamente</h3>
      <p className="mt-1 max-w-sm text-sm text-icsi-text">
        Aquí podrás crear cuentas de administrador y técnico, cambiar roles y desactivar usuarios.
      </p>
    </div>
  </div>
);

export default Personal;