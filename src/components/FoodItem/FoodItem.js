import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, price, description, image, averageRating = 0 }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  // Function to render star ratings with half-star support
  const renderStars = (rating) => {
    const stars = [1, 2, 3, 4, 5];
    return (
      <div className="rating-stars">
        {stars.map((star) => {
          if (star <= rating) {
            return (
              <span key={star} className="star filled">
                ★
              </span>
            );
          } else if (star - 0.5 <= rating) {
            return (
              <span key={star} className="star half">
                ★
              </span>
            );
          } else {
            return (
              <span key={star} className="star empty">
                ★
              </span>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img className="food-item-image" src={url + "/images/" + image} alt="" />
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt=""
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt=""
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          {renderStars(averageRating)} 
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">₹{price}</p>
      </div>
    </div>
  );
};

export default FoodItem;