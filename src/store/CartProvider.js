import { useReducer } from 'react';

import CartContext from './cart-context';

const defaultCartState = {
  items: [], 
  totalAmount: 0
};

function cartReducer(state, action) {
  if (action.type === 'ADD') {
    const existingItemId = state.items.findIndex(
      (item) => item.id === action.item.id
    );
    const existingItem = state.items[existingItemId];
    
    let updatedItems;

    if (existingItem) {
      const updatedItem = {
        ...existingItem,
        amount: existingItem.amount + action.item.amount
      };
      updatedItems = [...state.items];
      updatedItems[existingItemId] = updatedItem;
    } else {
      updatedItems = state.items.concat(action.item); 
    }

    const updatedTotalAmount = state.totalAmount + 
      (action.item.price * action.item.amount);

    return { items: updatedItems, totalAmount: updatedTotalAmount };
  }

  if (action.type === 'REMOVE') {
    const existingItemId = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingItem = state.items[existingItemId];
    const updatedTotalAmount = state.totalAmount - existingItem.price;

    let updatedItems;

    if (existingItem.amount === 1) {
      updatedItems= state.items.filter((item) => item.id !== action.id);
    } else { 
      const updatedItem = { ...existingItem, amount: existingItem.amount -1};
      updatedItems = [...state.items];
      updatedItems[existingItemId] = updatedItem;
    }

    return { items: updatedItems, totalAmount: updatedTotalAmount };
  }

  if (action.type === 'CLEAR') return defaultCartState;
 
  return defaultCartState;
}

function CartProvider(props) {
  const [cartState, dispatchAction] = useReducer(cartReducer, defaultCartState);

  function addItemToCartHandler(item) {
    dispatchAction({ type: 'ADD', item: item });
  }

  function removeItemToCartHandler(id) {
    dispatchAction({ type: 'REMOVE', id: id });
  }

  function clearCartHandler() {
    dispatchAction({ type: 'CLEAR'});
  }

  const cartContext = {
    items: cartState.items, 
    totalAmount: cartState.totalAmount, 
    addItem: addItemToCartHandler, 
    removeItem: removeItemToCartHandler, 
    clearCart: clearCartHandler
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
}

export default CartProvider;
