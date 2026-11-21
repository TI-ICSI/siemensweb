// src/pages/personal/hooks/usePersonal.js
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../../../../firebase/firebaseConfig';

// Acepta "role" (v2) o "rol" (v1); lo desconocido queda como "user"
const normalizeRole = (raw) => {
  const value = String(raw ?? '').trim().toLowerCase();
  if (value === 'admin') return 'admin';
  if (value === 'tecnico' || value === 'técnico') return 'tecnico';
  return 'user';
};

const toUser = (snap) => {
  const data = snap.data();
  return {
    uid: snap.id,
    email: data.email || '',
    displayName: data.displayName || data.email?.split('@')[0] || 'Sin nombre',
    role: normalizeRole(data.role ?? data.rol),
    active: data.active !== false, // sin el campo = activa
    createdAt: data.createdAt?.toDate?.() || null,
  };
};

// Mensaje en español: el de la función cuando es claro; uno genérico si es un error interno
const friendlyError = (error) => {
  const code = error?.code || '';
  const message = error?.message || '';
  if (code === 'functions/unavailable' || code === 'functions/deadline-exceeded') {
    return 'No se pudo conectar con el servidor. Revisa tu internet e intenta de nuevo';
  }
  if (!message || code === 'functions/internal' || code === 'functions/unknown' || /^[A-Z_]+$/.test(message)) {
    return 'Ocurrió un error en el servidor. Intenta de nuevo';
  }
  return message;
};

const call = async (name, data) => {
  try {
    const result = await httpsCallable(functions, name)(data);
    return { success: true, data: result.data };
  } catch (error) {
    console.error(`Error en ${name}:`, error?.code, error?.message);
    return { success: false, error: friendlyError(error) };
  }
};

const usePersonal = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Sin orderBy: así no se omiten usuarios a los que les falte displayName
        const snap = await getDocs(collection(db, 'users'));
        const list = snap.docs
          .map(toUser)
          .sort((a, b) => a.displayName.localeCompare(b.displayName, 'es', { sensitivity: 'base' }));
        if (!cancelled) {
          setUsers(list);
          setLoadError('');
        }
      } catch (error) {
        console.error('Error cargando usuarios:', error);
        if (!cancelled) setLoadError('No se pudo cargar la lista de usuarios');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const reload = () => setReloadKey((k) => k + 1);

  const withReload = async (promise) => {
    const result = await promise;
    if (result.success) reload();
    return result;
  };

  return {
    users,
    loading,
    loadError,
    reload,
    createUser: (data) => withReload(call('invicoCreateUser', data)),
    setUserRole: (uid, role) => withReload(call('invicoSetUserRole', { uid, role })),
    setUserActive: (uid, active) => withReload(call('invicoSetUserActive', { uid, active })),
  };
};

export default usePersonal;