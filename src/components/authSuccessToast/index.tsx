'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import SuccessModal from '@/components/successModal';

const messages: Record<string, { title: string; message: string; label: string }> = {
  login: {
    title: 'Welcome back!',
    message: 'You have signed in successfully.',
    label: 'Enjoy shopping!',
  },
  register: {
    title: 'Account created!',
    message: 'Your account has been created successfully.',
    label: 'Let\u2019s get started!',
  },
};

function AuthSuccessToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
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
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  if (!authType) return null;

  const { title, message, label } = messages[authType];

  return (
    <SuccessModal
      title={title}
      message={message}
      redirectLabel={label}
      onComplete={handleComplete}
    />
  );
}

export default AuthSuccessToast;
