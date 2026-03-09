import { CartItem, Product } from '@/types';

export const totalPrice = (products: CartItem[]): string => {
  const sum = products.reduce((total, product) => total + product.price, 0);
  return sum.toFixed(2);
};

export const initializeLocalStorage = (): void => {
  const accountInLocalStorage = localStorage.getItem('account');
  const signOutInLocalStorage = localStorage.getItem('sign-out');

  if (!accountInLocalStorage) {
    localStorage.setItem('account', JSON.stringify({}));
  }

  if (!signOutInLocalStorage) {
    localStorage.setItem('sign-out', JSON.stringify(false));
  }
};

export const formatDateTime = (): string => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = String(today.getFullYear()).slice(-2);
  const formattedDate = `${day}-${month}-${year}`;

  const hours = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;

  return `${formattedDate} ${formattedTime}`;
};

export const filterByTitle = (
  items: Product[] | undefined,
  searchByTitle: string | undefined
): Product[] => {
  if (!items || !searchByTitle) return items || [];
  return items.filter(item => item.title.toLowerCase().includes(searchByTitle.toLowerCase()));
};

export const filterByCategory = (
  items: Product[] | undefined,
  searchByCategory: string | undefined
): Product[] => {
  if (!items || !searchByCategory) return items || [];
  return items.filter(item => item.category.toLowerCase().includes(searchByCategory.toLowerCase()));
};

export const filterByTitleAndCategory = (
  items: Product[] | undefined,
  searchByTitle: string | undefined,
  searchByCategory: string | undefined
): Product[] => {
  if (!items || !searchByTitle || !searchByCategory) return items || [];
  return items
    .filter(item => item.category.toLowerCase().includes(searchByCategory.toLowerCase()))
    .filter(item => item.title.toLowerCase().includes(searchByTitle.toLowerCase()));
};
