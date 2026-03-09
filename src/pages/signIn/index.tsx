import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context';

function SignIn() {
  const { setSignOut, setAccount, signOut, account } = useAuthContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState('test@ecommerce.com');
  const [password, setPassword] = useState('password');

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();

    const isAuthenticated = email === 'test@ecommerce.com' && password === 'password';
    if (isAuthenticated) {
      setSignOut(false);

      const userAccount = {
        email: email,
        password: password,
      };
      setAccount(userAccount);
      navigate('/');
    } else {
      alert('Invalid email or password');
    }
  };

  const isUserSignedIn = !signOut && Object.keys(account).length > 0;

  if (isUserSignedIn) {
    navigate('/');
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Log In</h1>
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email:
        </label>
        <input
          type="email"
          id="email"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password:
        </label>
        <input
          type="password"
          id="password"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-6"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-black disabled:bg-black/40 text-white w-full rounded-lg py-3 mb-2"
          disabled={!email || !password}
        >
          Log in
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Dont have an account?{' '}
        <Link to="/sign-up" className="text-blue-500 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default SignIn;
