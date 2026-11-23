// src/pages/reportes/hooks/useReportes.js
import { useState, useCallback, useRef } from 'react';
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
  const [filters, setFilters] = useState({ search: '' });

  // Cada carga lleva un número: si la selección cambia mientras se carga,
  // el resultado viejo se descarta y no pisa al nuevo.
  const requestId = useRef(0);

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

  // Cargar equipos de los inventarios seleccionados (en paralelo)
  const loadEquiposFromInventarios = useCallback(async (inventarioIds) => {
    const current = ++requestId.current;

    if (!inventarioIds || inventarioIds.length === 0) {
      setEquipos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const groups = await Promise.all(
        inventarioIds.map(async (inventarioId) => {
          const inventarioDoc = await getDoc(doc(db, 'inventarios', inventarioId));
          const inventarioData = inventarioDoc.data();

          const snapshot = await getDocs(collection(db, `inventarios/${inventarioId}/equipos`));

          return snapshot.docs.map(equipoDoc => ({
            id: equipoDoc.id,
            ...equipoDoc.data(),
            inventarioId: inventarioId,
            inventarioNombre: `${inventarioData?.anio || ''} - ${inventarioData?.mes || ''} (${inventarioData?.localidad || ''})`,
            inventarioLocalidad: inventarioData?.localidad || '',
            inventarioEstado: inventarioData?.estado || ''
          }));
        })
      );

      if (current !== requestId.current) return; // llegó tarde: ya hay otra carga
      setEquipos(groups.flat());
    } catch (error) {
      console.error('Error cargando equipos:', error);
    } finally {
      if (current === requestId.current) setLoading(false);
    }
  }, []);

  // Seleccionar/Deseleccionar inventario
  const toggleInventario = useCallback((inventarioId) => {
    setSelectedInventarios(prev => (
      prev.includes(inventarioId)
        ? prev.filter(id => id !== inventarioId)
        : [...prev, inventarioId]
    ));
  }, []);

  // Seleccionar varios: los ids que se pasen (por ejemplo, los que deja el filtro)
  // o, sin argumentos, todos. Se suman a lo que ya estaba seleccionado.
  const selectAllInventarios = useCallback((ids) => {
    const toAdd = Array.isArray(ids) ? ids : inventarios.map(inv => inv.id);
    setSelectedInventarios(prev => [...new Set([...prev, ...toAdd])]);
  }, [inventarios]);

  // Limpiar selección
  const clearSelection = useCallback(() => {
    setSelectedInventarios([]);
    setEquipos([]);
  }, []);

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