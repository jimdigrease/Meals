import { useState } from 'react';

import Header from './components/Layout/Header';
import Meals from './components/Meals/Meals';
import CartProvider from './store/CartProvider';
import Cart from './components/Cart/Cart';

function App() {
  const [isCartShown, setIsCartShown] = useState(false);

  function showCartHandler() {
    setIsCartShown(true);
  }

  function hideCartHandler() {
    setIsCartShown(false);
  }

  return (
    <CartProvider>
      {isCartShown && <Cart />}
      <Header onShowCart={showCartHandler} />
      <main>
        <Meals />
      </main>
    </CartProvider>
  );
}

export default App;
