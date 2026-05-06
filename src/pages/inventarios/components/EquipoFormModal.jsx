// src/pages/inventario/components/EquipoFormModal.jsx
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const tiposEquipo = ['computadora', 'laptop', 'servidor', 'switch', 'router', 'monitor', 'impresora', 'otro'];
const estadosFisicos = ['nuevo', 'usado', 'dañado', 'en reparación'];

const EquipoFormModal = ({ isOpen, onClose, onSave, equipo, loading }) => {
  const [formData, setFormData] = useState(() => {
    if (equipo) {
      return {
        serial: equipo.serial || '',
        tipo: equipo.tipo || '',
        estado: equipo.estado || '',
        ubicacion: equipo.ubicacion || '',
        observaciones: equipo.observaciones || ''
      };
    }
    return {
      serial: '',
      tipo: '',
      estado: '',
      ubicacion: '',
      observaciones: ''
    };
  });

  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(equipo?.imagenUrl || '');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenFile(file);
      setImagenPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData, imagenFile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-icsi-lg shadow-xl max-w-2xl w-full transform transition-all animate-fade-in">
          
          <div className="flex justify-between items-center p-6 border-b border-icsi-border">
            <h3 className="text-xl font-semibold text-icsi-titleform">
              {equipo ? '✏️ Editar Equipo' : '➕ Nuevo Equipo'}
            </h3>
            <button onClick={onClose} className="text-icsi-textLight hover:text-icsi-primary">
              <FaTimes size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Serial */}
              <div>
                <label className="block text-sm font-medium text-icsi-titleform mb-2">
                  Serial *
                </label>
                <input
                  type="text"
                  value={formData.serial}
                  onChange={(e) => setFormData({...formData, serial: e.target.value.toUpperCase()})}
                  className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
                  placeholder="Ej: 5CD539HH3R"
                  required
                  disabled={!!equipo}
                />
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-icsi-titleform mb-2">
                  Tipo *
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
                  required
                >
                  <option value="">Seleccionar tipo</option>
                  {tiposEquipo.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              {/* Estado Físico */}
              <div>
                <label className="block text-sm font-medium text-icsi-titleform mb-2">
                  Estado Físico *
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
                  required
                >
                  <option value="">Seleccionar estado</option>
                  {estadosFisicos.map(estado => (
                    <option key={estado} value={estado}>{estado.charAt(0).toUpperCase() + estado.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Ubicación */}
              <div>
                <label className="block text-sm font-medium text-icsi-titleform mb-2">
                  Ubicación
                </label>
                <input
                  type="text"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                  className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
                  placeholder="Ej: RACK 2 PISO 1"
                />
              </div>

              {/* Observaciones */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-icsi-titleform mb-2">
                  Observaciones
                </label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
                  placeholder="Notas adicionales sobre el equipo..."
                />
              </div>

              {/* Imagen */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-icsi-titleform mb-2">
                  Imagen del equipo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-icsi-border rounded-icsi"
                />
                {imagenPreview && (
                  <div className="mt-2">
                    <img src={imagenPreview} alt="Preview" className="h-32 object-contain rounded" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-icsi-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-icsi-text rounded-icsi hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-icsi-primary text-white rounded-icsi hover:bg-icsi-hover disabled:opacity-50 flex items-center gap-2"
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
                  equipo ? 'Actualizar' : 'Agregar Equipo'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EquipoFormModal;