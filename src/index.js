import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import configureCartStore from './hooks/cart-store';

configureCartStore();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
