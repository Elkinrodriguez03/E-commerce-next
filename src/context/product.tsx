import { createContext, ReactNode, useCallback, useState } from 'react';
import { CartItem, Order, Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { useFilters } from '@/hooks/useFilters';
import { useProducts } from '@/hooks/useProducts';

interface ProductContextType {
  // Products data
  items: Product[] | undefined;
  loading: boolean;
  error: string | null;

  // Filtering
  filteredItems: Product[] | undefined;
  searchByTitle: string | undefined;
  setSearchByTitle: (title: string | undefined) => void;
  searchByCategory: string | undefined;
  setSearchByCategory: (category: string | undefined) => void;

  // Cart operations
  cartProducts: CartItem[];
  addToCart: (event: React.MouseEvent, product: Product) => void;
  removeFromCart: (id: number | string) => void;
  clearCart: () => void;

  // Orders
  order: Order[];
  handleCheckout: () => void;

  // UI state
  isProductDetailOpen: boolean;
  openProductDetail: () => void;
  closeProductDetail: () => void;
  productToShow: Product;
  setProductToShow: (product: Product) => void;
  isCheckoutSideMenuOpen: boolean;
  openCheckoutSideMenu: () => void;
  closeCheckoutSideMenu: () => void;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

const defaultProduct: Product = {
  id: 0,
  title: '',
  price: 0,
  description: '',
  category: '',
  image: '/placeholder.svg',
};

export function ProductProvider({ children }: { children: ReactNode }) {
  const { items, loading, error } = useProducts();
  const { filteredItems, searchByTitle, setSearchByTitle, searchByCategory, setSearchByCategory } =
    useFilters(items);

  const {
    cartProducts,
    addProductsToCart,
    removeProductFromCart,
    clearCart,
    order,
    handleCheckout,
  } = useCart();

  const {
    isProductDetailOpen,
    openProductDetail,
    closeProductDetail,
    productToShow,
    setProductToShow,
    isCheckoutSideMenuOpen,
    openCheckoutSideMenu,
    closeCheckoutSideMenu,
  } = useUIState();

  const addToCart = useCallback(
    (event: React.MouseEvent, product: Product) => {
      event.stopPropagation();
      addProductsToCart(event, product as CartItem);
      openCheckoutSideMenu();
      closeProductDetail();
    },
    [addProductsToCart, openCheckoutSideMenu, closeProductDetail]
  );

  const removeFromCart = useCallback(
    (id: number | string) => {
      removeProductFromCart(id);
    },
    [removeProductFromCart]
  );

  return (
    <ProductContext.Provider
      value={{
        items,
        loading,
        error,
        filteredItems,
        searchByTitle,
        setSearchByTitle,
        searchByCategory,
        setSearchByCategory,
        cartProducts,
        addToCart,
        removeFromCart,
        clearCart,
        order,
        handleCheckout,
        isProductDetailOpen,
        openProductDetail,
        closeProductDetail,
        productToShow,
        setProductToShow,
        isCheckoutSideMenuOpen,
        openCheckoutSideMenu,
        closeCheckoutSideMenu,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

// Helper hook for UI state management
function useUIState() {
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [isCheckoutSideMenuOpen, setIsCheckoutSideMenuOpen] = useState(false);
  const [productToShow, setProductToShow] = useState<Product>(defaultProduct);

  const openProductDetail = useCallback(() => {
    setIsCheckoutSideMenuOpen(false);
    setIsProductDetailOpen(true);
  }, []);

  const closeProductDetail = useCallback(() => {
    setIsProductDetailOpen(false);
  }, []);

  const openCheckoutSideMenu = useCallback(() => {
    setIsProductDetailOpen(false);
    setIsCheckoutSideMenuOpen(true);
  }, []);

  const closeCheckoutSideMenu = useCallback(() => {
    setIsCheckoutSideMenuOpen(false);
  }, []);

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
}
