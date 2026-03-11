import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { loginSchema, type LoginFormData } from '@/validation/auth';

function SignIn() {
  useDocumentTitle('Sign In');
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) clearError();
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const field = issue.path[0];
        if (typeof field === 'string') {
          errors[field] = issue.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    const response = await login(formData);

    if (response.success) {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-bold mb-6">Sign In</h1>
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black ${
              validationErrors.email ? 'border-red-500' : ''
            }`}
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            autoComplete="email"
          />
          {validationErrors.email && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black ${
              validationErrors.password ? 'border-red-500' : ''
            }`}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            autoComplete="current-password"
          />
          {validationErrors.password && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-black disabled:bg-gray-400 text-white w-full rounded-lg py-3 mb-4 hover:bg-gray-800 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link to="/sign-up" className="text-blue-500 hover:underline">
          Sign Up
        </Link>
      </p>
      <p className="mt-2 text-xs text-gray-500">Demo: demo@ecommerce.com / password123</p>
    </div>
  );
}

export default SignIn;
