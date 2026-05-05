// src/pages/inventarios/components/InventoryTable.jsx
import { FaEye, FaEdit, FaTrash, FaCheckCircle, FaClock } from 'react-icons/fa';

const InventoryTable = ({ inventories, onViewDetails, onEdit, onDelete, loading }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      activo: { bg: 'bg-green-100', text: 'text-green-800', icon: FaCheckCircle, label: 'Activo' },
      completado: { bg: 'bg-blue-100', text: 'text-blue-800', icon: FaCheckCircle, label: 'Completado' },
      en_progreso: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FaClock, label: 'En Progreso' }
    };
    
    const config = statusConfig[status?.toLowerCase()] || statusConfig.activo;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white border border-icsi-border rounded-icsi-lg p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-icsi-primary border-t-transparent"></div>
        <p className="text-icsi-text mt-2">Cargando inventarios...</p>
      </div>
    );
  }

  if (inventories.length === 0) {
    return (
      <div className="bg-white border border-icsi-border rounded-icsi-lg p-12 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-icsi-titleform mb-2">No hay inventarios</h3>
        <p className="text-icsi-text">No se encontraron inventarios con los filtros seleccionados.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-icsi-border rounded-icsi-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-icsi-background">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Período
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Localidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Equipos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Creado por
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Estatus
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-icsi-border">
            {inventories.map((inv) => (
              <tr key={inv.id} className="hover:bg-icsi-background/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-icsi-titleform">
                    {inv.anio} - {inv.mes}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-icsi-text">{inv.localidad}</div>
                  <div className="text-xs text-icsi-textLight">{inv.estado}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {inv.estado || '-'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-icsi-primary">
                    {inv.totalEquipos || 0}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-icsi-text">{inv.createdByName || '-'}</div>
                  <div className="text-xs text-icsi-textLight">
                    {inv.createdAt?.toLocaleDateString() || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(inv.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewDetails(inv.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Ver detalles"
                    >
                      <FaEye size={18} />
                    </button>
                    <button
                      onClick={() => onEdit(inv)}
                      className="text-yellow-600 hover:text-yellow-800 transition-colors"
                      title="Editar"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(inv)}
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
      <div className="px-6 py-3 border-t border-icsi-border bg-icsi-background">
        <p className="text-sm text-icsi-text">
          Mostrando {inventories.length} inventario(s)
        </p>
      </div>
    </div>
  );
};

export default InventoryTable;