'use client';

import Link from 'next/link';
import OrderCard from '@/components/orderCard';
import { useProductContext } from '@/context';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { CartItem } from '@/types';

function MyLastOrder() {
  const { order } = useProductContext();
  const lastIndex = order.length - 1;

  return (
    <div className="m-10">
      <div className="flex w-full items-center relative justify-center">
        <Link href="/my-orders" className="absolute left-0">
          <ChevronLeftIcon className="h-6 w-6 text-black cursor-pointer" />
        </Link>
        <h1 className="font-semibold text-xl">My Order</h1>
      </div>
      <div className="bg-white p-5 mt-5 flex flex-col rounded-xl w-full shadow-lg">
        {order?.[lastIndex]?.products.map((product: CartItem) => (
          <OrderCard
            key={product.id}
            id={product.id}
            title={product.title}
            imageUrl={product.image}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
}

export default MyLastOrder;
