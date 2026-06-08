// src/pages/inventarios/Inventarios.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import DashboardHeader from '../dashboard/components/DashboardHeader';
import InventoryFilters from './components/InventoryFilters';
import InventoryTable from './components/InventoryTable';
import InventoryFormModal from './components/InventoryFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import useInventarios from './hooks/useInventarios';
import useDashboardData from '../dashboard/hooks/useDashboardData';

const Inventarios = () => {
  const navigate = useNavigate();
  const { userName, userEmail } = useDashboardData();
  const {
    inventarios,
    loading,
    filters,
    setFilters,
    createInventario,
    updateInventario,
    deleteInventario,
    getUniqueAnios,
    resetFilters
  } = useInventarios();

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modalKey, setModalKey] = useState(0);


  const handleCreate = () => {
    setSelectedInventory(null);
    setModalKey(prev => prev + 1);
    setShowFormModal(true);
  };

  const handleEdit = (inventory) => {
    setSelectedInventory(inventory);
    setModalKey(prev => prev + 1);
    setShowFormModal(true);
  };

  const handleDelete = (inventory) => {
    setSelectedInventory(inventory);
    setShowDeleteModal(true);
  };

  const handleSave = async (formData) => {
    setFormLoading(true);
    let result;
    
    if (selectedInventory) {
      result = await updateInventario(selectedInventory.id, formData);
    } else {
      result = await createInventario(formData);
    }
    
    setFormLoading(false);
    
    if (result.success) {
      setShowFormModal(false);
      setSelectedInventory(null);
    } else {
      alert('Error: ' + result.error);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    const result = await deleteInventario(selectedInventory.id);
    setDeleteLoading(false);
    
    if (result.success) {
      setShowDeleteModal(false);
      setSelectedInventory(null);
    } else {
      alert('Error: ' + result.error);
    }
  };

const handleResetFilters = () => {
  resetFilters(); // Usar la función del hook en lugar de setFilters manual
};

  const handleViewDetails = (inventoryId) => {
    navigate(`/inventario/${inventoryId}`);
  };

  return (
    <div className="min-h-screen bg-icsi-background">
      <DashboardHeader userName={userName} userEmail={userEmail} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-icsi-titleform">
              Gestión de Inventarios
            </h2>
            <p className="text-icsi-text mt-1">
              Administra todos los inventarios realizados
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-icsi-primary text-white rounded-icsi hover:bg-icsi-hover transition-colors"
          >
            <FaPlus size={16} />
            Nuevo Inventario
          </button>
        </div>

        {/* Filtros */}
        <InventoryFilters
          filters={filters}
          setFilters={setFilters}
          onReset={handleResetFilters}
          aniosDisponibles={getUniqueAnios()}
        />

        {/* Tabla */}
        <InventoryTable
          inventories={inventarios}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />

        {/* Modales */}
        <InventoryFormModal
          key={modalKey}
          isOpen={showFormModal}
          onClose={() => {
            setShowFormModal(false);
            setSelectedInventory(null);
          }}
          onSave={handleSave}
          inventory={selectedInventory}
          loading={formLoading}
        />

        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedInventory(null);
          }}
          onConfirm={handleConfirmDelete}
          inventoryName={selectedInventory ? `${selectedInventory.anio} - ${selectedInventory.mes} (${selectedInventory.localidad})` : ''}
          loading={deleteLoading}
        />
      </main>
    </div>
  );
};

export default Inventarios;