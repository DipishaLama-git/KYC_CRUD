import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../componets/layout/Layout';
import { useAuth } from '../../auth/AuthContext';
import { api, ApiError } from '../../lib/api';
 
const Municipality = () => {
  const { id } = useParams();
  const isEditMode = id !== undefined;
  const { token } = useAuth();
  const navigate = useNavigate();
 
  const [name, setName] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [districts, setDistricts] = useState([]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
 
  useEffect(() => {
    if (!token) return;

    api
      .getDistricts(token)
      .then((data) => setDistricts(Array.isArray(data) ? data : data?.data || []))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load districts'));
  }, [token]);

  useEffect(() => {
    if (!isEditMode || !token || !id) return;
 
    api
      .getMunicipality(id, token)
      .then((municipality) => {
        setName(municipality.name);
        setDistrictId(String(municipality.districtId));
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load municipality'))
      .finally(() => setIsLoading(false));
  }, [id, isEditMode, token]);
 
  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) return;
 
    setError(null);
    setSubmitting(true);
    try {
      if (isEditMode && id) {
        await api.updateMunicipality(
          id,
          { name: name.trim(), districtId: Number(districtId) },
          token,
        );
      } else {
        await api.createMunicipality(
          { name: name.trim(), districtId: Number(districtId) },
          token,
        );
      }
      navigate('/municipality-lists');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save municipality');
    } finally {
      setSubmitting(false);
    }
  }
 
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center mt-19">Loading…</div>
      </Layout>
    );
  }
 
  return (
    <Layout>
      <div className="flex justify-center mt-19">
        <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
          <h1 className="text-center text-2xl font-medium text-purple-700">
            {isEditMode ? 'Edit Municipality' : 'Add Municipality'}
          </h1>
 
          {error && (
            <p className="text-red-600 text-sm" role="alert">
              {error}
            </p>
          )}
 
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Municipality Name
            </label>
 
            <input
              type="text"
              name="name"
              placeholder="Enter municipality name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-purple-500"
            />
          </div>
 
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              District
            </label>
 
            <select
              name="districtId"
              value={districtId}
              onChange={(e) => setDistrictId(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:border-purple-500"
            >
              <option value="">Select District</option>

              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
 
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-purple-700 px-4 py-2 text-sm text-white hover:bg-purple-800 disabled:opacity-50"
          >
            {submitting ? 'Saving…' : isEditMode ? 'Save Changes' : 'Add Municipality'}
          </button>
        </form>
      </div>
    </Layout>
  );
};
 
export default Municipality;