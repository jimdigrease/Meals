// This store can be used from any place in a project to manage 
// a state or use the dispatch-function to dispatch an action

import { initStore } from './use-store';

const defaultCartState = {
  items: [], 
  totalAmount: 0
};

function configureCartStore() {
  // actions is that 'payload' - second argument in dispatch function in useStore-hook
  const actions = {
    ADD: (curState, action) => {
      const existingItemId = curState.items.findIndex(
        (item) => item.id === action.item.id 
      );

      const existingItem = curState.items[existingItemId];
      
      let updatedItems;
  
      if (existingItem) {
        const updatedItem = {
          ...existingItem,
          amount: existingItem.amount + action.item.amount
        };
        updatedItems = [...curState.items];
        updatedItems[existingItemId] = updatedItem;
      } else {
        updatedItems = curState.items.concat(action.item); 
      }
  
      const updatedTotalAmount = curState.totalAmount + 
        (action.item.price * action.item.amount);
  
      return { items: updatedItems, totalAmount: updatedTotalAmount };
    }, 
    REMOVE: (curState, action) => {
      const existingItemId = curState.items.findIndex(
        (item) => item.id === action.id
      );
      
      const existingItem = curState.items[existingItemId];
      const updatedTotalAmount = curState.totalAmount - existingItem.price;
  
      let updatedItems;
  
      if (existingItem.amount === 1) {
        updatedItems= curState.items.filter((item) => item.id !== action.id);
      } else { 
        const updatedItem = { ...existingItem, amount: existingItem.amount -1};
        updatedItems = [...curState.items];
        updatedItems[existingItemId] = updatedItem;
      }
  
      return { items: updatedItems, totalAmount: updatedTotalAmount };
    },
    CLEAR: () => { return defaultCartState }
  };

  // initialize an action and a payload, that can bu used from anywhere by 
  // calling useStore-hook and fetching a state and/or dispatch-function
  initStore(actions, defaultCartState);
}

export default configureCartStore;
