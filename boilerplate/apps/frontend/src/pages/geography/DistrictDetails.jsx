import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '../../componets/layout/Layout';
import { useAuth } from '../../auth/AuthContext';
import { api, ApiError } from '../../lib/api';

const DistrictDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [district, setDistrict] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!token || !id) return;

    Promise.all([
      api.getDistrict(id, token),
      api.getProvinces(token),
    ])
      .then(([districtData, provinceList]) => {
        setDistrict(districtData);
        setProvinces(provinceList);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load district'));
  }, [id, token]);

  function provinceName(provinceId) {
    return provinces.find((province) => province.id === provinceId)?.name ?? '—';
  }

  async function handleDelete() {
    if (!token || !id || !district) return;
    if (!confirm(`Delete district "${district.name}"? This cannot be undone.`)) return;

    setIsDeleting(true);
    setError(null);
    try {
      await api.deleteDistrict(id, token);
      navigate('/district-list', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete district');
      setIsDeleting(false);
    }
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center mt-10 gap-4">
          <p className="text-red-600 text-sm" role="alert">
            {error}
          </p>
          <Link className="text-purple-700 underline" to="/district-list">
            Back to districts
          </Link>
        </div>
      </Layout>
    );
  }

  if (!district) {
    return (
      <Layout>
        <div className="flex justify-center mt-19">Loading…</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-3xl text-purple-700 mb-6">{district.name}</h1>

        <div className="w-full max-w-sm rounded-md border border-gray-200 p-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">ID</span>
            <span>{district.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">Name</span>
            <span>{district.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">Province</span>
            <span>{provinceName(district.provinceId)}</span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            className="w-19 p-3 bg-purple-300 rounded-md hover:bg-purple-700"
            onClick={() => navigate(`/district-form/${district.id}/edit`)}
          >
            Edit
          </button>
          <button
            className="w-19 p-3 bg-red-700 text-white rounded-md hover:bg-red-500 disabled:opacity-50"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
          <Link
            className="w-19 p-3 text-center bg-gray-200 rounded-md hover:bg-gray-300"
            to="/district-list"
          >
            Back
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default DistrictDetails;
