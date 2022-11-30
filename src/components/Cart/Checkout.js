import { useRef, useState } from 'react';

import styles from './Checkout.module.css'; 

const isEmpty = value => value.trim() === '';
const isFiveChars = value => value.trim().length === 5; 

function Checkout(props) {
  const [formInputsValidity, setFormInputsValidity] = useState({
    name: true, 
    street: true, 
    postalCode: true, 
    city: true
  });

  const nameInputRef = useRef();
  const streetInputRef = useRef();
  const postalCodeInputRef = useRef();
  const cityInputRef = useRef();

  function confirmHandler(event) {
    event.preventDefault();

    const enteredName = nameInputRef.current.value;
    const enteredStreet = streetInputRef.current.value;
    const enteredPostalCode = postalCodeInputRef.current.value;
    const enteredCity = cityInputRef.current.value;

    const enteredNameIsValid = !isEmpty(enteredName);
    const enteredStreetIsValid = !isEmpty(enteredStreet);
    const enteredCityIsValid = !isEmpty(enteredCity);
    const postalCodeIsValid = isFiveChars(enteredPostalCode);

    setFormInputsValidity({
      name: enteredNameIsValid, 
      street: enteredStreetIsValid, 
      postalCode: postalCodeIsValid, 
      city: enteredCityIsValid
    });

    const formIsValid = 
      enteredNameIsValid && 
      enteredStreetIsValid && 
      enteredCityIsValid && 
      postalCodeIsValid;

    if (!formIsValid) {
      return;
    }

    props.onConfirm({
      name: enteredName, 
      street: enteredStreet, 
      city: enteredCity, 
      postalCode: enteredPostalCode
    });
  };

  const nameControlStyles = `${styles.control} ${formInputsValidity.name ? '' : styles.invalid}`;
  const streetControlStyles = `${styles.control} ${formInputsValidity.street ? '' : styles.invalid}`;
  const postalCodeControlStyles = `${styles.control} ${formInputsValidity.postalCode ? '' : styles.invalid}`;
  const cityControlStyles = `${styles.control} ${formInputsValidity.city ? '' : styles.invalid}`;

  return (
    <form className={styles.form} onSubmit={confirmHandler}>
      <div className={nameControlStyles}>
        <label htmlFor="name">Your Name</label>
        <input type="text" id="name" ref={nameInputRef} />
        {!formInputsValidity.name && <p>Please enter a valid name!</p>}
      </div>
      <div className={streetControlStyles}>
        <label htmlFor="street">Street</label>
        <input type="text" id="street" ref={streetInputRef} />
        {!formInputsValidity.street && <p>Please enter a valid street name!</p>}
      </div>
      <div className={postalCodeControlStyles}>
        <label htmlFor="postal">Postal Code</label>
        <input type="text" id="postal" ref={postalCodeInputRef} />
        {!formInputsValidity.postalCode && <p>Please enter a valid postal code! (5 characters long)</p>}
      </div>
      <div className={cityControlStyles}>
        <label htmlFor="city">City</label>
        <input type="text" id="city" ref={cityInputRef} />
        {!formInputsValidity.city && <p>Please enter a valid city name!</p>}
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={props.onCancel}>
          Cancel
        </button>
        <button className={styles.submit}>Confirm</button>
      </div>
    </form>
  );
}

export default Checkout;