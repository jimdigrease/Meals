import React, { useContext, useState } from 'react';

import Modal from '../UI/Modal';
import styles from './Cart.module.css';
import CartContext from '../../store/cart-context';
import CartItem from './CartItem';
import Checkout from './Checkout';

function Cart(props) {
  const [isCheckout, setIsCheckout] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setdidSubmit] = useState(false);
  const cartContext = useContext(CartContext);

  const totalAmount = `$${cartContext.totalAmount.toFixed(2)}`;
  const hasItems = cartContext.items.length > 0;

  function cartItemAddHandler(item) {
    cartContext.addItem({...item, amount: 1});
  }

  function cartItemRemoveHandler(id) {
    cartContext.removeItem(id);
  }

  function orderHandler() {
    setIsCheckout(true);
  }

  async function submitOrderHandler(userData) {
    setIsSubmitting(true);
    const response = await fetch('https://react-http-7919e-default-rtdb.europe-west1.firebasedatabase.app/orders.json', {
      method: 'POST', 
      body: JSON.stringify({
        user: userData, 
        orderItems: cartContext.items
      })
    });
    if (response.ok) {
      setIsSubmitting(false);
      setdidSubmit(true);
      cartContext.clearCart();
    }
  }

  const cartItems = (
    <ul className={styles['cart-items']}>
      {cartContext.items.map((item) => (
        <CartItem 
          key={item.id} 
          name={item.name} 
          amount={item.amount} 
          price={item.price} 
          onAdd={cartItemAddHandler.bind(null, item)} 
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
        />
      ))}
    </ul>
  );

  const modalActions = (
    <div className={styles.actions}>
      <button className={styles['button--alt']} onClick={props.onClose}>
        Close
      </button>
      {hasItems && (
        <button className={styles.button} onClick={orderHandler}>Order</button>
      )}
    </div>
  );

  const cartModalContent = (
    <React.Fragment>
      {cartItems}
      <div className={styles.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && (
        <Checkout onCancel={props.onClose} onConfirm={submitOrderHandler} />
      )}
      {!isCheckout && modalActions}
    </React.Fragment>
  );

  const submittingContent = <p>Sending order data...</p>;
  
  const didSubmitContent = (
    <React.Fragment>
      <h3>Successfully sent the order!</h3>
      <div className={styles.actions}>
        <button className={styles.button} onClick={props.onClose}>
          Close
        </button>
      </div>
    </React.Fragment>
  );

  return (
    <Modal onClose={props.onClose}>
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && submittingContent}
      {!isSubmitting && didSubmit && didSubmitContent}
    </Modal>
  );
}

export default Cart;
