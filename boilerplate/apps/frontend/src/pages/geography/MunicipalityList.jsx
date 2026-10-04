import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../componets/layout/Layout';
import { useAuth } from '../../auth/AuthContext';
import { api, ApiError } from '../../lib/api';
 
const MunicipalityList = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [municipalities, setMunicipalities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
 
  function loadMunicipalities() {
    if (!token) return;

    Promise.all([
      api.getMunicipalities(token),
      api.getDistricts(token),
    ])
      .then(([municipalityList, districtList]) => {
        setMunicipalities(municipalityList);
        setDistricts(districtList);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load municipalities'));
  }
 
  useEffect(loadMunicipalities, [token]);

  function districtName(districtId) {
    return districts.find((district) => district.id === districtId)?.name ?? '—';
  }
 
  async function handleDelete(municipality) {
    if (!token) return;
    if (!confirm(`Delete municipality "${municipality.name}"? This cannot be undone.`)) return;
 
    setDeletingId(municipality.id);
    setError(null);
    try {
      await api.deleteMunicipality(municipality.id, token);
      setMunicipalities((current) => current.filter((m) => m.id !== municipality.id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete municipality');
    } finally {
      setDeletingId(null);
    }
  }
 
  return (
    <Layout>
      <div className="items-center flex flex-col">
        <div className="text-xl font-medium">
          <h1 className="text-center m-7 text-3xl  text-purple-700">Municipality</h1>
          <div className="bg-purple-700 text-white rounded-md m-3 w-52 p-1 hover:opacity-70">
            <Link className="" to="/municipality-form">
              + Add Municipality
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
                <th className="px-7 py-3 font-semibold">District</th>
                <th className="px-7 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {municipalities.map((municipality) => (
                <tr key={municipality.id}>
                  <td className="w-auto px-7 py-3">{municipality.id}</td>
                  <td className="w-auto px-7 py-3">{municipality.name}</td>
                  <td className="w-auto px-7 py-3">{districtName(municipality.districtId)}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="w-19 p-3 m-3 bg-purple-300 rounded-md hover:bg-purple-700"
                        onClick={() => navigate(`/municipality-details/${municipality.id}`)}
                      >
                        View
                      </button>
                      <button
                        className="w-19 p-3 m-3 bg-purple-300 rounded-md hover:bg-purple-700"
                        onClick={() => navigate(`/municipality-form/${municipality.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        className="w-19 p-3 m-3 bg-red-700 rounded-md hover:bg-red-500 disabled:opacity-50"
                        disabled={deletingId === municipality.id}
                        onClick={() => handleDelete(municipality)}
                      >
                        {deletingId === municipality.id ? 'Deleting…' : 'Delete'}
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
export default MunicipalityList