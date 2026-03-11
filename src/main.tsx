import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/app';
import Layout from './components/layout';
import ErrorBoundary from './components/errorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Layout>
        <App />
      </Layout>
    </ErrorBoundary>
  </React.StrictMode>
);
