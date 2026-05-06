// src/services/exportService.js
import { auth } from '../../firebase/firebaseConfig';

const EXPORT_FUNCTION_URL = 'https://us-central1-siemens-b9f8b.cloudfunctions.net/exportInventory';

export const exportInventory = async (inventoryId) => {
  if (!inventoryId) {
    console.error('❌ No se proporcionó inventoryId');
    return { success: false, error: 'ID de inventario no proporcionado' };
  }

  try {
    console.log('📤 Exportando inventario:', inventoryId);
    
    // Obtener el token de autenticación (como en React Native)
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Debes iniciar sesión' };
    }
    
    const token = await user.getIdToken();
    
    // Misma estructura que usas en React Native
    const response = await fetch(EXPORT_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ inventoryId })
    });
    
    const data = await response.json();
    console.log('✅ Respuesta:', data);
    
    if (!response.ok) {
      return { success: false, error: data.error || `Error ${response.status}` };
    }
    
    // Ajusta según la estructura que retorna TU función
    if (data.success && data.data?.exportacion?.downloadUrl) {
      return {
        success: true,
        downloadUrl: data.data.exportacion.downloadUrl,
        fileName: data.data.exportacion.fileName
      };
    } else if (data.downloadUrl) {
      // Si tu función retorna directamente la URL
      return {
        success: true,
        downloadUrl: data.downloadUrl,
        fileName: data.fileName || `inventario_${inventoryId}.xlsx`
      };
    } else {
      return { success: false, error: data.error || 'Error en la exportación' };
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    return { success: false, error: error.message };
  }
};