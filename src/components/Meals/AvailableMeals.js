import React, { useEffect, useState } from 'react';

import styles from './AvailableMeals.module.css';
import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';

function AvailableMeals() {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMeals() {
      const response = await fetch('https://react-http-7919e-default-rtdb.europe-west1.firebasedatabase.app/Meals.json');
        
      if (!response.ok) {
        throw new Error('Something went wrong! Error: ' + response.status);
      }

      const data = await response.json();

      const loadedMeals = [];

      for (const key in data) {
        loadedMeals.push({
          id: key,
          name: data[key].name, 
          description: data[key].description, 
          price: data[key].price
        })
      }
      
      setIsLoading(false);
      setMeals(loadedMeals);
    }
    
    fetchMeals().catch((error) => {
      setIsLoading(false);
      setError(error.message);    
    });
  
  }, []);

  const mealsList = meals.map((meal) => (
    <MealItem 
      key={meal.id} 
      id={meal.id} 
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  let content = 
    <section className={styles.meals}>
      <p>Found no meals.</p>
    </section>;

  if (isLoading) {
    content = 
      <section className={styles.MealsLoading}>
        <p>Loading...</p>
      </section>;
  }
  if (mealsList.length > 0) {
    content = 
      <section className={styles.meals}>
        <Card>
          <ul>{mealsList}</ul>
        </Card>
      </section>;
  }
  if (error) {
    content = 
      <section className={styles.MealsError}>
        <h2>{error}</h2>
      </section>;
  }

  return content;
}

export default AvailableMeals;
