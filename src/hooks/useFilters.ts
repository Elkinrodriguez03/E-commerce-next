import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { filterByTitle, filterByCategory, filterByTitleAndCategory } from '@/utils';

export const useFilters = (items: Product[] | undefined) => {
  const [searchByTitle, setSearchByTitle] = useState<string>();
  const [searchByCategory, setSearchByCategory] = useState<string>();
  const [filteredItems, setFilteredItems] = useState<Product[]>();

  useEffect(() => {
    if (searchByTitle && searchByCategory) {
      setFilteredItems(filterByTitleAndCategory(items, searchByTitle, searchByCategory));
    } else if (searchByTitle && !searchByCategory) {
      setFilteredItems(filterByTitle(items, searchByTitle));
    } else if (!searchByTitle && searchByCategory) {
      setFilteredItems(filterByCategory(items, searchByCategory));
    } else {
      setFilteredItems(items);
    }
  }, [items, searchByTitle, searchByCategory]);

  return {
    searchByTitle,
    setSearchByTitle,
    searchByCategory,
    setSearchByCategory,
    filteredItems,
  };
};
