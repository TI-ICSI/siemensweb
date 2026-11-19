// src/pages/perfil/Perfil.jsx
import { FaUserCircle } from 'react-icons/fa';

// Marcador de posición: se construye en la Parte 5
const Perfil = () => (
  <div>
    <h2 className="text-2xl font-bold text-icsi-titleform">Perfil</h2>
    <p className="mt-1 text-icsi-text">Consulta los datos de tu cuenta</p>

    <div className="card mt-8 flex flex-col items-center py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-icsi-primary/10 text-icsi-primary">
        <FaUserCircle size={26} />
      </div>
      <h3 className="font-semibold text-icsi-titleform">Próximamente</h3>
      <p className="mt-1 max-w-sm text-sm text-icsi-text">
        Aquí podrás ver tus datos y cambiar tu contraseña.
      </p>
    </div>
  </div>
);

export default Perfil;