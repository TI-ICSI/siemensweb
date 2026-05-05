// src/hooks/useAuth.js - VERSIÓN CORREGIDA
import { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const useAuth = () => {
  const [user, setUser] = useState(null);
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
    console.log('🔄 useAuth - Configurando listener de auth');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔄 useAuth - onAuthStateChanged triggered:', firebaseUser?.email);
      
      if (firebaseUser) {
        const userData = await loadUserData(firebaseUser);
        console.log('🔄 useAuth - Usuario cargado:', userData);
        setUser(userData);
      } else {
        console.log('🔄 useAuth - No hay usuario');
        setUser(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Función de login
  const login = async (email, password) => {
    console.log('🔐 useAuth.login - Intentando login con:', email);
    setError(null);
    setLoading(true);
    
    try {
      // Autenticar con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('🔐 useAuth.login - Firebase auth exitoso:', userCredential.user.uid);
      
      // El onAuthStateChanged se encargará de actualizar el estado
      // No necesitamos hacer nada más aquí
      
      return true;
    } catch (err) {
      console.error('🔐 useAuth.login - Error:', err);
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      await signOut(auth);
      // El onAuthStateChanged se encargará de setUser(null)
      return true;
    } catch (err) {
      console.error('Error en logout:', err);
      return false;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };
};

export default useAuth;