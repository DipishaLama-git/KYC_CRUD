import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { ApiError } from '../../lib/api';
import '../../assets/styles/AuthForm.css';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from ?? '/';

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(username, password);
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-colmin-h-screen items-center justify-center px-3">
      <form className="w-full max-w-md text-base bg-white" onSubmit={handleSubmit}>
        <h1 className="p-7 text-3xl text-center font-medium text-purple-700">Sign in</h1>

        <label htmlFor="username" className="text-gray-700 mb-2 block p-3 font-medium">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoFocus
          className="w-full h-10 rounded-xl border border-gray-300 px-3 py-3 focus:ring-3 focus:ring-purple-300 bg-purple-100"
        />

        <label htmlFor="password" className="text-gray-700 mb-2 block p-3 font-medium">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full h-10 rounded-xl border border-gray-300 px-3 py-3 focus:ring-3 focus:ring-purple-300 bg-purple-100"
        />

        {error && (
          <p className="text-red-700 items-center" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-purple-600 px-3 py-3 font-medium mt-7 hover:opacity-70 text-white">
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="mt-7 text-center text0sm text-gray-700">
          Don't have an account? <Link to="/register" className="text-purple-600 hover:opacity-70 font-medium">Register</Link>
        </p>
      </form>
    </div>
  );
}
