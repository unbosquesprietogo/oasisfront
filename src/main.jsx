import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isTokenValid } from './util/authUtil.js';
import Login from './components/Login.jsx';
import NavigationBar from './components/NavigationBar.jsx';
import CreateProduct from './components/CreateProduct.jsx';
import ProductList from './components/ProductList.jsx';

const App = () => {
  const isAuthenticated = isTokenValid();

  return (
    <BrowserRouter>
      {isAuthenticated && <NavigationBar />}
      <Routes>
        {!isAuthenticated ? (
          <Route path="*" element={<Login />} />
        ) : (
          <>
            <Route path="/create-product" element={<CreateProduct />} />
            <Route path="/product-list" element={<ProductList />} />
            <Route path="*" element={<Navigate to="/product-list" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
