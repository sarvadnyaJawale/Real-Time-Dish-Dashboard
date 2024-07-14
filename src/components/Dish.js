import React from 'react';
import axios from 'axios';
import '/home/ubuntu/Real-Time-Dish-Dashboard/src/App.css';

const Dish = ({ dish }) => {
  const togglePublished = () => {
    axios.post(`http://localhost:5000/api/dishes/${dish.dishId}/toggle`)
      .catch(error => console.error('Error toggling dish:', error));
  };

  return (
    <div className={`dish-card ${dish.isPublished ? 'published' : 'unpublished'}`}>
      <img src={dish.imageUrl} alt={dish.dishName} className="dish-image" />
      <h2 className="dish-name">{dish.dishName}</h2>
      <p className={`status ${dish.isPublished ? 'status-published' : 'status-unpublished'}`}>
        {dish.isPublished ? 'Published' : 'Unpublished'}
      </p>
      <button onClick={togglePublished} className="toggle-button">
        {dish.isPublished ? 'Unpublish' : 'Publish'}
      </button>
    </div>
  );
};

export default Dish;
