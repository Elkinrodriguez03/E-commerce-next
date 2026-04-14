'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/context';
import { useProductContext } from '@/context';
import { Home, Package, Heart, User, ShoppingBag } from 'lucide-react';

interface TabItem {
  href: string;
  label: string;
  icon: typeof Home;
  badge?: number;
  action?: () => void;
}

export default function MobileBottomTabBar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthContext();
  const { cartProducts, openCheckoutSideMenu } = useProductContext();

  const cartCount = cartProducts.length;

  const tabs: TabItem[] = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/my-orders', label: 'Orders', icon: Package },
    { href: '#wishlist', label: 'Saved', icon: Heart },
    {
      href: '#cart',
      label: 'Cart',
      icon: ShoppingBag,
      badge: cartCount,
      action: openCheckoutSideMenu,
    },
    {
      href: isAuthenticated ? '/my-account' : '/sign-in',
      label: isAuthenticated ? 'Profile' : 'Sign In',
      icon: User,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200 md:hidden safe-area-bottom"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <ul className="flex items-center justify-around h-14 max-w-lg mx-auto px-1">
        {tabs.map(tab => {
          const isActive =
            tab.href === '/'
              ? pathname === '/'
              : tab.href.startsWith('#')
                ? false
                : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          const content = (
            <span
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors relative ${
                isActive ? 'text-black' : 'text-gray-400 active:text-gray-600'
              }`}
            >
              <span className="relative">
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.2 : 1.6} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 flex items-center justify-center bg-black text-white text-[9px] font-bold rounded-full px-1">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                ) : null}
              </span>
              <span className="text-[10px] font-medium leading-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-black rounded-full" />
              )}
            </span>
          );

          if (tab.action) {
            return (
              <li key={tab.label}>
                <button
                  onClick={tab.action}
                  className="block"
                  aria-label={`${tab.label}${tab.badge ? `, ${tab.badge} items` : ''}`}
                >
                  {content}
                </button>
              </li>
            );
          }

          return (
            <li key={tab.label}>
              <Link
                href={tab.href}
                className="block"
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {content}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
