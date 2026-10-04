import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { api, ApiError} from '../../lib/api';
import '../../assets/styles/UsersPages.css';

import Layout from '../../componets/layout/Layout';
export function UsersListPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  function loadUsers() {
    if (!token) return;
    api
      .getUsers(token)
      .then(setUsers)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load users'));
  }

  useEffect(loadUsers, [token]);

  async function handleDelete(user) {
    if (!token) return;
    if (!confirm(`Delete user "${user.username}"? This cannot be undone.`)) return;

    setDeletingId(user.id);
    setError(null);
    try {
      await api.deleteUser(user.id, token);
      setUsers((current) => current.filter((u) => u.id !== user.id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  }




  return (
    <Layout>
      <div className="items-center flex flex-col">
        <div className="text-xl font-medium">
          <h1 className="text-center m-7 text-3xl  text-purple-700">Users</h1>
          <div className="bg-purple-700 text-white rounded-md w-34 p-2.5 m-3 hover:opacity-70">
            <Link className="" to="/users/new">
              + Add user 
            </Link>
          </div>
        </div>


        {error && (
          <p className="error-text" role="alert">
            {error}
          </p>
        )}

        <div className="max-w-8xl p-7 ">
        <table className="w-full text-left">
          <thead className="">
            <tr className="m-7">
              <th className="px-7 py-3 font-semibold">Username</th>
              <th className="px-7 py-3 font-semibold">Name</th>
              <th className="px-7 py-3 font-semibold">Date of birth</th>
              <th className="px-7 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="w-auto">{user.username}</td>
                <td className="w-auto">
                  {user.firstName} {user.middleName ? `${user.middleName} ` : ''}
                  {user.lastName}
                </td>
                <td className="w-auto">{user.dateOfBirth ?? '—'}</td>
                <td>
                  <div className="row-actions">
                    <button className="w-19 p-3 m-3 bg-purple-300 rounded-md hover:bg-purple-700" onClick={() => navigate(`/users/${user.id}`)}>
                      View
                    </button>
                    <button className="w-19 p-3 m-3 bg-purple-300 rounded-md hover:bg-purple-700" onClick={() => navigate(`/users/${user.id}/edit`)}>
                      Edit
                    </button>
                    <button
                      className="w-19 p-3 m-3 bg-red-700 rounded-md hover:bg-red-500 "
                      disabled={deletingId === user.id}
                      onClick={() => handleDelete(user)}
                    >
                      {deletingId === user.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {/* <span>{users.length}</span> */}
      </div>
    </Layout>
  );
}
