import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isTokenValid } from './util/authUtil.js';
import Login from './components/Login.jsx';
import NavigationBar from './components/NavigationBar.jsx';
import CreateProduct from './components/CreateProduct.jsx';
import ProductList from './components/ProductList.jsx';
import CreateCombos from './components/CreateCombo.jsx';
import Register from './components/Register.jsx';
import ComboList from './components/ComboList.jsx';
import CreateSell from './components/CreateSell.jsx';
import SellList from './components/SellList.jsx';
import Config from './components/Config.jsx';


const App = () => {
  const isAuthenticated = isTokenValid();

  return (
    <BrowserRouter>
      {isAuthenticated && <NavigationBar />}
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Login />} />
          </>
        ) : (
          <>
            <Route path="/create-product" element={<CreateProduct />} />
            <Route path="/product-list" element={<ProductList />} />
            <Route path="/create-combo" element={<CreateCombos />} />
            <Route path="/combo-list" element={<ComboList />} />
            <Route path="/create-sell" element={<CreateSell />} />
            <Route path="/sell-list" element={<SellList />} />
            <Route path="/config" element={<Config />} />
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
