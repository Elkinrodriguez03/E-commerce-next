'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context';
import { useProductContext } from '@/context';
import {
  Package,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  ShoppingBag,
  Edit3,
} from 'lucide-react';

function MyAccount() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthContext();
  const { order, favoritesCount, cartProducts } = useProductContext();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!isAuthenticated) {
    router.push('/sign-in');
    return null;
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const stats = [
    { label: 'Orders', value: order.length, icon: Package },
    { label: 'Wishlist', value: favoritesCount, icon: Heart },
    { label: 'Cart Items', value: cartProducts.length, icon: ShoppingBag },
  ];

  const menuSections = [
    {
      title: 'Shopping',
      items: [
        {
          label: 'My Orders',
          href: '/my-orders',
          icon: Package,
          subtitle: `${order.length} orders placed`,
        },
        {
          label: 'Wishlist',
          href: '/favorites',
          icon: Heart,
          subtitle: `${favoritesCount} products saved`,
        },
        {
          label: 'Recently Viewed',
          href: '#',
          icon: ShoppingBag,
          subtitle: 'Your browsing history',
        },
      ],
    },
    {
      title: 'Account Settings',
      items: [
        { label: 'Addresses', href: '#', icon: MapPin, subtitle: 'Manage delivery addresses' },
        {
          label: 'Payment Methods',
          href: '#',
          icon: CreditCard,
          subtitle: 'Saved cards & wallets',
        },
        { label: 'Notifications', href: '#', icon: Bell, subtitle: 'Email & push preferences' },
        {
          label: 'Privacy & Security',
          href: '#',
          icon: Shield,
          subtitle: 'Password & data settings',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Avatar */}
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-900 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shrink-0">
              {initials}
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                  {user?.name || 'User'}
                </h1>
                <button
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label="Edit profile"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 truncate mt-0.5">{user?.email}</p>
              <span className="inline-flex items-center mt-2 px-2 py-0.5 text-[11px] font-medium bg-gray-100 text-gray-600 rounded-md">
                {user?.role === 'SELLER' ? 'Seller Account' : 'Customer'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-gray-300 transition-colors"
              >
                <Icon className="h-5 w-5 text-gray-400 mx-auto mb-1.5" strokeWidth={1.8} />
                <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                <p className="text-[11px] text-gray-500 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Menu sections */}
        {menuSections.map(section => (
          <div key={section.title}>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-2">
              {section.title}
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
              {section.items.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3.5 px-4 py-3.5 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-gray-200 transition-colors">
                      <Icon className="h-4.5 w-4.5 text-gray-600" strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-400 transition-colors shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Sign out */}
        <div className="pt-2">
          {showLogoutConfirm ? (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-700 font-medium mb-3">
                Are you sure you want to sign out?
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                  className="flex-1 bg-gray-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Sign Out
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] text-gray-400 pb-4">
          Member since {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

export default MyAccount;
