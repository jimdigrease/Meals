import { useReducer } from 'react';

import CartContext from './cart-context';

const defaultCartState = {
  items: [], 
  totalAmount: 0
};

function cartReducer(state, action) {
  if (action.type === 'ADD') {
    // Find if such item already exists in the cart to avoid duplicate lines with 
    // the same item and show a number of amount of its in one line instead
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
      // concat() returns a new array instead of push() which changes initial array
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

    if (existingItem.amount === 1) { // if only one such item exists
      // Return new array without deleting item
      updatedItems= state.items.filter((item) => item.id !== action.id);
    } else { 
      // if items more than one we need just to decrease its amount by one
      const updatedItem = { ...existingItem, amount: existingItem.amount -1};
      updatedItems = [...state.items]; // create new array of items
      updatedItems[existingItemId] = updatedItem; // and update it
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
