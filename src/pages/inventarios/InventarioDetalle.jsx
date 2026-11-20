// src/pages/inventario/InventarioDetalle.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaPlus,
  FaFileExcel,
  FaEdit,
  FaTrash,
  FaBuilding,
  FaMapMarkerAlt,
  FaUser,
  FaCalendarAlt,
  FaDesktop,
  FaCheckCircle,
  FaClock,
} from 'react-icons/fa';
import EquipoFilters from './components/EquipoFilters';
import EquipoTable from './components/EquipoTable';
import EquipoCards from './components/EquipoCards';
import EquipoViewToggle from './components/EquipoViewToggle';
import EquipoDetailModal from './components/EquipoDetailModal';
import EquipoFormModal from './components/EquipoFormModal';
import EquipoImageModal from './components/EquipoImageModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import EquipoDeleteConfirmModal from './components/EquipoDeleteConfirmModal';
import InventoryFormModal from './components/InventoryFormModal';
import ExportProgressModal from '../../components/ExportProgressModal';
import useInventarioDetalle from './hooks/useInventarioDetalle';
import { exportInventory } from '../../services/exportService';

const VIEW_KEY = 'sis.equiposView';

const STATUS = {
  activo: { bg: 'bg-green-100', text: 'text-green-700', Icon: FaCheckCircle, label: 'Activo' },
  completado: { bg: 'bg-blue-100', text: 'text-blue-700', Icon: FaCheckCircle, label: 'Completado' },
  en_progreso: { bg: 'bg-yellow-100', text: 'text-yellow-700', Icon: FaClock, label: 'En progreso' },
};

// Fecha corta desde un Date o un Timestamp de Firestore
const formatDate = (value) => {
  const date = value?.toDate ? value.toDate() : value instanceof Date ? value : null;
  return date && !isNaN(date) ? date.toLocaleDateString('es-MX', { dateStyle: 'medium' }) : '';
};

// Dato corto con icono (ubicación, creador, fecha)
const InfoChip = ({ Icon, children }) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-icsi-background px-3 py-1.5 text-sm text-icsi-text">
    <Icon size={12} className="text-icsi-textLight" />
    {children}
  </span>
);

// Vista elegida la última vez (filas por defecto). El almacenamiento puede fallar.
const readView = () => {
  try {
    return localStorage.getItem(VIEW_KEY) === 'cards' ? 'cards' : 'table';
  } catch {
    return 'table';
  }
};

const InventarioDetalle = () => {
  const navigate = useNavigate();
  const {
    inventario,
    equipos,
    loading,
    filters,
    setFilters,
    resetFilters,
    createEquipo,
    updateEquipo,
    deleteEquipo,
    updateInventario,
    deleteInventario,
  } = useInventarioDetalle();

  const [view, setView] = useState(readView); // 'table' | 'cards'
  const [detailEquipo, setDetailEquipo] = useState(null); // equipo abierto en el modal de información

  const [showFormModal, setShowFormModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [exportStatus, setExportStatus] = useState('idle');
  const [exportProgress, setExportProgress] = useState(0);
  const [exportError, setExportError] = useState('');
  const [exportDownloadUrl, setExportDownloadUrl] = useState('');
  const [exportFileName, setExportFileName] = useState('');
  const [modalKey, setModalKey] = useState(0);

  // Editar / eliminar el inventario completo
  const [showInvFormModal, setShowInvFormModal] = useState(false);
  const [showInvDeleteModal, setShowInvDeleteModal] = useState(false);
  const [invFormLoading, setInvFormLoading] = useState(false);
  const [invDeleteLoading, setInvDeleteLoading] = useState(false);
  const [invModalKey, setInvModalKey] = useState(0);


  const handleCreate = () => {
    setSelectedEquipo(null);
    setModalKey(prev => prev + 1); // Forzar reset del formulario
    setShowFormModal(true);
  };

  const handleEdit = (equipo) => {
    setSelectedEquipo(equipo);
    setModalKey(prev => prev + 1); // Forzar reset del formulario
    setShowFormModal(true);
  };

  const handleDelete = (equipo) => {
    setSelectedEquipo(equipo);
    setShowDeleteModal(true);
  };

  const changeView = (next) => {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      /* sin almacenamiento: solo se pierde la preferencia */
    }
  };

  // Desde el modal de información: se cierra y se abre el formulario / la confirmación
  const handleEditFromDetail = (equipo) => {
    setDetailEquipo(null);
    handleEdit(equipo);
  };

  const handleDeleteFromDetail = (equipo) => {
    setDetailEquipo(null);
    handleDelete(equipo);
  };

  const handleViewImage = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setShowImageModal(true);
  };

  const handleExport = async () => {
    if (!inventario?.id) {
      alert('No hay inventario seleccionado');
      return;
    }

    setExportStatus('loading');
    setExportProgress(0);
    setShowExportModal(true);

    const interval = setInterval(() => {
      setExportProgress(prev => Math.min(prev + 10, 90));
    }, 500);

    try {
      const result = await exportInventory(inventario.id);
      
      clearInterval(interval);
      
      if (result.success) {
        setExportProgress(100);
        setExportStatus('success');
        setExportDownloadUrl(result.downloadUrl);
        setExportFileName(result.fileName);
      } else {
        setExportStatus('error');
        setExportError(result.error);
      }
    } catch (error) {
      clearInterval(interval);
      setExportStatus('error');
      setExportError(error.message);
    }
  };

  const handleEditInventario = () => {
    setInvModalKey((prev) => prev + 1); // Forzar reset del formulario
    setShowInvFormModal(true);
  };

  const handleSaveInventario = async (formData) => {
    setInvFormLoading(true);
    const result = await updateInventario(formData);
    setInvFormLoading(false);

    if (result.success) {
      setShowInvFormModal(false);
    } else {
      alert('Error: ' + result.error);
    }
  };

  const handleConfirmDeleteInventario = async () => {
    setInvDeleteLoading(true);
    const result = await deleteInventario();
    setInvDeleteLoading(false);

    if (result.success) {
      navigate('/inventarios');
    } else {
      alert('Error: ' + result.error);
    }
  };

  const handleSaveEquipo = async (formData, imagenFile) => {
    setFormLoading(true);
    let result;
    
    if (selectedEquipo) {
      result = await updateEquipo(selectedEquipo.id, formData, imagenFile);
    } else {
      result = await createEquipo(formData, imagenFile);
    }
    
    setFormLoading(false);
    
    if (result.success) {
      setShowFormModal(false);
      setSelectedEquipo(null);
    } else {
      alert('Error: ' + result.error);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    const result = await deleteEquipo(selectedEquipo.id);
    setDeleteLoading(false);
    
    if (result.success) {
      setShowDeleteModal(false);
      setSelectedEquipo(null);
    } else {
      alert('Error: ' + result.error);
    }
  };

  return (
    <div>
      {/* Encabezado: volver + información del inventario + acciones */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/inventarios')}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-icsi-text transition-colors hover:text-icsi-primary"
        >
          <FaArrowLeft size={13} />
          Volver a inventarios
        </button>

        {(() => {
          const status = STATUS[inventario?.status?.toLowerCase()] || STATUS.activo;
          const created = formatDate(inventario?.createdAt);
          return (
            <div className="card relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-1.5 bg-icsi-primary" />

              <div className="flex flex-col gap-6 pl-2 xl:flex-row xl:items-center xl:justify-between">
                {/* Información */}
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-icsi-lg bg-icsi-primary/10 text-icsi-primary">
                    <FaBuilding size={24} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-icsi-titleform">
                        {inventario?.mes} {inventario?.anio}
                      </h2>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${status.bg} ${status.text}`}
                      >
                        <status.Icon size={11} />
                        {status.label}
                      </span>
                    </div>

                    <p className="mt-1 flex items-center gap-2 text-icsi-text">
                      <FaMapMarkerAlt size={13} className="text-icsi-primary" />
                      {inventario?.localidad}
                      {inventario?.estado ? `, ${inventario.estado}` : ''}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {inventario?.createdByName && <InfoChip Icon={FaUser}>{inventario.createdByName}</InfoChip>}
                      {created && <InfoChip Icon={FaCalendarAlt}>{created}</InfoChip>}
                    </div>
                  </div>
                </div>

                {/* Total y acciones */}
                <div className="flex flex-wrap items-center gap-4 xl:justify-end">
                  <div className="flex items-center gap-3 rounded-icsi-lg border border-icsi-border px-4 py-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-icsi bg-icsi-primary/10 text-icsi-primary">
                      <FaDesktop size={16} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold leading-none text-icsi-titleform">
                        {inventario?.totalEquipos || 0}
                      </p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-icsi-textLight">
                        Equipos
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleEditInventario}
                      className="btn-secondary"
                      title="Editar datos del inventario"
                    >
                      <FaEdit size={14} />
                      Editar
                    </button>
                    <button
                      onClick={() => setShowInvDeleteModal(true)}
                      className="inline-flex items-center gap-2 rounded-icsi border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                      title="Eliminar inventario"
                    >
                      <FaTrash size={13} />
                      Eliminar
                    </button>
                    <button
                      onClick={handleExport}
                      disabled={equipos.length === 0}
                      className={`inline-flex items-center gap-2 rounded-icsi px-4 py-2.5 text-sm font-semibold transition-colors ${
                        equipos.length === 0
                          ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                      title={equipos.length === 0 ? 'No hay equipos para exportar' : 'Exportar a Excel'}
                    >
                      <FaFileExcel size={14} />
                      Exportar
                    </button>
                    <button onClick={handleCreate} className="btn-primary">
                      <FaPlus size={13} />
                      Agregar equipo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ✅ Filtros - AHORA SIN tipos y estadosFisicos */}
      <EquipoFilters
        filters={filters}
        setFilters={setFilters}
        onReset={resetFilters}
      />

      {/* Barra de la lista: total y tipo de vista */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-icsi-text">
          <span className="font-semibold text-icsi-titleform">{equipos.length}</span>{' '}
          {equipos.length === 1 ? 'equipo' : 'equipos'}
        </p>
        <EquipoViewToggle value={view} onChange={changeView} />
      </div>

      {/* Lista de equipos: filas o tarjetas (clic en una para ver su información) */}
      {view === 'cards' ? (
        <EquipoCards
          equipos={equipos}
          onOpen={setDetailEquipo}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      ) : (
        <EquipoTable
          equipos={equipos}
          onOpen={setDetailEquipo}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      )}

      {/* Modales */}
      <EquipoDetailModal
        isOpen={Boolean(detailEquipo)}
        equipo={detailEquipo}
        onClose={() => setDetailEquipo(null)}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteFromDetail}
        onViewImage={handleViewImage}
      />

      <EquipoFormModal
        key={`equipo-${modalKey}`}
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setSelectedEquipo(null);
        }}
        onSave={handleSaveEquipo}
        equipo={selectedEquipo}
        loading={formLoading}
      />

      <EquipoImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageUrl={selectedImageUrl}
      />

      <EquipoDeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedEquipo(null);
        }}
        onConfirm={handleConfirmDelete}
        equipoSerial={selectedEquipo?.serial}
        loading={deleteLoading}
      />

      {/* Editar / eliminar el inventario */}
      <InventoryFormModal
        key={`inventario-${invModalKey}`}
        isOpen={showInvFormModal}
        onClose={() => setShowInvFormModal(false)}
        onSave={handleSaveInventario}
        inventory={inventario}
        loading={invFormLoading}
      />

      <DeleteConfirmModal
        isOpen={showInvDeleteModal}
        onClose={() => setShowInvDeleteModal(false)}
        onConfirm={handleConfirmDeleteInventario}
        inventoryName={inventario ? `${inventario.anio} - ${inventario.mes} (${inventario.localidad})` : ''}
        loading={invDeleteLoading}
      />

      <ExportProgressModal
        isOpen={showExportModal}
        onClose={() => {
          setShowExportModal(false);
          setExportStatus('idle');
          setExportProgress(0);
          setExportError('');
        }}
        status={exportStatus}
        progress={exportProgress}
        error={exportError}
        downloadUrl={exportDownloadUrl}
        fileName={exportFileName}
      />
    </div>
  );
};

export default InventarioDetalle;