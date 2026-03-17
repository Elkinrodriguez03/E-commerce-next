'use client';

import { useMemo } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface PasswordStrengthProps {
  password: string;
}

interface Requirement {
  label: string;
  met: boolean;
}

function PasswordStrength({ password }: PasswordStrengthProps) {
  const requirements: Requirement[] = useMemo(
    () => [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
      { label: 'One lowercase letter', met: /[a-z]/.test(password) },
      { label: 'One number', met: /[0-9]/.test(password) },
      { label: 'One special character', met: /[^A-Za-z0-9]/.test(password) },
    ],
    [password]
  );

  const metCount = requirements.filter(r => r.met).length;
  const strengthPercent = (metCount / requirements.length) * 100;

  const strengthColor =
    strengthPercent <= 20
      ? 'bg-red-500'
      : strengthPercent <= 40
        ? 'bg-orange-500'
        : strengthPercent <= 60
          ? 'bg-yellow-500'
          : strengthPercent <= 80
            ? 'bg-lime-500'
            : 'bg-green-500';

  const strengthLabel =
    strengthPercent <= 20
      ? 'Very weak'
      : strengthPercent <= 40
        ? 'Weak'
        : strengthPercent <= 60
          ? 'Fair'
          : strengthPercent <= 80
            ? 'Good'
            : 'Strong';

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${strengthColor}`}
            style={{ width: `${strengthPercent}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 w-16 text-right">{strengthLabel}</span>
      </div>
      <ul className="space-y-1">
        {requirements.map(req => (
          <li
            key={req.label}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              req.met ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            {req.met ? (
              <CheckIcon className="h-3.5 w-3.5 flex-shrink-0" />
            ) : (
              <XMarkIcon className="h-3.5 w-3.5 flex-shrink-0" />
            )}
            {req.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PasswordStrength;
