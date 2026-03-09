import Card from '@/components/card';
import ProductDetail from '@/components/productDetail';
import { useProductContext } from '@/context';

function Home() {
  const { filteredItems, setSearchByTitle } = useProductContext();

  const renderView = () => {
    if (filteredItems && filteredItems.length > 0) {
      return filteredItems.map(item => <Card key={item.id} data={item} />);
    } else {
      return <div>Product Not Found!</div>;
    }
  };

  return (
    <div className="flex flex-col items-center m-5">
      <div className="flex w-80 items-center relative justify-center mb-3">
        <h1 className="font-medium text-xl">Home</h1>
      </div>
      <input
        className="rounded-lg border border-gray-300 w-80 p-3 mb-3 focus:outline-none"
        type="text"
        placeholder="Search a product"
        onChange={event => setSearchByTitle(event.target.value)}
      />
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-screen-lg justify-items-center items-center content-center">
        {renderView()}
      </div>
      <ProductDetail />
    </div>
  );
}

export default Home;
