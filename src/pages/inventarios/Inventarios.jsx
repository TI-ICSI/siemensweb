// src/pages/inventarios/Inventarios.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaClipboardList, FaDesktop } from 'react-icons/fa';
import InventoryFilters from './components/InventoryFilters';
import InventoryTable from './components/InventoryTable';
import InventoryFormModal from './components/InventoryFormModal';
import useInventarios from './hooks/useInventarios';

const Inventarios = () => {
  const navigate = useNavigate();
  const {
    inventarios,
    loading,
    filters,
    setFilters,
    createInventario,
    getUniqueAnios,
    resetFilters,
  } = useInventarios();

  const [showFormModal, setShowFormModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const handleCreate = () => {
    setModalKey((prev) => prev + 1); // Forzar reset del formulario
    setShowFormModal(true);
  };

  const handleSave = async (formData) => {
    setFormLoading(true);
    const result = await createInventario(formData);
    setFormLoading(false);

    if (result.success) {
      setShowFormModal(false);
    } else {
      alert('Error: ' + result.error);
    }
  };

  return (
    <div>
      {/* Encabezado */}
      <div className="card relative mb-6 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-1.5 bg-icsi-primary" />

        <div className="flex flex-wrap items-center justify-between gap-5 pl-2">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-icsi-lg bg-icsi-primary/10 text-icsi-primary">
              <FaClipboardList size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-icsi-titleform">Inventarios</h2>
              <p className="mt-1 text-icsi-text">Selecciona un inventario para ver y administrar sus equipos</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-4 rounded-icsi-lg border border-icsi-border px-4 py-2.5">
              <div>
                <p className="text-xl font-bold leading-none text-icsi-titleform">{inventarios.length}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-icsi-textLight">
                  {inventarios.length === 1 ? 'Inventario' : 'Inventarios'}
                </p>
              </div>
              <div className="h-8 w-px bg-icsi-border" />
              <div className="flex items-center gap-2">
                <FaDesktop size={14} className="text-icsi-primary" />
                <div>
                  <p className="text-xl font-bold leading-none text-icsi-titleform">
                    {inventarios.reduce((sum, inv) => sum + (Number(inv.totalEquipos) || 0), 0)}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-icsi-textLight">Equipos</p>
                </div>
              </div>
            </div>

            <button onClick={handleCreate} className="btn-primary">
              <FaPlus size={14} />
              Nuevo inventario
            </button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <InventoryFilters
        filters={filters}
        setFilters={setFilters}
        onReset={resetFilters}
        aniosDisponibles={getUniqueAnios()}
      />

      {/* Tabla (cada fila abre el detalle del inventario) */}
      <InventoryTable
        inventories={inventarios}
        onViewDetails={(id) => navigate(`/inventario/${id}`)}
        loading={loading}
      />

      {/* Modal de alta */}
      <InventoryFormModal
        key={modalKey}
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSave={handleSave}
        inventory={null}
        loading={formLoading}
      />
    </div>
  );
};

export default Inventarios;