'use client';

import { XMarkIcon } from '@heroicons/react/24/solid';
import { useProductContext } from '@/context';

function ProductDetail() {
  const { isProductDetailOpen, closeProductDetail, productToShow, addToCart } = useProductContext();

  return (
    <aside
      className={`${
        isProductDetailOpen ? 'flex' : 'hidden'
      } flex-col fixed top-0 md:top-20 right-0 border rounded-xl bg-white z-40 w-full md:w-[360px] overflow-y-auto h-screen md:h-[calc(100vh-80px)] shadow-xl`}
    >
      <div className="flex justify-between items-center p-5">
        <h2 className="font-medium text-xl">Detail</h2>
        <div>
          <XMarkIcon
            className="h-6 w-6 text-black cursor-pointer"
            onClick={() => closeProductDetail()}
          />
        </div>
      </div>
      <figure className="px-6">
        <img
          className="w-full h-full max-h-80 object-scale-down rounded-lg"
          src={productToShow.image}
          alt={productToShow.title}
        />
      </figure>
      <p className="flex flex-col p-6">
        <span className="font-medium text-2x1 mb-2">${productToShow.price}</span>
        <span className="font-medium text-md">{productToShow.title}</span>
        <span className="font-light text-xs">{productToShow.description}</span>
        {productToShow.stock !== undefined && (
          <span
            className={`text-xs font-medium mt-2 ${
              productToShow.stock <= 0
                ? 'text-red-500'
                : productToShow.stock < 5
                  ? 'text-orange-500'
                  : 'text-green-600'
            }`}
          >
            {productToShow.stock <= 0
              ? 'Out of Stock'
              : productToShow.stock < 5
                ? `Only ${productToShow.stock} left — order soon`
                : `${productToShow.stock} in stock`}
          </span>
        )}
      </p>
      <div className="items-center p-6 fixed bottom-0 left-0 right-0 md:absolute">
        {productToShow.stock !== undefined && productToShow.stock <= 0 ? (
          <button
            className="bg-gray-300 py-3 text-gray-500 w-full rounded-lg cursor-not-allowed"
            disabled
          >
            Out of Stock
          </button>
        ) : (
          <button
            className="bg-black py-3 text-white w-full rounded-lg"
            onClick={event => addToCart(event, productToShow)}
          >
            Add to Cart
          </button>
        )}
      </div>
    </aside>
  );
}

export default ProductDetail;
