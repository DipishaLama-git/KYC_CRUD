import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../componets/layout/Layout';
import { useAuth } from '../../auth/AuthContext';
import { api, ApiError } from '../../lib/api';
 
const District = () => {
  const { id } = useParams();
  const isEditMode = id !== undefined;
  const { token } = useAuth();
  const navigate = useNavigate();
 
  const [name, setName] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
 
  useEffect(() => {
    if (!token) return;

    api
      .getProvinces(token)
      .then((data) => setProvinces(Array.isArray(data) ? data : data?.data || []))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load provinces'));
  }, [token]);

  useEffect(() => {
    if (!isEditMode || !token || !id) return;
 
    api
      .getDistrict(id, token)
      .then((district) => {
        setName(district.name);
        setProvinceId(String(district.provinceId));
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load district'))
      .finally(() => setIsLoading(false));
  }, [id, isEditMode, token]);
 
  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) return;
 
    setError(null);
    setSubmitting(true);
    try {
      if (isEditMode && id) {
        await api.updateDistrict(
          id,
          { name: name.trim(), provinceId: Number(provinceId) },
          token,
        );
      } else {
        await api.createDistrict(
          { name: name.trim(), provinceId: Number(provinceId) },
          token,
        );
      }
      navigate('/district-list');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save district');
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
            {isEditMode ? 'Edit District' : 'Add District'}
          </h1>
 
          {error && (
            <p className="text-red-600 text-sm" role="alert">
              {error}
            </p>
          )}
 
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              District Name
            </label>
 
            <input
              type="text"
              name="name"
              placeholder="Enter district name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-purple-500"
            />
          </div>
 
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Province
            </label>
 
            <select
              name="provinceId"
              value={provinceId}
              onChange={(e) => setProvinceId(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:border-purple-500"
            >
              <option value="">Select Province</option>

              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
 
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-purple-700 px-4 py-2 text-sm text-white hover:bg-purple-800 disabled:opacity-50"
          >
            {submitting ? 'Saving…' : isEditMode ? 'Save Changes' : 'Add District'}
          </button>
        </form>
      </div>
    </Layout>
  );
};
 
export default District;