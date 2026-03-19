'use client';

import { memo } from 'react';
import { useProductContext } from '@/context';
import { Product } from '@/types';
import { CheckIcon, PlusIcon } from '@heroicons/react/24/outline';

interface CardProps {
  data: Product;
}

const Card = memo(function Card({ data }: CardProps) {
  const { openProductDetail, setProductToShow, cartProducts, addToCart, removeFromCart } =
    useProductContext();

  const showProduct = (productDetail: Product) => {
    openProductDetail();
    setProductToShow(productDetail);
  };

  const renderIcon = (id: number | string) => {
    const isInCart = cartProducts.filter(product => product.id === id).length > 0;

    if (isInCart) {
      return (
        <button
          className="absolute top-0 right-0 flex justify-center items-center bg-green-500 w-6 h-6 rounded-full m-3 p-1"
          onClick={() => removeFromCart(id)}
          aria-label="Remove from cart"
        >
          <CheckIcon className="w-6 h-6 text-white" />
        </button>
      );
    } else {
      return (
        <button
          className="absolute top-0 right-0 flex justify-center items-center bg-gray-100 w-6 h-6 rounded-full m-3 p-1"
          onClick={event => addToCart(event, data)}
          aria-label="Add to cart"
        >
          <PlusIcon className="w-6 h-6 text-black" />
        </button>
      );
    }
  };

  return (
    <div className="bg-white cursor-pointer w-full max-w-sm rounded-lg m-10 shadow-lg">
      <figure className="relative mb-3 w-full h-80 sm:h-80 md:h-64 lg:h-72 overflow-hidden rounded-t-lg p-5">
        <span className="absolute bottom-0 left-0 bg-gray-200 rounded-lg text-black text-xs m-3 px-3 py-0.5">
          {data.category}
        </span>
        <img
          className="w-full h-full object-scale-down rounded-lg"
          src={data.image}
          alt={data.title}
          onClick={() => showProduct(data)}
          loading="lazy"
        />
        {renderIcon(data.id)}
      </figure>
      <p className="flex flex-col md:flex-row justify-between px-5 pb-5">
        <span className="text-xs font-light">{data.title}</span>
        <span className="text-lg font-medium md:ml-2">${data.price}</span>
      </p>
    </div>
  );
});

export default Card;
