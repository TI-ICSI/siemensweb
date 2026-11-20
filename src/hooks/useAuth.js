// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

// Mensajes en español para los errores de inicio de sesión
const AUTH_ERRORS = {
  'auth/invalid-credential': 'Correo o contraseña incorrectos',
  'auth/wrong-password': 'Correo o contraseña incorrectos',
  'auth/user-not-found': 'Correo o contraseña incorrectos',
  'auth/invalid-email': 'El formato del correo no es válido',
  'auth/user-disabled': 'Esta cuenta ha sido desactivada',
  'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
  'auth/network-request-failed': 'Error de conexión. Revisa tu internet',
};

const friendlyError = (err) =>
  AUTH_ERRORS[err?.code] || 'No se pudo iniciar sesión. Intenta de nuevo';

const useAuth = () => {
  const [user, setUser] = useState(null);
  // "loading" solo indica la carga inicial de la sesión. El login NO lo usa:
  // si lo usara, App mostraría el spinner y la pantalla de login se vaciaría.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar datos del usuario desde Firestore
  const loadUserData = async (firebaseUser) => {
    if (!firebaseUser) return null;

    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.data();

      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: userData?.displayName || firebaseUser.email?.split('@')[0],
        role: userData?.role || 'user',
        active: userData?.active || false
      };
    } catch (error) {
      console.error('Error loading user data:', error);
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.email?.split('@')[0],
        role: 'user',
        active: false
      };
    }
  };

  // Escuchar cambios de autenticación en tiempo real
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await loadUserData(firebaseUser);
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Función de login: devuelve true si entró, false si no (y deja el mensaje en "error")
  const login = async (email, password) => {
    setError(null);

    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);

      // Solo los administradores pueden entrar al panel
      const userData = await loadUserData(credential.user);
      if (userData?.role !== 'admin') {
        await signOut(auth);
        setError('Tu cuenta no tiene acceso al panel de administración');
        return false;
      }

      // onAuthStateChanged se encarga de actualizar "user"
      return true;
    } catch (err) {
      console.error('Error en login:', err?.code);
      setError(friendlyError(err));
      return false;
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      await signOut(auth);
      // El onAuthStateChanged se encarga de setUser(null)
      return true;
    } catch (err) {
      console.error('Error en logout:', err);
      return false;
    }
  };

  // Cambia el nombre del usuario en sesión (Firestore + perfil de Auth) y actualiza "user"
  const updateDisplayName = async (name) => {
    const clean = (name || '').trim();
    const current = auth.currentUser;
    if (!current) return { success: false, error: 'No hay una sesión activa' };

    try {
      await updateDoc(doc(db, 'users', current.uid), { displayName: clean });
      try {
        await updateProfile(current, { displayName: clean });
      } catch (err) {
        // El nombre que se usa en el sistema es el de Firestore; esto es secundario
        console.warn('No se pudo actualizar el perfil de Auth:', err?.code);
      }
      setUser((prev) => (prev ? { ...prev, displayName: clean } : prev));
      return { success: true };
    } catch (err) {
      console.error('Error al actualizar el nombre:', err?.code);
      return {
        success: false,
        error:
          err?.code === 'permission-denied'
            ? 'No tienes permiso para modificar tu nombre'
            : 'No se pudo guardar el nombre. Intenta de nuevo',
      };
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    updateDisplayName,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };
};

export default useAuth;