// src/pages/inventario/components/EquipoTable.jsx
import { FaEdit, FaTrash, FaImage } from 'react-icons/fa';

const EquipoTable = ({ equipos, onEdit, onDelete, onViewImage, loading }) => {
  
  // Colores para los diferentes estados (mapeo de valores internos a display)
  const getEstadoBadge = (estado) => {
    const colors = {
      baja: 'bg-red-100 text-red-800',
      danado_destruccion: 'bg-red-100 text-red-800',
      donacion: 'bg-purple-100 text-purple-800',
      reparacion: 'bg-orange-100 text-orange-800',
      nuevo: 'bg-green-100 text-green-800',
      renovado: 'bg-blue-100 text-blue-800',
      venta: 'bg-yellow-100 text-yellow-800',
      usado_garantia: 'bg-indigo-100 text-indigo-800',
      usado_sin_garantia: 'bg-fuchsia-100 text-fuchsia-800',
    };
    return colors[estado?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  // Mostrar texto amigable para el estado
  const getEstadoTexto = (estado) => {
    const textos = {
      baja: 'Baja',
      danado_destruccion: 'Dañado Destrucción',
      donacion: 'Donación',
      reparacion: 'En Reparación',
      nuevo: 'Nuevo',
      renovado: 'Renovado',
      venta: 'Venta',
      usado_garantia: 'Usado con Garantía',
      usado_sin_garantia: 'Usado Sin Garantía',
    };
    return textos[estado?.toLowerCase()] || estado || '-';
  };

  // Colores para perfiles
  {/*const getPerfilBadge = (perfil) => {
    const colors = {
      Standard: 'bg-gray-100 text-gray-800',
      Workstation: 'bg-blue-100 text-blue-800',
      Ejecutiva: 'bg-purple-100 text-purple-800',
      Mini: 'bg-green-100 text-green-800',
      Tower: 'bg-orange-100 text-orange-800',
    };
    return colors[perfil] || 'bg-gray-100 text-gray-800';
  };*/}

  // Colores para esquemas
  const getEsquemaBadge = (esquema) => {
    const colors = {
      'Activo Fijo': 'bg-blue-100 text-blue-800',
      CaaS: 'bg-green-100 text-green-800',
    };
    return colors[esquema] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="bg-white border border-icsi-border rounded-icsi-lg p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-icsi-primary border-t-transparent"></div>
        <p className="text-icsi-text mt-2">Cargando equipos...</p>
      </div>
    );
  }

  if (equipos.length === 0) {
    return (
      <div className="bg-white border border-icsi-border rounded-icsi-lg p-12 text-center">
        <div className="text-6xl mb-4">💻</div>
        <h3 className="text-xl font-semibold text-icsi-titleform mb-2">No hay equipos</h3>
        <p className="text-icsi-text">No se encontraron equipos en este inventario.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-icsi-border rounded-icsi-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-icsi-background">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Serial
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Perfil
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Ubicación
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Esquema
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Observaciones
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Nota
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-icsi-text uppercase tracking-wider">
                Imagen
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-icsi-text uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-icsi-border">
            {equipos.map((eq) => (
              <tr key={eq.id} className="hover:bg-icsi-background/50 transition-colors">
                {/* Serial */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-mono font-medium text-icsi-titleform">
                    {eq.serial}
                  </div>
                </td>
                
                {/* Perfil */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full" >
                    {eq.perfil || '-'}
                  </span>
                </td>
                
                {/* Ubicación física */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-icsi-text">{eq.ubicacion || '-'}</div>
                </td>
                
                {/* Estado */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getEstadoBadge(eq.estado)}`}>
                    {getEstadoTexto(eq.estado)}
                  </span>
                </td>
                
                {/* Esquema */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getEsquemaBadge(eq.esquema)}`}>
                    {eq.esquema || '-'}
                  </span>
                </td>
                
                {/* Observaciones */}
                <td className="px-4 py-3">
                  <div className="text-sm text-icsi-text max-w-[200px] truncate" title={eq.observaciones}>
                    {eq.observaciones || '-'}
                  </div>
                </td>
                
                {/* Nota */}
                <td className="px-4 py-3">
                  <div className="text-sm text-icsi-text max-w-[200px] truncate" title={eq.nota}>
                    {eq.nota || '-'}
                  </div>
                </td>
                
                {/* Imagen */}
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  {eq.imagenUrl && (
                    <button
                      onClick={() => onViewImage(eq.imagenUrl)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Ver imagen"
                    >
                      <FaImage size={18} />
                    </button>
                  )}
                </td>
                
                {/* Acciones */}
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(eq)}
                      className="text-yellow-600 hover:text-yellow-800 transition-colors"
                      title="Editar"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(eq)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Eliminar"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer con total de registros */}
      <div className="px-4 py-3 border-t border-icsi-border bg-icsi-background">
        <p className="text-sm text-icsi-text">
          Mostrando {equipos.length} equipo(s)
        </p>
      </div>
    </div>
  );
};

export default EquipoTable;