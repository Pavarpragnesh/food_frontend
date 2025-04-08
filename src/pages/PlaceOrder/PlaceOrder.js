import React, { useContext, useState, useEffect } from 'react';
import './PlaceOrder.css';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    Zipcode: "",
    country: "",
    phone: "",
  });

  const { getTotalCartAmount, food_list, cartItems, url, token, offers, promoCode, setPromoCode, promoError, setPromoError, discount, setDiscount } = useContext(StoreContext);
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

  // Handle promo code submission
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

  // Calculate total after discount
  const totalAfterDiscount = subtotal + deliveryFee - discount;

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => console.log("Razorpay script loaded");
      script.onerror = () => console.error("Failed to load Razorpay script");
      document.body.appendChild(script);
    }
  }, []);

  const getUserIdFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded?.id;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    if (isOrderBelowMinimum) {
      alert("Minimum order amount is ₹100. Please add more items.");
      navigate('/cart');
      return;
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      alert("Session expired. Please log in again.");
      return;
    }

    let orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        ...item,
        quantity: cartItems[item._id],
      }));

    let orderData = {
      userId,
      address: data,
      items: orderItems,
      amount: totalAfterDiscount,
      deliveryFee: deliveryFee,
      discount:discount
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const { success_url, cancel_url, key, amount, userId } = response.data;

        if (!window.Razorpay) {
          alert("Payment gateway is not available. Please refresh the page.");
          return;
        }

        const options = {
          key,
          amount: totalAfterDiscount * 100, // Convert to paise for Razorpay
          currency: "INR",
          name: "pragnesh",
          description: "Order Payment",
          handler: function (paymentResponse) {
            alert("Payment successful! Payment ID: " + paymentResponse.razorpay_payment_id);
            window.location.href = success_url;
          },
          prefill: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            contact: data.phone,
          },
          theme: {
            color: "#3399cc",
          },
          modal: {
            ondismiss: function () {
              alert("Payment was canceled.");
            },
          },
        };

        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", function (response) {
          alert(
            `Payment failed!\nReason: ${response.error.description}\nPayment ID: ${response.error.metadata.payment_id}`
          );
          window.location.href = cancel_url;
        });

        rzp.open();
      } else {
        alert("Payment failed");
      }
    } catch (error) {
      console.error("Order Placement Error:", error);
      alert("Error placing order. Please try again.");
    }
  };

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token, navigate]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First Name" />
          <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last Name" />
        </div>
        <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email address" />
        <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street" />
        <div className="multi-fields">
          <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" />
          <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State" />
        </div>
        <div className="multi-fields">
          <input required name="Zipcode" onChange={onChangeHandler} value={data.Zipcode} type="text" placeholder="Zip Code" />
          <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" />
        </div>
        <input required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone" />
      </div>
      <div className="place-order-right">
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
          <button type="submit" disabled={isOrderBelowMinimum}>
            PROCEED TO PAYMENT
          </button>
        </div>
        {/* <div className="cart-promocode">
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
        </div> */}
      </div>
    </form>
  );
};

export default PlaceOrder;