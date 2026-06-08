// src/pages/inventario/components/EquipoFormModal.jsx
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

// Opciones para los selects
const perfiles = ["Standard", "Workstation", "Ejecutiva", "Mini", "Tower"];

const estadosMostrados = [
  "Baja",
  "Dañado Destrucción",
  "Donación",
  "En Reparación",
  "Nuevo",
  "Renovado",
  "Venta",
  "Usado con Garantía",
  "Usado Sin Garantía",
];

// Mapeo de estados mostrados a valores internos (para guardar en Firebase)
const estadoMap = {
  "Baja": "baja",
  "Dañado Destrucción": "danado_destruccion",
  "Donación": "donacion",
  "En Reparación": "reparacion",
  "Nuevo": "nuevo",
  "Renovado": "renovado",
  "Venta": "venta",
  "Usado con Garantía": "usado_garantia",
  "Usado Sin Garantía": "usado_sin_garantia",
};

// Mapeo inverso para mostrar el texto correcto al editar
const estadoInversoMap = {
  "baja": "Baja",
  "danado_destruccion": "Dañado Destrucción",
  "donacion": "Donación",
  "reparacion": "En Reparación",
  "nuevo": "Nuevo",
  "renovado": "Renovado",
  "venta": "Venta",
  "usado_garantia": "Usado con Garantía",
  "usado_sin_garantia": "Usado Sin Garantía",
};

const esquemas = ["CaaS", "Activo Fijo"];

const observacionesOpciones = [
  "Etiqueta Dañada",
  "No carga imagen de Siemens",
  "No esta en AMTO",
  "No se puede instalar sistema operativo",
  "No tiene acciones en myIT",
  "Obtener Hash",
  "Sin caja",
  "Sin Cargador",
  "Sin Cargador y Sin Caja",
  "Sin etiqueta",
  "Sin imagen",
  "Otro",
];

// Función para obtener el valor mostrado del estado
const getEstadoMostrado = (estadoInterno) => {
  return estadoInversoMap[estadoInterno] || "Nuevo";
};

// Función para obtener el estado inicial basado en el equipo
const getInitialFormData = (equipo) => {
  if (equipo) {
    return {
      serial: equipo.serial || '',
      perfil: equipo.perfil || 'Standard',
      ubicacion: equipo.ubicacion || '',
      estado: getEstadoMostrado(equipo.estado),
      esquema: equipo.esquema || 'Activo Fijo',
      observaciones: equipo.observaciones || '',
      nota: equipo.nota || ''
    };
  }
  return {
    serial: '',
    perfil: 'Standard',
    ubicacion: '',
    estado: 'Nuevo',
    esquema: 'Activo Fijo',
    observaciones: '',
    nota: ''
  };
};

const EquipoFormModal = ({ isOpen, onClose, onSave, equipo, loading }) => {
  // Inicializar el estado directamente con los valores del equipo
  const [formData, setFormData] = useState(() => getInitialFormData(equipo));
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
    
    // Convertir el estado mostrado a valor interno para guardar
    const estadoInterno = estadoMap[formData.estado] || "nuevo";
    
    const datosParaGuardar = {
      serial: formData.serial,
      perfil: formData.perfil,
      ubicacion: formData.ubicacion,
      estado: estadoInterno,
      esquema: formData.esquema,
      observaciones: formData.observaciones,
      nota: formData.nota
    };
    
    await onSave(datosParaGuardar, imagenFile);
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
          
          <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Serial - Número de serie */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-icsi-titleform mb-2">
                  Número de serie *
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

              {/* Perfil */}
              <div>
                <label className="block text-sm font-medium text-icsi-titleform mb-2">
                  Perfil *
                </label>
                <select
                  value={formData.perfil}
                  onChange={(e) => setFormData({...formData, perfil: e.target.value})}
                  className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
                  required
                >
                  {perfiles.map(perfil => (
                    <option key={perfil} value={perfil}>{perfil}</option>
                  ))}
                </select>
              </div>

              {/* Ubicación física */}
              <div>
                <label className="block text-sm font-medium text-icsi-titleform mb-2">
                  Ubicación física
                </label>
                <input
                  type="text"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                  className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
                  placeholder="Ej: RACK 2 PISO 1, Bodega Norte, etc."
                />
              </div>

              {/* Estado */}
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
                  {estadosMostrados.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>

              {/* Esquema */}
              <div>
                <label className="block text-sm font-medium text-icsi-titleform mb-2">
                  Esquema *
                </label>
                <select
                  value={formData.esquema}
                  onChange={(e) => setFormData({...formData, esquema: e.target.value})}
                  className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
                  required
                >
                  {esquemas.map(esquema => (
                    <option key={esquema} value={esquema}>{esquema}</option>
                  ))}
                </select>
              </div>

              {/* Observaciones - Select con opciones fijas */}
              <div>
                <label className="block text-sm font-medium text-icsi-titleform mb-2">
                  Observaciones
                </label>
                <select
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  className="w-full px-3 py-2 border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20 focus:border-icsi-primary"
                >
                  <option value="">Seleccionar observación</option>
                  {observacionesOpciones.map(obs => (
                    <option key={obs} value={obs}>{obs}</option>
                  ))}
                </select>
              </div>

              {/* Nota - Texto libre */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-icsi-titleform mb-2">
                  Nota
                </label>
                <textarea
                  value={formData.nota}
                  onChange={(e) => setFormData({...formData, nota: e.target.value})}
                  rows="2"
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
                  equipo ? 'Actualizar Equipo' : 'Agregar Equipo'
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