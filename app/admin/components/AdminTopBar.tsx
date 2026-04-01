'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/context';
import { Search, Bell, ChevronDown, ExternalLink, LogOut, User, Menu } from 'lucide-react';

interface AdminTopBarProps {
  onToggleSidebar: () => void;
}

export default function AdminTopBar({ onToggleSidebar }: AdminTopBarProps) {
  const { user, logout } = useAuthContext();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-gray-950 text-white z-40 flex items-center px-3 sm:px-4 gap-2 sm:gap-4">
      {/* Mobile hamburger */}
      <button
        onClick={onToggleSidebar}
        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Logo / Brand */}
      <Link href="/admin" className="flex items-center gap-2 mr-2 sm:mr-4 shrink-0">
        <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
          S
        </div>
        <span className="text-sm font-semibold hidden md:block">Store Admin</span>
      </Link>

      {/* Search */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search products, orders..."
            className="w-full bg-gray-800 text-sm text-gray-200 placeholder-gray-500 rounded-lg pl-9 pr-3 py-2 border border-gray-700 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
        {/* Mobile search button */}
        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors sm:hidden">
          <Search className="h-[18px] w-[18px]" />
        </button>

        {/* View Store */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">View Store</span>
        </Link>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-emerald-500 rounded-full" />
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="h-7 w-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'S'}
            </div>
            <span className="text-sm text-gray-300 hidden lg:block max-w-[100px] truncate">
              {user?.name || 'Seller'}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-500 hidden lg:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <Link
                href="/admin"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
