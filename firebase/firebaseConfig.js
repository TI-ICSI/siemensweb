// firebase.js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, onAuthStateChanged  } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  // Tu configuración existente de Firebase
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_APP_ID
}

console.log('=== VERIFICANDO FIREBASE ===');
console.log('API Key:', firebaseConfig.apiKey ? '✅ Presente' : '❌ FALTA');
console.log('Auth Domain:', firebaseConfig.authDomain ? '✅ Presente' : '❌ FALTA');
console.log('Project ID:', firebaseConfig.projectId ? '✅ Presente' : '❌ FALTA');

if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'tu_api_key_aqui') {
  console.error('❌ ERROR: Firebase no está configurado. Revisa tu archivo .env');
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app) // Para imágenes


// Verificar que auth se inicializó
console.log('Auth inicializado:', !!auth);

// Escuchar cambios globalmente (para debug)
onAuthStateChanged(auth, (user) => {
  console.log('🔐 GLOBAL - Estado de autenticación cambiado:', user ? `Usuario: ${user.email}` : 'No hay usuario');
});