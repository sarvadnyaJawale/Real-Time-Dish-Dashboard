import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Dish from './Dish';

const socket = io('http://localhost:5000');

const DishList = () => {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    // Fetch the list of dishes from the API
    axios.get('http://localhost:5000/api/dishes')
      .then(response => setDishes(response.data))
      .catch(error => console.error('Error fetching dishes:', error));

    // Listen for real-time updates
    socket.on('dishUpdated', updatedDish => {
      setDishes(prevDishes =>
        prevDishes.map(dish => (dish.dishId === updatedDish.dishId ? updatedDish : dish))
      );
    });

    return () => {
      socket.off('dishUpdated');
    };
  }, []);

  return (
    <div>
      <h1>Dish Dashboard</h1>
      {dishes.map(dish => (
        <Dish key={dish.dishId} dish={dish} />
      ))}
    </div>
  );
};

export default DishList;
