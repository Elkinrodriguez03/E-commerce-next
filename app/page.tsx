'use client';

import { memo, useMemo } from 'react';
import Card from '@/components/card';
import LoadingSpinner from '@/components/loadingSpinner';
import ProductDetail from '@/components/productDetail';
import { useProductContext } from '@/context';

const Home = memo(function Home() {
  const { filteredItems, setSearchByTitle, loading, error } = useProductContext();

  const renderView = useMemo(() => {
    if (loading) {
      return <LoadingSpinner size="lg" className="py-20" />;
    }

    if (error) {
      return <div className="text-red-500 py-10">Error: {error}</div>;
    }

    if (filteredItems && filteredItems.length > 0) {
      return filteredItems.map(item => <Card key={item.id} data={item} />);
    } else {
      return <div className="text-gray-500 py-10">Product Not Found!</div>;
    }
  }, [filteredItems, loading, error]);

  return (
    <div className="flex flex-col items-center m-5">
      <div className="flex w-80 items-center relative justify-center mb-3">
        <h1 className="font-medium text-xl">Home</h1>
      </div>
      <input
        className="rounded-lg border border-gray-300 w-80 p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-black"
        type="text"
        placeholder="Search a product"
        onChange={event => setSearchByTitle(event.target.value)}
        aria-label="Search products"
      />
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-screen-lg justify-items-center items-center content-center">
        {renderView}
      </div>
      <ProductDetail />
    </div>
  );
});

export default Home;
