'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import SuccessModal from '@/components/successModal';

const messages: Record<string, { title: string; message: string }> = {
  login: {
    title: 'Welcome back!',
    message: 'You have signed in successfully.',
  },
  register: {
    title: 'Account created!',
    message: 'Your account has been created successfully.',
  },
};

function AuthSuccessToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [authType, setAuthType] = useState<string | null>(null);

  useEffect(() => {
    const welcome = searchParams.get('welcome');
    if (welcome && messages[welcome]) {
      setAuthType(welcome);
    }
  }, [searchParams]);

  const handleComplete = useCallback(() => {
    setAuthType(null);
    // Remove the query param from URL without a full navigation
    router.replace('/', { scroll: false });
  }, [router]);

  if (!authType) return null;

  const { title, message } = messages[authType];

  return (
    <SuccessModal
      title={title}
      message={message}
      redirectLabel="Enjoy shopping!"
      onComplete={handleComplete}
    />
  );
}

export default AuthSuccessToast;
