import React from 'react';

import MealItemForm from './MealItemForm';
import classes from './MealItem.module.css';
import { useStore } from '../../../hooks/use-store';

const MealItem = React.memo(props => {
  const dispatch = useStore(false)[1];

  const price = `$${props.price.toFixed(2)}`;

  const addToCartHandler = amount => {
    const item = {
      id: props.id,
      name: props.name,
      amount: amount,
      price: props.price
    };
    dispatch('ADD', { item });
  };

  return (
    <li className={classes.meal}>
      <div>
        <h3>{props.name}</h3>
        <div className={classes.description}>{props.description}</div>
        <div className={classes.price}>{price}</div>
      </div>
      <div>
        <MealItemForm id={props.id} onAddToCart={addToCartHandler} />
      </div>
    </li>
  );
});

export default MealItem;

// Usage of React.memo() with the help of shouldListen boolean-checking 
// allows to prevent unnecessary re-rendering of this component because 
// of using useEffect() in useStore-hook 
