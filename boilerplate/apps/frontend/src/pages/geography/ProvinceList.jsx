import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../componets/layout/Layout';
import { useAuth } from '../../auth/AuthContext';
import { api, ApiError } from '../../lib/api';
 
const ProvinceList = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [provinces, setProvinces] = useState([]);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
 
  function loadProvinces() {
    if (!token) return;
    api
      .getProvinces(token)
      .then(setProvinces)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load provinces'));
  }
 
  useEffect(loadProvinces, [token]);
 
  async function handleDelete(province) {
    if (!token) return;
    if (!confirm(`Delete province "${province.name}"? This cannot be undone.`)) return;
 
    setDeletingId(province.id);
    setError(null);
    try {
      await api.deleteProvince(province.id, token);
      setProvinces((current) => current.filter((p) => p.id !== province.id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete province');
    } finally {
      setDeletingId(null);
    }
  }
 



  return (
    <Layout>
      <div className="items-center flex flex-col">
        <div className="text-xl font-medium">
          <h1 className="text-center m-7 text-3xl  text-purple-700">Province</h1>
          <div className="bg-purple-700 text-white rounded-md m-3 w-70 p-1 hover:opacity-70">
            <Link className="" to="/province-form">
              + Add Province 
            </Link>
          </div>
        </div>
 
        {error && (
          <p className="text-red-600 text-sm" role="alert">
            {error}
          </p>
        )}
 
        <div className="max-w-8xl p-7 ">
          <table className="w-full text-left">
            <thead className="">
              <tr className="m-7">
                <th className="px-7 py-3 font-semibold">id</th>
                <th className="px-7 py-3 font-semibold">Name</th>
                <th className="px-7 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {provinces.map((province) => (
                <tr key={province.id}>
                  <td className="w-auto px-7 py-3">{province.id}</td>
                  <td className="w-auto px-7 py-3">{province.name}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="w-19 p-3 m-3 bg-purple-300 rounded-md hover:bg-purple-700"
                        onClick={() => navigate(`/province-details/${province.id}`)}
                      >
                        View
                      </button>
                      <button
                        className="w-19 p-3 m-3 bg-purple-300 rounded-md hover:bg-purple-700"
                        onClick={() => navigate(`/province-form/${province.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button className="w-19 p-3 m-3 bg-red-700 rounded-md hover:bg-red-500 disabled:opacity-50"
                        disabled={deletingId === province.id}
                        onClick={() => handleDelete(province)}>
                        {deletingId === province.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
};

export default ProvinceList;  