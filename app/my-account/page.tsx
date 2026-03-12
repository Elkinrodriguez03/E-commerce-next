'use client';

import { useAuthContext } from '@/context';

function MyAccount() {
  const { user } = useAuthContext();

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <h1 className="font-semibold text-xl mb-5">My Account</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-4">
          <span className="text-gray-500 text-sm">Name</span>
          <p className="font-medium">{user?.name || 'N/A'}</p>
        </div>
        <div className="mb-4">
          <span className="text-gray-500 text-sm">Email</span>
          <p className="font-medium">{user?.email || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}

export default MyAccount;
