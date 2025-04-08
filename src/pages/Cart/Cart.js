import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, addToCart, getTotalCartAmount, url, offers, promoCode, setPromoCode, promoError, setPromoError, discount, setDiscount } = useContext(StoreContext);
  const navigate = useNavigate();

  // Calculate delivery fee based on subtotal
  const subtotal = getTotalCartAmount();
  const calculateDeliveryFee = (subtotal) => {
    if (subtotal === 0 || subtotal < 100) return 0; // No delivery fee if cart is empty or below minimum
    if (subtotal >= 100 && subtotal < 300) return 50;
    if (subtotal >= 300 && subtotal <= 500) return 70;
    if (subtotal > 500) return 0;
    return 0; // Default case
  };
  const deliveryFee = calculateDeliveryFee(subtotal);
  const isOrderBelowMinimum = subtotal > 0 && subtotal < 100;

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    const matchedOffer = offers.find(offer => offer.code.toLowerCase() === promoCode.toLowerCase());
    if (matchedOffer) {
      setPromoError("");
      const discountAmount = matchedOffer.discountType === 'percentage' 
        ? (subtotal * matchedOffer.discountValue) / 100 
        : Math.min(matchedOffer.discountValue, subtotal);
      setDiscount(discountAmount);
    } else {
      setPromoError("Invalid promo code");
      setDiscount(0);
    }
  };

  const totalAfterDiscount = subtotal + deliveryFee - discount;

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Actions</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={`${url}/images/${item.image}`} alt={item.name} />
                  <p>{item.name}</p>
                  <p>₹{item?.price}</p>
                  <div className="quantity-controls">
                    <button onClick={() => removeFromCart(item._id)}>-</button>
                    <span>{cartItems[item._id]}</span>
                    <button onClick={() => addToCart(item._id)}>+</button>
                  </div>
                  <p>₹{item?.price * cartItems[item?._id]}</p>
                  <p onClick={() => removeFromCart(item._id, true)} className="cross">X</p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{subtotal}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{deliveryFee}</p>
            </div>
            <hr />
            {discount > 0 && (
              <div className="cart-total-details">
                <p>Discount</p>
                <p>-₹{discount}</p>
              </div>
            )}
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{totalAfterDiscount}</b>
            </div>
          </div>
          {isOrderBelowMinimum && (
            <p style={{ color: "red" }}>Minimum order amount is ₹100</p>
          )}
          <button
            onClick={() => navigate('/order')}
            disabled={isOrderBelowMinimum}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className="cart-promocode">
          <p>If you have a promo code, enter it here</p>
          <form onSubmit={handlePromoSubmit} className="cart-promocode-input">
            <input 
              type="text" 
              placeholder="Promo code" 
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
          {promoError && <p style={{ color: "red", marginTop: "10px" }}>{promoError}</p>}
        </div>
      </div>
    </div>
  );
};

export default Cart;