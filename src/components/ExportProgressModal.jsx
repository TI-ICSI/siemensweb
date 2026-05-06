// src/components/common/ExportProgressModal.jsx
import { FaSpinner, FaCheckCircle, FaTimesCircle, FaFileExcel } from 'react-icons/fa';

const ExportProgressModal = ({ isOpen, onClose, status, progress, error, downloadUrl, fileName }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-icsi-lg shadow-xl max-w-md w-full p-6">
          
          {status === 'loading' && (
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-icsi-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-icsi-titleform mb-2">
                Generando reporte...
              </h3>
              <p className="text-icsi-text mb-4">
                Estamos preparando tu archivo Excel. Esto puede tomar unos segundos.
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-icsi-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-icsi-textLight mt-2">
                Procesando equipos...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-icsi-titleform mb-2">
                ¡Exportación completada!
              </h3>
              <p className="text-icsi-text mb-4">
                Tu archivo está listo para descargar.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-icsi p-3 mb-4">
                <p className="text-sm text-green-700">
                  📄 {fileName}
                </p>
              </div>
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-icsi-primary text-white rounded-icsi hover:bg-icsi-hover transition-colors"
              >
                <FaFileExcel size={18} />
                Descargar Excel
              </button>
            </div>
          )}

            {status === 'error' && (
                <div className="text-center">
                    <FaTimesCircle className="text-5xl text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-icsi-titleform mb-2">
                        Error en la exportación
                    </h3>
                    <p className="text-icsi-text mb-4">
                    {error || 'Ocurrió un error al generar el reporte.'}
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-icsi p-3 mb-4 text-left">
                    <p className="text-sm font-medium text-red-700 mb-2">Posibles causas:</p>
                    <ul className="text-xs text-red-600 space-y-1">
                        <li>• La plantilla no existe en Firebase Storage</li>
                        <li>• La función de Firebase no está desplegada correctamente</li>
                        <li>• El inventario no tiene equipos registrados</li>
                        <li>• Error de conexión con el servidor</li>
                    </ul>
                    </div>
                    <button
                    onClick={onClose}
                    className="w-full px-4 py-2 bg-gray-100 text-icsi-text rounded-icsi hover:bg-gray-200 transition-colors"
                    >
                    Cerrar
                    </button>
                </div>
                )}
        </div>
      </div>
    </div>
  );
};

export default ExportProgressModal;