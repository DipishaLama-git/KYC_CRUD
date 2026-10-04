import { useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { api, ApiError } from '../../lib/api';

import Layout from '../../componets/layout/Layout'
export function UserFormPage() {
  const { id } = useParams();
  const isEditMode = id !== undefined;
  const { token } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode || !token || !id) return;

    api
      .getUser(id, token)
      .then((user) => {
        setUsername(user.username);
        setFirstName(user.firstName);
        setMiddleName(user.middleName ?? '');
        setLastName(user.lastName);
        setDateOfBirth(user.dateOfBirth ?? '');
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load user'))
      .finally(() => setIsLoading(false));
  }, [id, isEditMode, token]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!token) return;

    if (!isEditMode && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      if (isEditMode && id) {
        await api.updateUser(
          id,
          {
            firstName,
            middleName: middleName || undefined,
            lastName,
            dateOfBirth: dateOfBirth || undefined,
          },
          token,
        );
        navigate(`/users/${id}`, { replace: true });
      } else {
        const created = await api.createUser(
          {
            username,
            password,
            firstName,
            middleName: middleName || undefined,
            lastName,
            dateOfBirth: dateOfBirth || undefined,
          },
          token,
        );
        navigate(`/users/${created.id}`, { replace: true });
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save user');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6 text-center">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-purple-700">
              {isEditMode ? 'Edit User' : 'Add User'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {/* {isEditMode ? 'Update user information' : 'Enter user information'} */}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(isEditMode ? `/users/${id}` : '/users')}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isEditMode && (
            <fieldset className="border border-gray-200 rounded-md p-4 space-y-4">
              <legend className="px-2 text-sm font-semibold text-purple-700">
                Account
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Username *
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoFocus
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Letters and numbers only, 3–50 characters.
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    At least 8 characters, with uppercase, lowercase, a number and a symbol.
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Confirm Password *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </fieldset>
          )}

          <fieldset className="border border-gray-200 rounded-md p-4 space-y-4">
            <legend className="px-2 text-sm font-semibold text-purple-700">
              Personal Information
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Middle Name
                </label>
                <input
                  id="middleName"
                  name="middleName"
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </fieldset>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-purple-700 px-5 py-2.5 text-sm text-white hover:bg-purple-800 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
