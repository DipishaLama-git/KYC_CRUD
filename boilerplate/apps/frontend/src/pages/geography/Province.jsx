import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../componets/layout/Layout';
import { useAuth } from '../../auth/AuthContext';
import { api, ApiError } from '../../lib/api';
 
const Province = () => {
  const { id } = useParams();
  const isEditMode = id !== undefined;
  const { token } = useAuth();
  const navigate = useNavigate();
 
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
 
  useEffect(() => {
    if (!isEditMode || !token || !id) return;
 
    api
      .getProvince(id, token)
      .then((province) => setName(province.name))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load province'))
      .finally(() => setIsLoading(false));
  }, [id, isEditMode, token]);
 
  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) return;
 
    setError(null);
    setSubmitting(true);
    try {
      if (isEditMode && id) {
        await api.updateProvince(id, { name: name.trim() }, token);
      } else {
        await api.createProvince({ name: name.trim() }, token);
      }
      navigate('/province-lists');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save province');
    } finally {
      setSubmitting(false);
    }
  }
 
  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
          <p>Loading…</p>
        </div>
      </Layout>
    );
  }
 
  return (
    <Layout>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            {isEditMode ? 'Edit Province' : 'Add Province'}
          </h2>
 
          {error && (
            <p className="mb-4 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
 
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Province Name
              </label>
 
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter province name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>
 
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'Saving…' : isEditMode ? 'Save Changes' : 'Add Province'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};
export default Province;