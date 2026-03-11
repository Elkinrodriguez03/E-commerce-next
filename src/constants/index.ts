export const API_ENDPOINTS = {
  PRODUCTS: 'https://fakestoreapi.com/products',
} as const;

export const CATEGORIES = {
  CLOTHES: "men's clothing",
  WOMENS_CLOTHING: "women's clothing",
  ELECTRONICS: 'electronics',
  JEWELERY: 'jewelery',
  OTHERS: 'others',
} as const;

export const ROUTES = {
  HOME: '/',
  CLOTHES: '/clothes',
  ELECTRONICS: '/electronics',
  JEWELERY: '/jewelery',
  OTHERS: '/others',
  MY_ACCOUNT: '/my-account',
  MY_ORDER: '/my-order',
  MY_ORDERS: '/my-orders',
  MY_ORDERS_LAST: '/my-orders/last',
  MY_ORDERS_ID: '/my-orders/:id',
  SIGN_IN: '/sign-in',
  NOT_FOUND: '/*',
} as const;

export const LOCAL_STORAGE_KEYS = {
  ACCOUNT: 'account',
  SIGN_OUT: 'sign-out',
} as const;
