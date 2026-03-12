'use client';

import Link from 'next/link';
import OrdersCard from '@/components/ordersCard';
import { useProductContext } from '@/context';
import { Order } from '@/types';

function MyOrders() {
  const { order } = useProductContext();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="mt-10 mb-5">
        <h1 className="font-semibold text-xl">My Orders</h1>
      </div>
      {order.map((o: Order, index: number) => (
        <Link key={index} href={`/my-orders/${index}`}>
          <OrdersCard date={o.date} totalPrice={o.totalPrice} totalProducts={o.totalProducts} />
        </Link>
      ))}
    </div>
  );
}

export default MyOrders;
