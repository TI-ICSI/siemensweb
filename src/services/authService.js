// src/services/authService.js
import { auth, db } from '../../firebase/firebaseConfig';
import { 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

class AuthService {
  // Login
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Verificar si es admin
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      if (userData?.role !== 'admin') {
        await this.logout();
        throw new Error('No tienes permisos de administrador');
      }
      
      if (!userData?.active) {
        await this.logout();
        throw new Error('Usuario desactivado. Contacta al administrador');
      }
      
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: userData?.displayName,
          role: userData?.role
        }
      };
    } catch (error) {
      console.error('Error en login:', error);
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
      console.error('Error en logout:', error);
      return { success: false, error: error.message };
    }
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
  
  // Obtener usuario actual
  getCurrentUser() {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        unsubscribe();
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          resolve({
            uid: user.uid,
            email: user.email,
            ...userDoc.data()
          });
        } else {
          resolve(null);
        }
      });
    });
  }
  
  // Mensajes de error amigables
  getErrorMessage(errorCode) {
    const errors = {
      'auth/invalid-email': 'El formato del correo no es válido',
      'auth/user-disabled': 'Este usuario ha sido desactivado',
      'auth/user-not-found': 'No existe una cuenta con este correo',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet'
    };
    return errors[errorCode] || 'Error al iniciar sesión. Intenta de nuevo';
  }
}

export default new AuthService();