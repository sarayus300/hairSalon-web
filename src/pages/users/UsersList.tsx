import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Edit, Lock, Unlock, Key } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

const UsersList = () => {
  const { users, fetchUsers, toggleBlockUser, updatePassword } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.phone?.toLowerCase().includes(searchLower)
    );
  });

  const handleToggleBlock = async (id: string, isBlocked: boolean) => {
    const confirmAction = window.confirm(`¿Seguro que quieres ${isBlocked ? 'desbloquear' : 'bloquear'} este usuario?`);
    if (confirmAction) {
      try {
        await toggleBlockUser(id, isBlocked);
        fetchUsers(); // Refrescar la lista de usuarios
      } catch (error) {
        console.error('Error al bloquear/desbloquear usuario:', error);
      }
    }
  };

  const handleUpdatePassword = async (id: string) => {
    const newPassword = window.prompt('Ingresa la nueva contraseña:');
    if (newPassword) {
      try {
        await updatePassword(id, newPassword);
        alert('Contraseña actualizada correctamente');
      } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
      }
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Lista de Usuarios</h1>
      <div className="mb-6">
        <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-2 outline-none"
          />
          <button className="p-2 bg-gray-100 hover:bg-gray-200">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 border-b">Nombre</th>
              <th className="py-3 px-4 border-b">Email</th>
              <th className="py-3 px-4 border-b">Teléfono</th>
              <th className="py-3 px-4 border-b">Tiempo Registrado</th>
              <th className="py-3 px-4 border-b">Rango</th>
              <th className="py-3 px-4 border-b">Estado</th>
              <th className="py-3 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 border-b">{user.name}</td>
                <td className="py-4 px-4 border-b">{user.email}</td>
                <td className="py-4 px-4 border-b">{user.phone || '-'}</td>
                <td className="py-4 px-4 border-b">
                  {new Date(user.createdAt).toLocaleDateString()} (
                  {Math.floor(
                    (new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                  )}{' '}
                  días)
                </td>
                <td className="py-4 px-4 border-b">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    user.rank === 'bronce'
                      ? 'bg-yellow-100 text-yellow-600'
                      : user.rank === 'plata'
                      ? 'bg-gray-100 text-gray-600'
                      : user.rank === 'oro'
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    {user.rank}
                  </span>
                </td>
                <td className="py-4 px-4 border-b">
                  {user.isBlocked ? (
                    <span className="text-red-600">Bloqueado</span>
                  ) : (
                    <span className="text-green-600">Activo</span>
                  )}
                </td>
                <td className="py-4 px-4 border-b">
                  <div className="flex gap-2">
                    <Link to={`/admin/users/edit/${user._id}`} className="flex items-center gap-1 text-blue-500 hover:text-blue-600">
                      <Edit className="w-4 h-4" />
                      <span>Editar</span>
                    </Link>
                    <button onClick={() => handleToggleBlock(user._id, !user.isBlocked)} className="flex items-center gap-1 text-amber-600 hover:text-amber-700">
                      {user.isBlocked ? (
                        <>
                          <Unlock className="w-4 h-4" />
                          <span>Desbloquear</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Bloquear</span>
                        </>
                      )}
                    </button>
                    <button onClick={() => handleUpdatePassword(user._id)} className="flex items-center gap-1 text-purple-600 hover:text-purple-700">
                      <Key className="w-4 h-4" />
                      <span>Contraseña</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
