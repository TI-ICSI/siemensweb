// src/services/userService.js
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

// Obtener todos los usuarios (sin filtrar por active)
export const getActiveUsers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('displayName'));  // 👈 FALTABA query()
    const snapshot = await getDocs(q);
    const users = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));
    console.log('✅ Usuarios cargados:', users.length, users);
    return users;
  } catch (error) {
    console.error('❌ Error obteniendo usuarios:', error);
    return [];
  }
};

// Obtener usuarios por lista de UIDs
export const getUsersByIds = async (uids) => {
  if (!uids || uids.length === 0) return [];
  
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    const users = snapshot.docs
      .map(doc => ({ uid: doc.id, ...doc.data() }))
      .filter(user => uids.includes(user.uid));
    return users;
  } catch (error) {
    console.error('Error obteniendo usuarios por IDs:', error);
    return [];
  }
};