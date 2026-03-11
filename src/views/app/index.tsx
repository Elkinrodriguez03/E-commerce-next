import { useRoutes, BrowserRouter } from 'react-router-dom';
import { AuthProvider, ProductProvider } from '@/context';
import { initializeLocalStorage } from '@/utils';
import Home from '../home';
import MyAccount from '../myAccount';
import MyOrder from '../myOrder';
import MyOrders from '../myOrders';
import SignIn from '../signIn';
import NotFound from '../notFound';
import Navbar from '@/components/navbar';
import CheckoutSideMenu from '@/components/checkoutSideMenu';
import './App.css';

initializeLocalStorage();

const AppRoutes = () => {
  const routes = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/clothes', element: <Home /> },
    { path: '/electronics', element: <Home /> },
    { path: '/jewelery', element: <Home /> },
    { path: '/others', element: <Home /> },
    { path: '/my-account', element: <MyAccount /> },
    { path: '/my-order', element: <MyOrder /> },
    { path: '/my-orders', element: <MyOrders /> },
    { path: '/my-orders/last', element: <MyOrder /> },
    { path: '/my-orders/:id', element: <MyOrder /> },
    { path: '/sign-in', element: <SignIn /> },
    { path: '/*', element: <NotFound /> },
  ]);

  return routes;
};

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <BrowserRouter>
          <AppRoutes />
          <Navbar />
          <CheckoutSideMenu />
        </BrowserRouter>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
