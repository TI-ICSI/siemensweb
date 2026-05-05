// src/services/authService.js - Versión completa y corregida
import { auth, db } from '../../firebase/firebaseConfig';
import { 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

class AuthService {
  
  // Login
  // src/services/authService.js - Agrega estos logs en el método login

async login(email, password) {
  console.log('📡 authService.login - Iniciando');
  console.log('📡 authService.login - Email:', email);
  console.log('📡 authService.login - Password presente:', !!password);
  
  try {
    console.log('📡 authService.login - Llamando a signInWithEmailAndPassword...');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('📡 authService.login - ✅ Firebase Auth exitoso');
    console.log('📡 authService.login - UID:', userCredential.user.uid);
    console.log('📡 authService.login - Email:', userCredential.user.email);
    
    const user = userCredential.user;
    
    console.log('📡 authService.login - Buscando documento en Firestore...');
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      console.log('📡 authService.login - ❌ Documento no encontrado');
      await signOut(auth);
      return { success: false, error: 'Usuario no registrado en el sistema' };
    }
    
    const userData = userDoc.data();
    console.log('📡 authService.login - ✅ Documento encontrado:', userData);
    
    if (userData.role !== 'admin') {
      console.log('📡 authService.login - ❌ No es admin, rol:', userData.role);
      await signOut(auth);
      return { success: false, error: 'No tienes permisos de administrador' };
    }
    
    if (userData.active !== true) {
      console.log('📡 authService.login - ❌ Usuario inactivo');
      await signOut(auth);
      return { success: false, error: 'Usuario desactivado' };
    }
    
    console.log('📡 authService.login - ✅ Todo correcto, retornando éxito');
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: userData.displayName,
        role: userData.role
      }
    };
    
  } catch (error) {
    console.error('📡 authService.login - ❌ Error:', error.code, error.message);
    return {
      success: false,
      error: this.getErrorMessage(error.code)
    };
  }
}
  
  // Logout
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // En getCurrentUser() agrega:
getCurrentUser() {
  console.log('1. Iniciando getCurrentUser');
  return new Promise((resolve) => {
    console.log('2. Verificando auth.onAuthStateChanged');
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('3. auth.onAuthStateChanged ejecutado, user:', user);
      unsubscribe();
      
      if (!user) {
        console.log('4. No hay usuario autenticado');
        resolve(null);
        return;
      }
      
      console.log('5. Usuario encontrado:', user.uid);
      getDoc(doc(db, 'users', user.uid))
        .then((userDoc) => {
          console.log('6. Documento obtenido, exists:', userDoc.exists());
          const userData = userDoc.data();
          console.log('7. Datos del usuario:', userData);
          resolve({
            uid: user.uid,
            email: user.email,
            displayName: userData?.displayName,
            role: userData?.role,
            active: userData?.active
          });
        })
        .catch((error) => {
          console.error('Error:', error);
          resolve(null);
        });
    });
  });
}
  
  // Recuperar contraseña
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }
  
  // Mensajes de error
  getErrorMessage(errorCode) {
    const errors = {
      'auth/invalid-email': 'El formato del correo no es válido',
      'auth/user-disabled': 'Este usuario ha sido desactivado',
      'auth/user-not-found': 'No existe una cuenta con este correo',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión'
    };
    return errors[errorCode] || 'Error al iniciar sesión';
  }
}

export default new AuthService();