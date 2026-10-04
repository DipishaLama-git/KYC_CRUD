import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { api, ApiError } from '../../lib/api';
import Layout from '../../componets/layout/Layout';

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-sm border-b border-gray-100 py-2">
      <span className="font-medium text-gray-700">{label}</span>
      <span className="text-gray-900 text-right">{value || '—'}</span>
    </div>
  );
}

export function UserDetailsPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!token || !id) return;
    api
      .getUser(id, token)
      .then(setUser)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load user'));
  }, [id, token]);

  async function handleDelete() {
    if (!token || !id || !user) return;
    if (!confirm(`Delete user "${user.username}"? This cannot be undone.`)) return;

    setIsDeleting(true);
    setError(null);
    try {
      await api.deleteUser(id, token);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete user');
      setIsDeleting(false);
    }
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center mt-10 gap-4 px-4">
          <p className="text-red-600 text-sm" role="alert">
            {error}
          </p>
          <Link className="text-purple-700 underline" to="/">
            Back to users
          </Link>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="flex justify-center mt-19">Loading…</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col items-center py-10 px-4">
        <h1 className="text-3xl font-semibold text-purple-700 mb-6">
          {user.username}
        </h1>

        <div className="w-full max-w-2xl space-y-4">
          <section className="rounded-md border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-purple-700 mb-2">
              Personal Details
            </h2>

            <Row label="First name" value={user.firstName} />
            <Row label="Middle name" value={user.middleName} />
            <Row label="Last name" value={user.lastName} />
            <Row label="Date of birth" value={user.dateOfBirth} />
          </section>

          <section className="rounded-md border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-purple-700 mb-2">
              Record Information
            </h2>

            <Row label="Created By" value={user.createdBy} />
            <Row
              label="Created Date"
              value={user.createdDate ? new Date(user.createdDate).toLocaleString() : ''}
            />
            <Row label="Last Updated By" value={user.lastUpdatedBy} />
            <Row
              label="Last Updated Date"
              value={
                user.lastUpdatedDate
                  ? new Date(user.lastUpdatedDate).toLocaleString()
                  : ''
              }
            />
          </section>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            className="px-5 py-3 bg-purple-300 rounded-md hover:bg-purple-700 hover:text-white"
            onClick={() => navigate('/users')}
          >
            Back
          </button>

          <button
            className="px-5 py-3 bg-purple-300 rounded-md hover:bg-purple-700 hover:text-white"
            onClick={() => navigate(`/users/${user.id}/edit`)}
          >
            Edit
          </button>

          <button
            className="px-5 py-3 bg-red-700 text-white rounded-md hover:bg-red-500 disabled:opacity-50"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </Layout>
  );
}
