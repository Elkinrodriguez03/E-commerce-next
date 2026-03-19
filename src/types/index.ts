export type Role = 'CUSTOMER' | 'SELLER';

export interface Product {
  id: number | string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
  sellerId?: string;
  stock?: number;
  status?: string;
}

export interface CartItem extends Product {
  quantity?: number;
}

export interface Order {
  id: string;
  date: string;
  products: CartItem[];
  totalProducts: number;
  totalPrice: string;
}

export interface User {
  email?: string;
  name?: string;
  password?: string;
  role?: Role;
}

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  role?: Role;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ShoppingCartContextType {
  // Product Detail
  isProductDetailOpen: boolean;
  openProductDetail: () => void;
  closeProductDetail: () => void;
  productToShow: Product;
  setProductToShow: (product: Product) => void;

  // Shopping Cart
  cartProducts: CartItem[];
  setCartProducts: (products: CartItem[]) => void;
  counter: number;
  setCounter: (count: number) => void;
  addProductsToCart: (event: React.MouseEvent, productData: Product) => void;
  removeProductFromCart: (id: number) => void;

  // Checkout Side Menu
  isCheckoutSideMenuOpen: boolean;
  openCheckoutSideMenu: () => void;
  closeCheckoutSideMenu: () => void;

  // Orders
  order: Order[];
  setOrder: (orders: Order[]) => void;
  handleCheckout: () => void;

  // Products
  items: Product[] | undefined;
  setItems: (items: Product[]) => void;
  filteredItems: Product[] | undefined;
  searchByTitle: string | undefined;
  setSearchByTitle: (title: string | undefined) => void;
  searchByCategory: string | undefined;
  setSearchByCategory: (category: string | undefined) => void;

  // Authentication
  account: User;
  setAccount: (account: User) => void;
  signOut: boolean;
  setSignOut: (signOut: boolean) => void;
}

export type SearchType = 'BY_TITLE' | 'BY_CATEGORY' | 'BY_TITLE_AND_CATEGORY';

export interface LayoutProps {
  children: React.ReactNode;
}

export interface CardProps {
  data: Product;
}

export interface SellerProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface SellerDashboardStats {
  totalProducts: number;
  activeProducts: number;
  draftProducts: number;
  totalStock: number;
}
