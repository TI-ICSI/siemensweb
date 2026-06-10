// src/pages/inventarios/components/UserSelector.jsx
import { useState, useEffect } from 'react';
import { FaCheck, FaUserPlus, FaUserCheck, FaSearch } from 'react-icons/fa';
import { getActiveUsers } from '../../../services/userService';

const UserSelector = ({ selectedUsers, onUserToggle, disabled = false }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Cargar usuarios al montar
  useEffect(() => {
    const loadUsers = async () => {
        setLoading(true);
        try {
        const activeUsers = await getActiveUsers();
        console.log('📋 Usuarios recibidos en selector:', activeUsers);
        setUsers(activeUsers);
        } catch (error) {
        console.error('❌ Error cargando usuarios:', error);
        } finally {
        setLoading(false);
        }
    };
    loadUsers();
    }, []);

  // Filtrar usuarios por búsqueda
  const filteredUsers = users.filter(user => {
    const search = searchTerm.toLowerCase();
    return (
      user.displayName?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search)
    );
  });

  // Usuarios seleccionados (datos completos)
  const selectedUsersData = users.filter(user => selectedUsers.includes(user.uid));

  // Alternar selección de usuario
  const handleUserSelect = (user) => {
    if (!disabled) {
      onUserToggle(user.uid);
    }
  };

  // Eliminar usuario seleccionado
  const handleRemoveUser = (uid) => {
    if (!disabled) {
      onUserToggle(uid);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-icsi-titleform mb-2">
        <FaUserPlus className="inline mr-2" size={14} />
        Usuarios asignados
      </label>

      {/* Usuarios seleccionados (chips) */}
      {selectedUsersData.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedUsersData.map(user => (
            <div
              key={user.uid}
              className="flex items-center gap-2 px-3 py-1.5 bg-icsi-primary/10 text-icsi-primary rounded-full text-sm"
            >
              <FaUserCheck size={12} />
              <span>{user.displayName || user.email}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveUser(user.uid)}
                  className="hover:text-icsi-hover transition-colors"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Selector desplegable */}
      {!disabled && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-between px-3 py-2 border border-icsi-border rounded-icsi hover:border-icsi-primary transition-colors"
          >
            <span className="text-icsi-text">
              {selectedUsers.length > 0 
                ? `${selectedUsers.length} usuario(s) seleccionado(s)` 
                : 'Seleccionar usuarios'}
            </span>
            <span className="text-icsi-textLight">▼</span>
          </button>

          {showDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-icsi-border rounded-icsi shadow-lg max-h-64 overflow-y-auto">
              {/* Buscador */}
              <div className="p-2 border-b border-icsi-border sticky top-0 bg-white">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-icsi-textLight" size={12} />
                  <input
                    type="text"
                    placeholder="Buscar usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-icsi-border rounded-icsi focus:outline-none focus:ring-2 focus:ring-icsi-primary/20"
                  />
                </div>
              </div>

              {/* Lista de usuarios */}
              {loading ? (
                <div className="p-4 text-center text-icsi-text">
                  Cargando usuarios...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-icsi-text">
                  No hay usuarios disponibles
                </div>
              ) : (
                filteredUsers.map(user => {
                  const isSelected = selectedUsers.includes(user.uid);
                  return (
                    <button
                      key={user.uid}
                      type="button"
                      onClick={() => handleUserSelect(user)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-icsi-background transition-colors ${
                        isSelected ? 'bg-icsi-primary/5' : ''
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-icsi-titleform">
                          {user.displayName || 'Sin nombre'}
                        </p>
                        <p className="text-xs text-icsi-textLight">
                          {user.email}
                        </p>
                      </div>
                      {isSelected && (
                        <FaCheck className="text-icsi-primary" size={16} />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* Mensaje informativo */}
      <p className="text-xs text-icsi-textLight">
        Los usuarios seleccionados podrán acceder y editar este inventario.
      </p>
    </div>
  );
};

export default UserSelector;