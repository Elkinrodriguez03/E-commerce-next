'use client';

import { memo, useMemo } from 'react';
import Card from '@/components/card';
import LoadingSpinner from '@/components/loadingSpinner';
import ProductDetail from '@/components/productDetail';
import { useProductContext } from '@/context';

const Home = memo(function Home() {
  const { filteredItems, loading, error } = useProductContext();

  const renderView = useMemo(() => {
    if (error) {
      return <div className="text-red-500 py-10">Error: {error}</div>;
    }

    if (filteredItems && filteredItems.length > 0) {
      return filteredItems.map(item => <Card key={item.id} data={item} />);
    } else {
      return <div className="text-gray-500 py-10">Product Not Found!</div>;
    }
  }, [filteredItems, error]);

  return (
    <div className="flex flex-col items-center m-5">
      <div className="flex w-80 items-center relative justify-center mb-3 mt-3">
        <h1 className="font-medium text-xl">Home</h1>
      </div>
      {loading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : (
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-screen-lg justify-items-center items-center content-center">
          {renderView}
        </div>
      )}
      <ProductDetail />
    </div>
  );
});

export default Home;
