import React, { useContext } from "react";
import "./TopDishes.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const TopDishes = () => {
  const { topDishes } = useContext(StoreContext);

  return (
    <div className="top-dishes" id="top-dishes">
      <h2>Top 5 Most Ordered Dishes</h2>
      {topDishes.length === 0 ? (
        <p>No data available</p>
      ) : (
        <div className="top-dishes-list">
          {topDishes.map((item, index) => (
            <FoodItem
              key={index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
              averageRating={item.averageRating || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TopDishes;