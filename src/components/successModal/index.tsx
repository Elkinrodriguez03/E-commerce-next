'use client';

import { useEffect, useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface SuccessModalProps {
  title: string;
  message: string;
  redirectLabel?: string;
  redirectDelay?: number;
  onComplete: () => void;
}

function SuccessModal({
  title,
  message,
  redirectLabel = 'Redirecting...',
  redirectDelay = 2500,
  onComplete,
}: SuccessModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      onComplete();
    }, redirectDelay);

    return () => clearTimeout(timer);
  }, [redirectDelay, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden transform transition-all duration-300 ${
          visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        <div className="p-8 flex flex-col items-center text-center">
          {/* Success icon with animation */}
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <CheckCircleIcon className="h-10 w-10 text-green-500" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-sm text-gray-500 mb-6">{message}</p>

          <p className="text-xs text-gray-400">{redirectLabel}</p>
        </div>
      </div>
    </div>
  );
}

export default SuccessModal;
