import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/app';
import Layout from './components/layout';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Layout>
      <App />
    </Layout>
  </React.StrictMode>
);
