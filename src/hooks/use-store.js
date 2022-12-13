// CUSTOM REDUX-LIKE STORE IMPLEMENTATION
// It allows to create a concrete store slices like multiple reducers in Redux

import { useEffect, useState } from 'react';

// Variables defined OUT of the hook, so each component that uses the hook 
// uses the same variable as others, not separate value for each component, 
// and that affects better in perfomance perspective than Context API.

// store an any state of any component that uses the hook
let globalState = {};
// listeners to listen changes in the states 
let listeners = [];
// actions that could be dispatched
let actions = {};

export function useStore(shouldListen = true) {
  // Here we use just set-function ([1] - second element), not interesting in 
  // current state-snapshot. So user-component will be re-rendered when function 
  // is being called.
  const setState = useState(globalState)[1];

  // The analogue of Redux's dispatch-function, that gets an action identifier 
  // to search for that action in actions-object and updates global state 
  function dispatch(actionsId, payload) {
    const newState = actions[actionsId](globalState, payload);

    // Then existing globalState object merges with a new state
    globalState = {...globalState, ...newState};

    // And inform all listeners for this state update
    for (const listener of listeners) {
      listener(globalState);
    }
  }

  useEffect(() => {
    // List of listeners contains all the set-functions for every user-component
    // So every user-component gets its own set-function, which shared in array.
    // IF-checking avoids unnecessary usage of listeners when one exact component 
    // needs in action only. For this also must use React.memo() in user-component.
    if (shouldListen) {
      listeners.push(setState);
    }

    // Clean-up function to remove listener when the user-component unmounted
    return () => {
      if (shouldListen) {
        listeners = listeners.filter(li => li !== setState);
      }
    }

  }, [setState, shouldListen]);

  // Return similar staff as useReducer-function returns
  return [globalState, dispatch];
}

// Initialize store for needed component
export function initStore(userActions, initialState) {
  if (initialState) {
    globalState = { ...globalState, ...initialState };
  }
  actions = { ...actions, ...userActions };
}
