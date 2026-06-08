// src/pages/reportes/components/EquiposTable.jsx
import { FaSpinner } from 'react-icons/fa';

const EquiposTable = ({ equipos, loading, selectedCount }) => {
  if (loading) {
    return (
      <div className="bg-white border border-icsi-border rounded-icsi-lg p-12 text-center">
        <FaSpinner className="animate-spin text-4xl text-icsi-primary mx-auto mb-4" />
        <p className="text-icsi-text">Cargando equipos...</p>
      </div>
    );
  }

  if (selectedCount === 0) {
    return (
      <div className="bg-white border border-icsi-border rounded-icsi-lg p-12 text-center">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-icsi-titleform mb-2">
          Selecciona inventarios
        </h3>
        <p className="text-icsi-text">
          Selecciona uno o más inventarios para ver los equipos.
        </p>
      </div>
    );
  }

  if (equipos.length === 0) {
    return (
      <div className="bg-white border border-icsi-border rounded-icsi-lg p-12 text-center">
        <div className="text-6xl mb-4">💻</div>
        <h3 className="text-xl font-semibold text-icsi-titleform mb-2">
          No hay equipos
        </h3>
        <p className="text-icsi-text">
          Los inventarios seleccionados no tienen equipos registrados.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-icsi-border rounded-icsi-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-icsi-border bg-icsi-background">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-icsi-titleform">
            Resultados
          </h3>
          <p className="text-sm text-icsi-text">
            Mostrando {equipos.length} equipo(s)
          </p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-icsi-background">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Número de serie
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Perfil
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-icsi-text uppercase tracking-wider">
                Ubicación específica
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-icsi-border">
            {equipos.map((eq) => (
              <tr key={eq.id} className="hover:bg-icsi-background/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="text-sm font-mono font-medium text-icsi-titleform">
                    {eq.serial}
                  </div>
                  <div className="text-xs text-icsi-textLight mt-0.5">
                    📁 {eq.inventarioNombre}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                    {eq.perfil || '-'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-icsi-text">
                    {eq.ubicacion || '-'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EquiposTable;