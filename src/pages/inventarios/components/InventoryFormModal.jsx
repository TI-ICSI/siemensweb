// src/pages/inventarios/components/InventoryFormModal.jsx
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const estadosMexico = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua',
  'Ciudad de México', 'Coahuila', 'Colima', 'Durango', 'Estado de México', 'Guanajuato', 'Guerrero',
  'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla',
  'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas',
  'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
];

const InventoryFormModal = ({ isOpen, onClose, onSave, inventory, loading }) => {
  // Inicializar el estado directamente con los valores de inventory o valores por defecto
  const [formData, setFormData] = useState(() => {
    if (inventory) {
      return {
        anio: inventory.anio || new Date().getFullYear(),
        mes: inventory.mes || '',
        localidad: inventory.localidad || '',
        estado: inventory.estado || '',
        ubicacion: inventory.ubicacion || '',
        status: inventory.status || 'activo'
      };
    }
    return {
      anio: new Date().getFullYear(),
      mes: '',
      localidad: '',
      estado: '',
      ubicacion: '',
      status: 'activo'
    };
  });

  // Actualizar el formulario cuando cambia el inventory (sin useEffect)
  // Usamos una key en el componente padre para forzar el re-render

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-icsi-lg shadow-xl max-w-2xl w-full transform transition-all animate-fade-in">
          
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-icsi-border">
            <h3 className="text-xl font-semibold text-icsi-titleform">
              {inventory ? '✏️ Editar Inventario' : '➕ Nuevo Inventario'}
            </h3>
            <button
              onClick={onClose}
              className="text-icsi-textLight hover:text-icsi-primary transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>
          
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Año */}
              <div>
                <label className="block text-sm font-medium text-icsi-titleform mb-2">
                  Año *
                </label>
                <input
                  type="number"
                  value={formData.anio}
                  onChange={(e) => setFormData({...formData, anio: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
                  required
                  min="2020"
                  max="2030"
                />
              </div>

              {/* Mes */}
              <div>
                <label className="block text-sm font-medium text-icsi-titleform mb-2">
                  Mes *
                </label>
                <select
                  value={formData.mes}
                  onChange={(e) => setFormData({...formData, mes: e.target.value})}
                  className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
                  required
                >
                  <option value="">Seleccionar mes</option>
                  {meses.map(mes => (
                    <option key={mes} value={mes}>{mes}</option>
                  ))}
                </select>
              </div>

              {/* Localidad */}
              <div>
                <label className="block text-sm font-medium text-icsi-titleform mb-2">
                  Localidad *
                </label>
                <input
                  type="text"
                  value={formData.localidad}
                  onChange={(e) => setFormData({...formData, localidad: e.target.value})}
                  className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
                  placeholder="Ej: Santa Catarina"
                  required
                />
              </div>

              {/* Estado de la república */}
              <div>
                <label className="block text-sm font-medium text-icsi-titleform mb-2">
                  Estado *
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
                  required
                >
                  <option value="">Seleccionar estado</option>
                  {estadosMexico.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>

              {/* Ubicación específica */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-icsi-titleform mb-2">
                  Ubicación específica
                </label>
                <input
                  type="text"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                  className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
                  placeholder="Ej: Planta baja, bodega norte, etc."
                />
              </div>

              {/* Estado del inventario */}
              <div>
                <label className="block text-sm font-medium text-icsi-titleform mb-2">
                  Estado del Inventario
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
                >
                  <option value="activo">Activo</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="completado">Completado</option>
                </select>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-icsi-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-icsi-text rounded-icsi hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-icsi-primary text-white rounded-icsi hover:bg-icsi-hover transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  inventory ? 'Actualizar' : 'Crear Inventario'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InventoryFormModal;