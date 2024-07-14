import React from 'react';
import axios from 'axios';

const Dish = ({ dish }) => {
  const togglePublished = () => {
    axios.post(`http://localhost:5000/api/dishes/${dish.dishId}/toggle`)
      .catch(error => console.error('Error toggling dish:', error));
  };

  return (
    <div>
      <h2>{dish.dishName}</h2>
      <img src={dish.imageUrl} alt={dish.dishName} width="200" />
      <p>{dish.isPublished ? 'Published' : 'Unpublished'}</p>
      <button onClick={togglePublished}>
        {dish.isPublished ? 'Unpublish' : 'Publish'}
      </button>
    </div>
  );
};

export default Dish;
