'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import OrderCard from '@/components/orderCard';
import { useProductContext } from '@/context';
import { CartItem } from '@/types';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

function MyOrder() {
  const { order } = useProductContext();
  const params = useParams();
  const id = params.id as string;

  const orderIndex = parseInt(id, 10);

  return (
    <div className="m-10">
      <div className="flex w-full items-center relative justify-center">
        <Link href="/my-orders" className="absolute left-0">
          <ChevronLeftIcon className="h-6 w-6 text-black cursor-pointer" />
        </Link>
        <h1 className="font-semibold text-xl">My Order</h1>
      </div>
      <div className="bg-white p-5 mt-5 flex flex-col rounded-xl w-full shadow-lg">
        {order?.[orderIndex]?.products.map((product: CartItem) => (
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

export default MyOrder;
