// src/pages/inventario/hooks/useInventarioDetalle.js
import { useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { db, storage, auth } from '../../../../firebase/firebaseConfig';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  query, 
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const useInventarioDetalle = () => {
  const { id } = useParams();
  const [inventario, setInventario] = useState(null);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    tipo: '',
    estadoFisico: '',
    busqueda: ''
  });

  // Función para aplicar filtros - SIN useEffect
  const applyFilters = useCallback((data, currentFilters) => {
    let filtered = [...data];
    
    if (currentFilters.tipo) {
      filtered = filtered.filter(eq => eq.tipo === currentFilters.tipo);
    }
    if (currentFilters.estadoFisico) {
      filtered = filtered.filter(eq => eq.estado === currentFilters.estadoFisico);
    }
    if (currentFilters.busqueda) {
      const searchTerm = currentFilters.busqueda.toLowerCase();
      filtered = filtered.filter(eq => 
        eq.serial?.toLowerCase().includes(searchTerm) ||
        eq.tipo?.toLowerCase().includes(searchTerm) ||
        eq.ubicacion?.toLowerCase().includes(searchTerm)
      );
    }
    
    return filtered;
  }, []);

  // Calcular equipos filtrados usando useMemo (sin efecto)
  const filteredEquipos = useMemo(() => {
    return applyFilters(equipos, filters);
  }, [equipos, filters, applyFilters]);

  // Cargar información del inventario
  const loadInventario = useCallback(async () => {
    try {
      const inventarioRef = doc(db, 'inventarios', id);
      const inventarioDoc = await getDoc(inventarioRef);
      if (inventarioDoc.exists()) {
        setInventario({ id: inventarioDoc.id, ...inventarioDoc.data() });
      }
    } catch (error) {
      console.error('Error cargando inventario:', error);
    }
  }, [id]);

  // Cargar equipos del inventario
  const loadEquipos = useCallback(async () => {
    setLoading(true);
    try {
      const equiposRef = collection(db, `inventarios/${id}/equipos`);
      const q = query(equiposRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setEquipos(data);
    } catch (error) {
      console.error('Error cargando equipos:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Crear equipo
  const createEquipo = useCallback(async (equipoData, imagenFile) => {
    try {
      let imagenUrl = '';
      let imagenFileName = '';
      
      if (imagenFile) {
        const fileName = `equipos/${id}/${equipoData.serial}_${Date.now()}.jpg`;
        const imageRef = ref(storage, fileName);
        await uploadBytes(imageRef, imagenFile);
        imagenUrl = await getDownloadURL(imageRef);
        imagenFileName = fileName;
      }
      
      const newEquipo = {
        ...equipoData,
        serial: equipoData.serial.toUpperCase(),
        createdAt: Timestamp.now(),
        createdAtTimestamp: Date.now(),
        createdBy: auth.currentUser?.email,
        createdByName: auth.currentUser?.displayName || auth.currentUser?.email,
        updatedAt: Timestamp.now(),
        imagenUrl,
        imagenFileName
      };
      
      const equiposRef = collection(db, `inventarios/${id}/equipos`);
      await addDoc(equiposRef, newEquipo);
      await loadEquipos();
      
      // Actualizar total de equipos en el inventario
      const newTotal = equipos.length + 1;
      const inventarioRef = doc(db, 'inventarios', id);
      await updateDoc(inventarioRef, { totalEquipos: newTotal });
      setInventario(prev => ({ ...prev, totalEquipos: newTotal }));
      
      return { success: true };
    } catch (error) {
      console.error('Error creando equipo:', error);
      return { success: false, error: error.message };
    }
  }, [id, equipos.length, loadEquipos]);

  // Actualizar equipo
  const updateEquipo = useCallback(async (equipoId, equipoData, nuevaImagenFile) => {
    try {
      const equipoRef = doc(db, `inventarios/${id}/equipos`, equipoId);
      const equipoActual = equipos.find(e => e.id === equipoId);
      
      let imagenUrl = equipoActual?.imagenUrl || '';
      let imagenFileName = equipoActual?.imagenFileName || '';
      
      if (nuevaImagenFile) {
        // Eliminar imagen anterior si existe
        if (imagenFileName) {
          const oldImageRef = ref(storage, imagenFileName);
          await deleteObject(oldImageRef).catch(() => {});
        }
        
        const fileName = `equipos/${id}/${equipoData.serial}_${Date.now()}.jpg`;
        const imageRef = ref(storage, fileName);
        await uploadBytes(imageRef, nuevaImagenFile);
        imagenUrl = await getDownloadURL(imageRef);
        imagenFileName = fileName;
      }
      
      await updateDoc(equipoRef, {
        ...equipoData,
        serial: equipoData.serial.toUpperCase(),
        updatedAt: Timestamp.now(),
        updatedBy: auth.currentUser?.email,
        imagenUrl,
        imagenFileName
      });
      
      await loadEquipos();
      return { success: true };
    } catch (error) {
      console.error('Error actualizando equipo:', error);
      return { success: false, error: error.message };
    }
  }, [id, equipos, loadEquipos]);

  // Eliminar equipo
  const deleteEquipo = useCallback(async (equipoId) => {
    try {
      const equipo = equipos.find(e => e.id === equipoId);
      
      // Eliminar imagen de Storage si existe
      if (equipo?.imagenFileName) {
        const imageRef = ref(storage, equipo.imagenFileName);
        await deleteObject(imageRef).catch(() => {});
      }
      
      const equipoRef = doc(db, `inventarios/${id}/equipos`, equipoId);
      await deleteDoc(equipoRef);
      await loadEquipos();
      
      // Actualizar total de equipos en el inventario
      const newTotal = equipos.length - 1;
      const inventarioRef = doc(db, 'inventarios', id);
      await updateDoc(inventarioRef, { totalEquipos: newTotal });
      setInventario(prev => ({ ...prev, totalEquipos: newTotal }));
      
      return { success: true };
    } catch (error) {
      console.error('Error eliminando equipo:', error);
      return { success: false, error: error.message };
    }
  }, [id, equipos, loadEquipos]);

  // Obtener tipos únicos para filtros
  const getUniqueTipos = useCallback(() => {
    return [...new Set(equipos.map(e => e.tipo))].filter(Boolean);
  }, [equipos]);

  const getUniqueEstadosFisicos = useCallback(() => {
    return [...new Set(equipos.map(e => e.estado))].filter(Boolean);
  }, [equipos]);

  // Resetear filtros
  const resetFilters = useCallback(() => {
    setFilters({
      tipo: '',
      estadoFisico: '',
      busqueda: ''
    });
  }, []);

  // Cargar datos al iniciar - usando un flag para evitar el warning
  const [initialized, setInitialized] = useState(false);
  
  if (!initialized) {
    setInitialized(true);
    loadInventario();
    loadEquipos();
  }

  return {
    inventario,
    equipos: filteredEquipos,
    allEquipos: equipos,
    loading,
    filters,
    setFilters,
    resetFilters,
    createEquipo,
    updateEquipo,
    deleteEquipo,
    getUniqueTipos,
    getUniqueEstadosFisicos,
    reloadEquipos: loadEquipos
  };
};

export default useInventarioDetalle;