'use client';

import { useRouter } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useProductContext, useAuthContext } from '@/context';
import OrderCard from '../orderCard';
import { totalPrice } from '@/utils';

function CheckoutSideMenu() {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  const {
    isCheckoutSideMenuOpen,
    closeCheckoutSideMenu,
    cartProducts,
    removeFromCart,
    handleCheckout,
    setSearchByTitle,
  } = useProductContext();

  const handleClose = (action?: () => void) => {
    if (action) action();
    closeCheckoutSideMenu();
    setSearchByTitle(undefined);
  };

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      handleClose(() => {
        router.push('/sign-in');
      });
      return;
    }
    handleClose(() => handleCheckout());
  };

  return (
    <aside
      className={`${
        isCheckoutSideMenuOpen ? 'flex' : 'hidden'
      } flex-col fixed top-0 md:top-20 right-0 border rounded-xl bg-white z-40 w-full md:w-[360px] overflow-y-auto h-screen md:h-[calc(100vh-80px)] shadow-xl}`}
    >
      <div className="flex justify-between items-center p-5">
        <h2 className="font-medium text-xl">My Order</h2>
        <div>
          <XMarkIcon
            className="h-6 w-6 text-black cursor-pointer"
            onClick={() => closeCheckoutSideMenu()}
          />
        </div>
      </div>
      <div className="px-5 overflow-y-scroll flex-1">
        {cartProducts.map(product => (
          <OrderCard
            key={product.id}
            id={product.id}
            title={product.title}
            imageUrl={product.image}
            price={product.price}
            handleDelete={removeFromCart}
          />
        ))}
      </div>
      <div className="px-5 mb-5">
        <p className="flex justify-between items-center mb-3">
          <span className="font-light">Total:</span>
          <span className="font-medium text-2xl">${totalPrice(cartProducts)}</span>
        </p>
        <button
          className="bg-black py-3 text-white w-full rounded-lg"
          onClick={handleCheckoutClick}
        >
          {isAuthenticated ? 'Checkout' : 'Sign In to Checkout'}
        </button>
      </div>
    </aside>
  );
}

export default CheckoutSideMenu;
