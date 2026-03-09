import { ChevronRightIcon } from '@heroicons/react/24/solid';

interface OrdersCardProps {
  date: string;
  totalPrice: string;
  totalProducts: number;
}

function OrdersCard({ date, totalPrice, totalProducts }: OrdersCardProps) {
  return (
    <div className="flex justify-between items-center shadow-lg bg-white m-3 p-5 rounded-lg w-96 cursor-pointer">
      <div className="flex justify-between w-full">
        <p className="flex flex-col">
          <span className="font-normal mb-1">{totalProducts} Articles</span>
          <span className="font-medium">Completed at: </span>
          <span className="font-light">{date}</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-medium text-2xl">${totalPrice}</span>
          <ChevronRightIcon className="h-6 w-6 text-black cursor-pointer" />
        </p>
      </div>
    </div>
  );
}

export default OrdersCard;
