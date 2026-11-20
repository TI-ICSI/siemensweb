// src/pages/perfil/hooks/usePerfilActividad.js
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../../firebase/firebaseConfig';

// Últimos inventarios creados por el usuario (se ordenan aquí para no requerir un índice)
const usePerfilActividad = (uid, max = 4) => {
  const [state, setState] = useState({ loading: true, inventarios: [] });

  useEffect(() => {
    if (!uid) return undefined;
    let cancelled = false;

    (async () => {
      try {
        const snap = await getDocs(query(collection(db, 'inventarios'), where('createdBy', '==', uid)));
        const inventarios = snap.docs
          .map((d) => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.() || null }))
          .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
          .slice(0, max);
        if (!cancelled) setState({ loading: false, inventarios });
      } catch (error) {
        console.error('Error cargando actividad:', error);
        if (!cancelled) setState({ loading: false, inventarios: [] });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [uid, max]);

  return state;
};

export default usePerfilActividad;