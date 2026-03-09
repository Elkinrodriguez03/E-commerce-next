import { useState } from 'react';
import { Product } from '@/types';

export const useUI = () => {
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [isCheckoutSideMenuOpen, setIsCheckoutSideMenuOpen] = useState(false);
  const [productToShow, setProductToShow] = useState<Product>({
    id: 0,
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
  });

  const openProductDetail = () => {
    setIsCheckoutSideMenuOpen(false);
    setIsProductDetailOpen(true);
  };

  const closeProductDetail = () => setIsProductDetailOpen(false);

  const openCheckoutSideMenu = () => {
    setIsProductDetailOpen(false);
    setIsCheckoutSideMenuOpen(true);
  };

  const closeCheckoutSideMenu = () => setIsCheckoutSideMenuOpen(false);

  return {
    isProductDetailOpen,
    openProductDetail,
    closeProductDetail,
    productToShow,
    setProductToShow,
    isCheckoutSideMenuOpen,
    openCheckoutSideMenu,
    closeCheckoutSideMenu,
  };
};
