// src/pages/reportes/components/InventorySelector.jsx
import { FaCheckSquare, FaSquare, FaCheckDouble, FaTrash } from 'react-icons/fa';

const InventorySelector = ({ 
  inventarios, 
  selectedInventarios, 
  onToggle, 
  onSelectAll, 
  onClear,
  loading 
}) => {
  if (loading) {
    return (
      <div className="bg-white border border-icsi-border rounded-icsi-lg p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (inventarios.length === 0) {
    return (
      <div className="bg-white border border-icsi-border rounded-icsi-lg p-12 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-icsi-titleform mb-2">
          No hay inventarios
        </h3>
        <p className="text-icsi-text">
          No se encontraron inventarios registrados.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-icsi-border rounded-icsi-lg overflow-hidden">
      {/* Header con acciones */}
      <div className="flex justify-between items-center p-4 border-b border-icsi-border bg-icsi-background">
        <h3 className="text-lg font-semibold text-icsi-titleform">
          Seleccionar Inventarios
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-icsi hover:bg-blue-100 transition-colors"
          >
            <FaCheckDouble size={14} />
            Seleccionar todos
          </button>
          <button
            onClick={onClear}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-icsi hover:bg-gray-200 transition-colors"
          >
            <FaTrash size={14} />
            Limpiar
          </button>
        </div>
      </div>
      
      {/* Lista de inventarios */}
      <div className="p-4 max-h-64 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {inventarios.map((inv) => {
            const isSelected = selectedInventarios.includes(inv.id);
            return (
              <button
                key={inv.id}
                onClick={() => onToggle(inv.id)}
                className={`flex items-center gap-3 p-3 rounded-icsi border transition-all text-left ${
                  isSelected
                    ? 'border-icsi-primary bg-icsi-primary/5'
                    : 'border-icsi-border hover:border-icsi-primary hover:bg-icsi-background'
                }`}
              >
                {isSelected ? (
                  <FaCheckSquare className="text-icsi-primary flex-shrink-0" size={20} />
                ) : (
                  <FaSquare className="text-icsi-textLight flex-shrink-0" size={20} />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-icsi-titleform truncate">
                    {inv.anio} - {inv.mes}
                  </p>
                  <p className="text-xs text-icsi-text truncate">
                    {inv.localidad}, {inv.estado}
                  </p>
                  <p className="text-xs text-icsi-textLight">
                    📊 {inv.totalEquipos || 0} equipos
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Resumen de selección */}
      <div className="p-3 border-t border-icsi-border bg-icsi-background">
        <p className="text-sm text-icsi-text">
          {selectedInventarios.length} de {inventarios.length} inventario(s) seleccionado(s)
        </p>
      </div>
    </div>
  );
};

export default InventorySelector;