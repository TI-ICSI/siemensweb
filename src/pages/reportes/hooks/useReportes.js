// src/pages/reportes/hooks/useReportes.js
import { useState, useCallback } from 'react';
import { db } from '../../../../firebase/firebaseConfig';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy,
  doc,
  getDoc
} from 'firebase/firestore';

const useReportes = () => {
  const [inventarios, setInventarios] = useState([]);
  const [selectedInventarios, setSelectedInventarios] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingInventarios, setLoadingInventarios] = useState(true);

  // Cargar lista de inventarios disponibles
  const loadInventarios = useCallback(async () => {
    setLoadingInventarios(true);
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
      setLoadingInventarios(false);
    }
  }, []);

  // Cargar equipos de los inventarios seleccionados
  const loadEquiposFromInventarios = useCallback(async (inventarioIds) => {
    if (!inventarioIds || inventarioIds.length === 0) {
      setEquipos([]);
      return;
    }

    setLoading(true);
    try {
      const allEquipos = [];
      
      for (const inventarioId of inventarioIds) {
        // Obtener información del inventario
        const inventarioRef = doc(db, 'inventarios', inventarioId);
        const inventarioDoc = await getDoc(inventarioRef);
        const inventarioData = inventarioDoc.data();
        
        // Obtener equipos del inventario
        const equiposRef = collection(db, `inventarios/${inventarioId}/equipos`);
        const snapshot = await getDocs(equiposRef);
        
        const equiposData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          inventarioId: inventarioId,
          inventarioNombre: `${inventarioData?.anio || ''} - ${inventarioData?.mes || ''} (${inventarioData?.localidad || ''})`,
          inventarioLocalidad: inventarioData?.localidad || '',
          inventarioEstado: inventarioData?.estado || ''
        }));
        
        allEquipos.push(...equiposData);
      }
      
      setEquipos(allEquipos);
    } catch (error) {
      console.error('Error cargando equipos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Seleccionar/Deseleccionar inventario
  const toggleInventario = useCallback((inventarioId) => {
    setSelectedInventarios(prev => {
      if (prev.includes(inventarioId)) {
        return prev.filter(id => id !== inventarioId);
      } else {
        return [...prev, inventarioId];
      }
    });
  }, []);

  // Seleccionar todos los inventarios
  const selectAllInventarios = useCallback(() => {
    setSelectedInventarios(inventarios.map(inv => inv.id));
  }, [inventarios]);

  // Limpiar selección
  const clearSelection = useCallback(() => {
    setSelectedInventarios([]);
    setEquipos([]);
  }, []);

  // Aplicar filtros a los equipos (si se necesitan)
  const [filters, setFilters] = useState({
    search: ''
  });

  const filteredEquipos = equipos.filter(eq => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return eq.serial?.toLowerCase().includes(searchTerm);
    }
    return true;
  });

  return {
    inventarios,
    selectedInventarios,
    equipos: filteredEquipos,
    allEquipos: equipos,
    loading,
    loadingInventarios,
    filters,
    setFilters,
    toggleInventario,
    selectAllInventarios,
    clearSelection,
    loadInventarios,
    loadEquiposFromInventarios
  };
};

export default useReportes;