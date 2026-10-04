import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../componets/layout/Layout';
import { useAuth } from '../../auth/AuthContext';
import { api, ApiError } from '../../lib/api';
 
const DistrictList = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [districts, setDistricts] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
 
  function loadDistricts() {
    if (!token) return;

    Promise.all([
      api.getDistricts(token),
      api.getProvinces(token),
    ])
      .then(([districtList, provinceList]) => {
        setDistricts(districtList);
        setProvinces(provinceList);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load districts'));
  }
 
  useEffect(loadDistricts, [token]);

  function provinceName(provinceId) {
    return provinces.find((province) => province.id === provinceId)?.name ?? '—';
  }
 
  async function handleDelete(district) {
    if (!token) return;
    if (!confirm(`Delete district "${district.name}"? This cannot be undone.`)) return;
 
    setDeletingId(district.id);
    setError(null);
    try {
      await api.deleteDistrict(district.id, token);
      setDistricts((current) => current.filter((d) => d.id !== district.id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete district');
    } finally {
      setDeletingId(null);
    }
  }
 
  return (
    <Layout>
      <div className="items-center flex flex-col">
        <div className="text-xl font-medium">
          <h1 className="text-center m-7 text-3xl  text-purple-700">District</h1>
          <div className="bg-purple-700 text-white rounded-md m-3 w-34 p-1 hover:opacity-70">
            <Link className="" to="/district-form">
              + Add district
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
                <th className="px-7 py-3 font-semibold">Province</th>
                <th className="px-7 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {districts.map((district) => (
                <tr key={district.id}>
                  <td className="w-auto px-7 py-3">{district.id}</td>
                  <td className="w-auto px-7 py-3">{district.name}</td>
                  <td className="w-auto px-7 py-3">{provinceName(district.provinceId)}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="w-19 p-3 m-3 bg-purple-300 rounded-md hover:bg-purple-700"
                        onClick={() => navigate(`/district-details/${district.id}`)}
                      >
                        View
                      </button>
                      <button
                        className="w-19 p-3 m-3 bg-purple-300 rounded-md hover:bg-purple-700"
                        onClick={() => navigate(`/district-form/${district.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        className="w-19 p-3 m-3 bg-red-700 rounded-md hover:bg-red-500 disabled:opacity-50"
                        disabled={deletingId === district.id}
                        onClick={() => handleDelete(district)}
                      >
                        {deletingId === district.id ? 'Deleting…' : 'Delete'}
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
  );
};
export default DistrictList