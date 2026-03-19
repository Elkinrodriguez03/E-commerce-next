'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuthContext } from '@/context';
import { useProductContext } from '@/context';
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ShoppingBagIcon } from '@heroicons/react/20/solid';

function NavItem({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const activeStyle = 'underline underline-offset-4';

  return (
    <li>
      <Link href={href} className={isActive ? activeStyle : undefined} onClick={onClick}>
        {label}
      </Link>
    </li>
  );
}

function Navbar() {
  const { user, isAuthenticated, logout } = useAuthContext();
  const { setSearchByCategory, openCheckoutSideMenu, cartProducts } = useProductContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenuAndDoAction = (action?: () => void) => {
    if (action) action();
    setIsMenuOpen(false);
  };

  const isSeller = isAuthenticated && user?.role === 'SELLER';

  const renderView = () => {
    if (!isAuthenticated) {
      return <NavItem href="/sign-in" label="Sign In" onClick={() => closeMenuAndDoAction()} />;
    } else {
      return (
        <>
          <li className="text-black/60">{user?.email || 'demo@ecommerce.com'}</li>
          {isSeller ? (
            <>
              <NavItem
                href="/seller/dashboard"
                label="Dashboard"
                onClick={() => closeMenuAndDoAction()}
              />
              <NavItem
                href="/seller/products/new"
                label="Add Product"
                onClick={() => closeMenuAndDoAction()}
              />
            </>
          ) : (
            <>
              <NavItem href="/my-orders" label="My Orders" onClick={() => closeMenuAndDoAction()} />
              <NavItem
                href="/my-account"
                label="My Account"
                onClick={() => closeMenuAndDoAction()}
              />
            </>
          )}
          <NavItem
            href="/sign-in"
            label="Sign out"
            onClick={() => closeMenuAndDoAction(() => logout())}
          />
        </>
      );
    }
  };

  return (
    <nav className="bg-gray-100 shadow-md flex justify-between items-center fixed z-10 top-0 w-full py-5 px-8 text-sm font-light">
      <ul className="flex items-center gap-3 ">
        <li>
          <ShoppingBagIcon className="w-8 h-8 text-black" />
        </li>
        <li className="font-semibold text-lg">
          <Link href="/">Shop</Link>
        </li>
      </ul>
      <div className="md:hidden">
        <button onClick={toggleMenu}>
          {isMenuOpen ? (
            <XMarkIcon className="w-8 h-8 text-gray-700" />
          ) : (
            <Bars3Icon className="w-8 h-8 text-black" />
          )}
        </button>
      </div>

      {isMenuOpen && <div className="fixed z-20 md:hidden" onClick={toggleMenu}></div>}
      <div
        className={`
          fixed top-0 right-0 h-full w-64 bg-gray-100 shadow-lg p-5
          transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          md:relative md:flex md:h-auto md:w-auto md:p-0 md:shadow-none md:transform-none md:justify-end md:gap-3 md:flex-grow
        `}
      >
        <button
          onClick={toggleMenu}
          className="md:hidden absolute top-4 right-4 focus:outline-none text-black"
        >
          <XMarkIcon className="h-7 w-7" />
        </button>
        <h1 className="md:hidden text-2xl font-semibold mb-3 md:mb-0 md:text-lg mt-3 md:mt-0">
          Menu
        </h1>
        <ul className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-3 mt-10 md:mt-0 md:pr-3 md:border-r border-gray-500">
          <NavItem
            href="/"
            label="All"
            onClick={() => closeMenuAndDoAction(() => setSearchByCategory(undefined))}
          />
          <NavItem
            href="/clothes"
            label="clothes"
            onClick={() => closeMenuAndDoAction(() => setSearchByCategory("men's clothing"))}
          />
          <NavItem
            href="/electronics"
            label="electronics"
            onClick={() => closeMenuAndDoAction(() => setSearchByCategory('electronics'))}
          />
          <NavItem
            href="/jewelery"
            label="Jewelery"
            onClick={() => closeMenuAndDoAction(() => setSearchByCategory('jewelery'))}
          />
          <NavItem
            href="/others"
            label="others"
            onClick={() => closeMenuAndDoAction(() => setSearchByCategory('others'))}
          />
        </ul>
        <ul className="flex flex-col md:flex-row items-start md:items-center z-10 gap-4 md:gap-3 mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-gray-300 md:border-trasnparent">
          {renderView()}
          <li className="flex items-center cursor-pointer">
            <ShoppingCartIcon
              className="w-6 h-6 text-black"
              onClick={() => closeMenuAndDoAction(() => openCheckoutSideMenu())}
            />
            <div>{cartProducts.length}</div>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
