import { useState} from 'react';
import { useAuth } from '../../auth/AuthContext';
import { api, ApiError } from '../../lib/api';
import Layout from '../../componets/layout/Layout';

export function ChangePasswordPage() {
  const { token } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!token) return;

    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.changePassword(currentPassword, newPassword, token);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="flex min-h-screen items-center justify-center px-3">
        <form className="w-full max-w-md text-base bg-white" onSubmit={handleSubmit}>
          <h1 className="p-7 text-3xl text-center font-medium text-purple-700">Change Password</h1>

          <label htmlFor="currentPassword" className="text-gray-700 mb-2 block p-3 font-medium">
            Current password
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoFocus
            className="w-full h-10 rounded-xl border border-gray-300 px-3 py-3 focus:ring-3 focus:ring-purple-300 bg-purple-100"
          />

          <label htmlFor="newPassword" className="text-gray-700 mb-2 block p-3 font-medium">
            New password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full h-10 rounded-xl border border-gray-300 px-3 py-3 focus:ring-3 focus:ring-purple-300 bg-purple-100"
          />
          <p className="px-3 pt-1 text-sm text-gray-500">
            At least 8 characters, with uppercase, lowercase, a number and a symbol.
          </p>

          <label htmlFor="confirmPassword" className="text-gray-700 mb-2 block p-3 font-medium">
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full h-10 rounded-xl border border-gray-300 px-3 py-3 focus:ring-3 focus:ring-purple-300 bg-purple-100"
          />

          {error && (
            <p className="mt-3 text-red-700" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="mt-3 text-sm text-green-700">Password changed successfully.</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-purple-600 px-3 py-3 font-medium mt-7 hover:opacity-70 text-white disabled:opacity-50"
          >
            {isSubmitting ? 'Saving…' : 'Change password'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
