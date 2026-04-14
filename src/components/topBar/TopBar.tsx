'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/context';
import { useProductContext } from '@/context';
import { ShoppingBag, User, Heart, LogOut, Package, ChevronDown, Menu, X } from 'lucide-react';
import ScopedSearch from './ScopedSearch';

export default function TopBar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthContext();
  const { cartProducts, openCheckoutSideMenu, setSearchByCategory } = useProductContext();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isSeller = isAuthenticated && user?.role === 'SELLER';

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const cartCount = cartProducts.length;

  return (
    <>
      {/* ── Announcement bar ──────────────────────────────────── */}
      <div className="bg-black text-white text-center text-xs py-1.5 font-medium tracking-wide">
        Free shipping on orders over $50 ·{' '}
        <span className="underline underline-offset-2 cursor-pointer">Shop now</span>
      </div>

      {/* ── Main top bar ──────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          {/* Desktop layout (md+) */}
          <div className="hidden md:flex items-center gap-6 px-6 py-3">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <ShoppingBag className="h-7 w-7 text-black" strokeWidth={1.8} />
              <span className="text-lg font-bold tracking-tight text-gray-900">Shop</span>
            </Link>

            {/* Center-aligned scoped search */}
            <div className="flex-1 flex justify-center">
              <ScopedSearch />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1 shrink-0">
              {isSeller && (
                <Link
                  href="/admin"
                  className="text-xs font-medium text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Dashboard
                </Link>
              )}

              {/* Wishlist */}
              <button
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" strokeWidth={1.8} />
              </button>

              {/* Cart */}
              <button
                onClick={openCheckoutSideMenu}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
                aria-label={`Shopping cart, ${cartCount} items`}
              >
                <ShoppingBag className="h-5 w-5" strokeWidth={1.8} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-black text-white text-[10px] font-bold rounded-full px-1">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>

              {/* Account */}
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-1.5 p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-haspopup="true"
                    aria-expanded={profileOpen}
                    aria-label="Account menu"
                  >
                    <div className="h-6 w-6 rounded-full bg-gray-900 flex items-center justify-center text-white text-[10px] font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link
                        href="/my-account"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="h-4 w-4 text-gray-400" />
                        My Account
                      </Link>
                      <Link
                        href="/my-orders"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Package className="h-4 w-4 text-gray-400" />
                        My Orders
                      </Link>
                      <div className="border-t border-gray-100">
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/sign-in"
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile layout (<md) */}
          <div className="flex md:hidden items-center gap-2 px-4 py-2.5">
            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Brand */}
            <Link href="/" className="flex items-center gap-1.5 shrink-0">
              <ShoppingBag className="h-6 w-6 text-black" strokeWidth={1.8} />
              <span className="text-base font-bold text-gray-900">Shop</span>
            </Link>

            <div className="flex-1" />

            {/* Cart (mobile) */}
            <button
              onClick={openCheckoutSideMenu}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg relative transition-colors"
              aria-label={`Shopping cart, ${cartCount} items`}
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-black text-white text-[10px] font-bold rounded-full px-1">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile search row */}
          <div className="md:hidden px-4 pb-3">
            <ScopedSearch />
          </div>
        </div>

        {/* Mobile navigation drawer */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/30 z-30 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="absolute left-0 right-0 top-full bg-white border-b border-gray-200 shadow-lg z-40 md:hidden">
              <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
                <MobileNavLink
                  href="/"
                  label="All Products"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchByCategory(undefined);
                  }}
                />
                <MobileNavLink
                  href="/clothes"
                  label="Clothing"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchByCategory("men's clothing");
                  }}
                />
                <MobileNavLink
                  href="/electronics"
                  label="Electronics"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchByCategory('electronics');
                  }}
                />
                <MobileNavLink
                  href="/jewelery"
                  label="Jewelery"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchByCategory('jewelery');
                  }}
                />
                <MobileNavLink
                  href="/others"
                  label="Others"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchByCategory('others');
                  }}
                />

                {isAuthenticated ? (
                  <>
                    <div className="border-t border-gray-100 my-2" />
                    <MobileNavLink
                      href="/my-account"
                      label="My Account"
                      onClick={() => setMobileMenuOpen(false)}
                    />
                    <MobileNavLink
                      href="/my-orders"
                      label="My Orders"
                      onClick={() => setMobileMenuOpen(false)}
                    />
                    {isSeller && (
                      <MobileNavLink
                        href="/admin"
                        label="Seller Dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                      />
                    )}
                    <div className="border-t border-gray-100 my-2" />
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2.5 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <div className="border-t border-gray-100 my-2" />
                    <MobileNavLink
                      href="/sign-in"
                      label="Sign In"
                      onClick={() => setMobileMenuOpen(false)}
                    />
                    <MobileNavLink
                      href="/sign-up"
                      label="Create Account"
                      onClick={() => setMobileMenuOpen(false)}
                    />
                  </>
                )}
              </nav>
            </div>
          </>
        )}
      </header>

      {/* Category navigation strip (desktop only) */}
      <nav className="hidden md:block bg-gray-900" aria-label="Product categories">
        <div className="max-w-7xl mx-auto px-6">
          <ul className="flex items-center gap-0 overflow-x-auto">
            <CategoryTab href="/" label="All" onClick={() => setSearchByCategory(undefined)} />
            <CategoryTab
              href="/clothes"
              label="Clothing"
              onClick={() => setSearchByCategory("men's clothing")}
            />
            <CategoryTab
              href="/electronics"
              label="Electronics"
              onClick={() => setSearchByCategory('electronics')}
            />
            <CategoryTab
              href="/jewelery"
              label="Jewelery"
              onClick={() => setSearchByCategory('jewelery')}
            />
            <CategoryTab
              href="/others"
              label="Others"
              onClick={() => setSearchByCategory('others')}
            />
          </ul>
        </div>
      </nav>
    </>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────── */

function CategoryTab({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={`relative inline-block px-4 py-2.5 text-xs font-medium transition-colors ${
          isActive ? 'text-white' : 'text-gray-400 hover:text-white'
        }`}
      >
        {label}
        {isActive && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-white rounded-full" />
        )}
      </Link>
    </li>
  );
}

function MobileNavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'text-gray-900 bg-gray-100'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      {label}
    </Link>
  );
}
