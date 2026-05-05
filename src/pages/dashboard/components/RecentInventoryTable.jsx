// src/pages/dashboard/components/RecentInventoryTable.jsx
import { FaSearch, FaEye } from 'react-icons/fa';

const RecentInventoryTable = ({ inventories, onViewDetails }) => {
  // Función para obtener el color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'en_progreso':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white border border-icsi-border rounded-icsi-lg overflow-hidden">
      <div className="p-6 border-b border-icsi-border">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-icsi-titleform">
            📋 Inventarios Recientes
          </h3>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-icsi-textLight" />
            <input
              type="text"
              placeholder="Buscar inventario..."
              className="pl-10 pr-4 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
            />
          </div>
        </div>
      </div>

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
                Total Equipos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-icsi-border">
            {inventories.map((inv) => (
              <tr key={inv.id} className="hover:bg-icsi-background/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-icsi-titleform">
                  {inv.anio} - {inv.mes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-icsi-text">
                  {inv.localidad}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-icsi-text">
                  {inv.estado}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-icsi-primary">
                  {inv.totalEquipos}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-icsi-text">
                  {new Date(inv.createdAt?.toDate()).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(inv.status || 'completado')}`}>
                    {inv.status || 'Completado'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => onViewDetails(inv.id)}
                    className="text-icsi-primary hover:text-icsi-hover transition-colors flex items-center gap-1"
                  >
                    <FaEye size={14} />
                    Ver detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {inventories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-icsi-text">No hay inventarios registrados</p>
        </div>
      )}
    </div>
  );
};

export default RecentInventoryTable;