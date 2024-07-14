import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Dish from './Dish';
import '../App.css';

const socket = io('http://localhost:5000');

const DishList = () => {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/dishes')
      .then(response => setDishes(response.data))
      .catch(error => console.error('Error fetching dishes:', error));

    socket.on('initialData', (initialDishes) => {
      setDishes(initialDishes);
    });

    socket.on('dishUpdated', updatedDish => {
      setDishes(prevDishes =>
        prevDishes.map(dish => (dish.dishId === updatedDish.dishId ? updatedDish : dish))
      );
    });

    return () => {
      socket.off('initialData');
      socket.off('dishUpdated');
    };
  }, []);

  return (
    <div className="dish-list-container">
      <h1 className="title">Dish Dashboard</h1>
      <div className="dishes-grid">
        {dishes.map(dish => (
          <Dish key={dish.dishId} dish={dish} />
        ))}
      </div>
    </div>
  );
};

export default DishList;
