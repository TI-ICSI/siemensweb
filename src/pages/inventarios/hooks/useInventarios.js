// src/pages/inventarios/hooks/useInventarios.js
import { useState, useCallback, useMemo } from 'react';
import { db, auth } from '../../../../firebase/firebaseConfig';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  Timestamp
} from 'firebase/firestore';

const useInventarios = () => {
  const [inventarios, setInventarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    anio: '',
    mes: '',
    localidad: '',
    estado: ''
  });

  // Función para aplicar filtros
  const applyFilters = useCallback((data, currentFilters) => {
    let filtered = [...data];
    
    if (currentFilters.anio) {
      filtered = filtered.filter(inv => inv.anio === parseInt(currentFilters.anio));
    }
    if (currentFilters.mes) {
      filtered = filtered.filter(inv => inv.mes === currentFilters.mes);
    }
    if (currentFilters.localidad) {
      filtered = filtered.filter(inv => inv.localidad?.toLowerCase().includes(currentFilters.localidad.toLowerCase()));
    }
    if (currentFilters.estado) {
      filtered = filtered.filter(inv => inv.status === currentFilters.estado);
    }
    
    return filtered;
  }, []);

  // Calcular inventarios filtrados usando useMemo
  const filteredInventarios = useMemo(() => {
    return applyFilters(inventarios, filters);
  }, [inventarios, filters, applyFilters]);

  // Cargar inventarios - Función que se llamará manualmente
  const loadInventarios = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'inventarios'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setInventarios(data);
    } catch (error) {
      console.error('Error cargando inventarios:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear inventario
  const createInventario = useCallback(async (inventarioData) => {
    try {
      const newInventory = {
        ...inventarioData,
        anio: parseInt(inventarioData.anio),
        totalEquipos: 0,
        isActive: true,
        status: 'activo',
        createdBy: auth.currentUser?.uid,
        createdByName: auth.currentUser?.displayName || auth.currentUser?.email,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      await addDoc(collection(db, 'inventarios'), newInventory);
      await loadInventarios();
      return { success: true };
    } catch (error) {
      console.error('Error creando inventario:', error);
      return { success: false, error: error.message };
    }
  }, [loadInventarios]);

  // Actualizar inventario
  const updateInventario = useCallback(async (id, inventarioData) => {
    try {
      const inventarioRef = doc(db, 'inventarios', id);
      await updateDoc(inventarioRef, {
        ...inventarioData,
        anio: parseInt(inventarioData.anio),
        updatedAt: Timestamp.now(),
        updatedBy: auth.currentUser?.email
      });
      await loadInventarios();
      return { success: true };
    } catch (error) {
      console.error('Error actualizando inventario:', error);
      return { success: false, error: error.message };
    }
  }, [loadInventarios]);

  // Eliminar inventario
  const deleteInventario = useCallback(async (id) => {
    try {
      const inventarioRef = doc(db, 'inventarios', id);
      await deleteDoc(inventarioRef);
      await loadInventarios();
      return { success: true };
    } catch (error) {
      console.error('Error eliminando inventario:', error);
      return { success: false, error: error.message };
    }
  }, [loadInventarios]);

  // Obtener años únicos para filtros
  const getUniqueAnios = useCallback(() => {
    const anios = [...new Set(inventarios.map(inv => inv.anio))];
    return anios.sort((a, b) => b - a);
  }, [inventarios]);

  // Resetear filtros
  const resetFilters = useCallback(() => {
    setFilters({
      anio: '',
      mes: '',
      localidad: '',
      estado: ''
    });
  }, []);

  // Cargar datos al iniciar - usando un flag para evitar el warning
  const [initialized, setInitialized] = useState(false);
  
  if (!initialized) {
    setInitialized(true);
    loadInventarios();
  }

  return {
    inventarios: filteredInventarios,
    allInventarios: inventarios,
    loading,
    filters,
    setFilters,
    resetFilters,
    createInventario,
    updateInventario,
    deleteInventario,
    getUniqueAnios,
    reloadInventarios: loadInventarios
  };
};

export default useInventarios;