// src/pages/inventario/InventarioDetalle.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import DashboardHeader from '../dashboard/components/DashboardHeader';
import EquipoFilters from './components/EquipoFilters';
import EquipoTable from './components/EquipoTable';
import EquipoFormModal from './components/EquipoFormModal';
import EquipoImageModal from './components/EquipoImageModal';
import EquipoDeleteConfirmModal from './components/EquipoDeleteConfirmModal';
import useInventarioDetalle from './hooks/useInventarioDetalle';
import useDashboardData from '../dashboard/hooks/useDashboardData';

const InventarioDetalle = () => {
  const navigate = useNavigate();
  const { userName, userEmail } = useDashboardData();
  const {
    inventario,
    equipos,
    loading,
    filters,
    resetFilters,
    setFilters,
    createEquipo,
    updateEquipo,
    deleteEquipo,
    getUniqueTipos,
    getUniqueEstadosFisicos
  } = useInventarioDetalle();

  const [showFormModal, setShowFormModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleCreate = () => {
    setSelectedEquipo(null);
    setShowFormModal(true);
  };

  const handleEdit = (equipo) => {
    setSelectedEquipo(equipo);
    setShowFormModal(true);
  };

  const handleDelete = (equipo) => {
    setSelectedEquipo(equipo);
    setShowDeleteModal(true);
  };

  const handleViewImage = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setShowImageModal(true);
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
    <div className="min-h-screen bg-icsi-background">
      <DashboardHeader userName={userName} userEmail={userEmail} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header con botón volver */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/inventarios')}
            className="flex items-center gap-2 text-icsi-text hover:text-icsi-primary transition-colors mb-4"
          >
            <FaArrowLeft size={16} />
            Volver a inventarios
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-icsi-titleform">
                {inventario?.anio} - {inventario?.mes}
              </h2>
              <p className="text-icsi-text mt-1">
                {inventario?.localidad}, {inventario?.estado}
              </p>
              <div className="flex gap-4 mt-2">
                <span className="text-sm text-icsi-text">
                  📍 {inventario?.ubicacion || 'Sin ubicación específica'}
                </span>
                <span className="text-sm font-semibold text-icsi-primary">
                  📊 Total equipos: {inventario?.totalEquipos || 0}
                </span>
              </div>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-icsi-primary text-white rounded-icsi hover:bg-icsi-hover transition-colors"
            >
              <FaPlus size={16} />
              Agregar Equipo
            </button>
          </div>
        </div>

        {/* Filtros */}
        <EquipoFilters
          filters={filters}
          setFilters={setFilters}
          tipos={getUniqueTipos()}
          estadosFisicos={getUniqueEstadosFisicos()}
          onReset={resetFilters}
        />

        {/* Tabla de equipos */}
        <EquipoTable
          equipos={equipos}
          onViewDetails={() => {}}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewImage={handleViewImage}
          loading={loading}
        />

        {/* Modales */}
        <EquipoFormModal
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
      </main>
    </div>
  );
};

export default InventarioDetalle;