// src/pages/inventario/components/EquipoTable.jsx
import { FaEdit, FaTrash, FaImage } from 'react-icons/fa';

const EquipoTable = ({ equipos, onEdit, onDelete, onViewImage, loading }) => {
  const getEstadoBadge = (estado) => {
    const colors = {
      nuevo: 'bg-green-100 text-green-800',
      usado: 'bg-yellow-100 text-yellow-800',
      dañado: 'bg-red-100 text-red-800',
      'en reparación': 'bg-orange-100 text-orange-800'
    };
    return colors[estado?.toLowerCase()] || 'bg-gray-100 text-gray-800';
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
        <table className="w-full">
          <thead className="bg-icsi-background">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Serial
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Estado Físico
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Ubicación
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Observaciones
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
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-mono font-medium text-icsi-titleform">
                    {eq.serial}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {eq.tipo}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getEstadoBadge(eq.estado)}`}>
                    {eq.estado}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-icsi-text">{eq.ubicacion || '-'}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-icsi-text max-w-xs truncate">
                    {eq.observaciones || '-'}
                  </div>
                </td>
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
      
      <div className="px-4 py-3 border-t border-icsi-border bg-icsi-background">
        <p className="text-sm text-icsi-text">
          Mostrando {equipos.length} equipo(s)
        </p>
      </div>
    </div>
  );
};

export default EquipoTable;