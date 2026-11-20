// src/pages/inventarios/components/EquipoFormModal.jsx
import { useState, useRef, useEffect } from 'react';
import { FaTimes, FaPlus, FaEdit, FaCamera, FaCloudUploadAlt } from 'react-icons/fa';
import { PERFILES, ESQUEMAS, ESTADOS, OBSERVACIONES } from '../constants/equipo';

const getInitialFormData = (equipo) => ({
  serial: equipo?.serial || '',
  perfil: equipo?.perfil || 'Standard',
  ubicacion: equipo?.ubicacion || '',
  // Si el equipo trae un estado que ya no existe en el catálogo, se propone "nuevo"
  estado: ESTADOS.some((e) => e.value === equipo?.estado) ? equipo.estado : 'nuevo',
  esquema: equipo?.esquema || 'Activo Fijo',
  observaciones: equipo?.observaciones || '',
  nota: equipo?.nota || '',
});

const Label = ({ children }) => (
  <label className="mb-1.5 block text-sm font-medium text-icsi-titleform">{children}</label>
);

const EquipoFormModal = ({ isOpen, onClose, onSave, equipo, loading }) => {
  const isEdit = Boolean(equipo);
  const [formData, setFormData] = useState(() => getInitialFormData(equipo));
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(equipo?.imagenUrl || '');
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef(null);
  const objectUrl = useRef(null); // vista previa local que hay que liberar

  // Libera la vista previa local al cerrar el formulario
  useEffect(
    () => () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    },
    [],
  );

  const set = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const pickFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = URL.createObjectURL(file);
    setImagenFile(file);
    setImagenPreview(objectUrl.current);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(
      {
        serial: formData.serial,
        perfil: formData.perfil,
        ubicacion: formData.ubicacion,
        estado: formData.estado,
        esquema: formData.esquema,
        observaciones: formData.observaciones,
        nota: formData.nota,
      },
      imagenFile,
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl overflow-hidden rounded-icsi-lg bg-white shadow-icsi-lg">
          {/* Encabezado */}
          <div className="flex items-center justify-between border-b border-icsi-border px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-icsi bg-icsi-primary/10 text-icsi-primary">
                {isEdit ? <FaEdit size={15} /> : <FaPlus size={15} />}
              </div>
              <h3 className="text-lg font-bold text-icsi-titleform">
                {isEdit ? 'Editar equipo' : 'Agregar equipo'}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-icsi-textLight transition-colors hover:bg-icsi-background hover:text-icsi-primary"
              aria-label="Cerrar"
            >
              <FaTimes size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid max-h-[calc(100vh-14rem)] grid-cols-1 gap-6 overflow-y-auto p-6 md:grid-cols-5">
              {/* Datos (izquierda) */}
              <div className="space-y-4 md:col-span-3">
                <div>
                  <Label>Número de serie *</Label>
                  <input
                    type="text"
                    value={formData.serial}
                    onChange={(e) => setFormData((p) => ({ ...p, serial: e.target.value.toUpperCase() }))}
                    className="input font-mono"
                    placeholder="Ej: CND12708QW"
                    required
                    autoFocus={!isEdit}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Perfil *</Label>
                    <select value={formData.perfil} onChange={set('perfil')} className="input" required>
                      {PERFILES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Ubicación física</Label>
                    <input
                      type="text"
                      value={formData.ubicacion}
                      onChange={set('ubicacion')}
                      className="input"
                      placeholder="Ej: Rack 2 Piso 1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Estado *</Label>
                    <select value={formData.estado} onChange={set('estado')} className="input" required>
                      {ESTADOS.map((e) => (
                        <option key={e.value} value={e.value}>{e.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Esquema *</Label>
                    <select value={formData.esquema} onChange={set('esquema')} className="input" required>
                      {ESQUEMAS.map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Observaciones</Label>
                  <select value={formData.observaciones} onChange={set('observaciones')} className="input">
                    <option value="">Seleccionar observación</option>
                    {OBSERVACIONES.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Nota (opcional)</Label>
                  <textarea
                    value={formData.nota}
                    onChange={set('nota')}
                    rows={3}
                    className="input resize-none"
                    placeholder="Notas adicionales sobre el equipo..."
                  />
                </div>
              </div>

              {/* Imagen (derecha) */}
              <div className="md:col-span-2">
                <Label>{isEdit ? 'Vista previa de la foto' : 'Imagen del equipo'}</Label>

                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    pickFile(e.target.files?.[0]);
                    e.target.value = '';
                  }}
                />

                <div
                  onClick={() => fileInput.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className={`relative flex aspect-[4/3] w-full cursor-pointer items-center justify-center overflow-hidden rounded-icsi-lg border-2 border-dashed transition-colors ${
                    dragging
                      ? 'border-icsi-primary bg-icsi-primary/5'
                      : 'border-icsi-border bg-icsi-background hover:border-icsi-primary/50'
                  }`}
                >
                  {imagenPreview ? (
                    <img src={imagenPreview} alt="Vista previa" className="h-full w-full object-cover" />
                  ) : (
                    <div className="px-4 text-center text-icsi-textLight">
                      <FaCloudUploadAlt size={34} className="mx-auto mb-2" />
                      <p className="text-sm font-medium text-icsi-text">Selecciona un archivo</p>
                      <p className="text-xs">o arrastra una imagen aquí</p>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  className="btn-secondary mt-3 flex w-full items-center justify-center gap-2"
                >
                  <FaCamera size={14} />
                  {imagenPreview ? 'Cambiar imagen' : 'Seleccionar imagen'}
                </button>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-end gap-3 border-t border-icsi-border bg-icsi-background/60 px-6 py-4">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Guardando...
                  </>
                ) : isEdit ? (
                  'Guardar cambios'
                ) : (
                  'Guardar equipo'
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