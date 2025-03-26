import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/frontend_assets/assets';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // To track the order for the popup
  const [itemRatings, setItemRatings] = useState({}); // To store ratings for each item

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  // Function to determine the status class
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'status-delivered';
      case 'out for delivery':
        return 'status-out-for-delivery';
      case 'food processing':
      case 'processing':
        return 'status-processing';
      default:
        return 'status-default';
    }
  };

  // Function to handle rating submission
  const submitRating = async (orderId) => {
    try {
      const response = await axios.post(
        `${url}/api/food/rate`,
        { orderId, ratings: itemRatings }, // Send item-specific ratings
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        alert("Ratings submitted successfully!");
        setSelectedOrder(null); // Close popup
        setItemRatings({}); // Reset ratings
        fetchOrders(); // Refresh orders
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting ratings:", error);
      alert("Failed to submit ratings.");
    }
  };

  // Render star rating UI for each item
  const renderRatingStars = (itemId) => {
    const stars = [1, 2, 3, 4, 5];
    return (
      <div className="rating-stars">
        {stars.map((star) => (
          <span
            key={star}
            className={`star ${star <= (itemRatings[itemId] || 0) ? 'filled' : ''}`}
            onClick={() => setItemRatings((prev) => ({ ...prev, [itemId]: star }))}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.slice().reverse().map((order, index) => {
          const isDelivered = order.status.toLowerCase() === 'delivered';
          return (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <p>
                {order.items.map((item, itemIndex) => {
                  if (itemIndex === order.items.length - 1) {
                    return `${item.name} X ${item.quantity}`;
                  } else {
                    return `${item.name} X ${item.quantity}, `;
                  }
                })}
              </p>
              <p>₹{order.amount}.00</p>
              <p>Items: {order.items.length}</p>
              <p>
                <b className={getStatusClass(order.status)}>{order.status}</b>
              </p>
              {isDelivered ? (
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setItemRatings({}); // Reset ratings when opening popup
                  }}
                >
                  Rate Order
                </button>
              ) : (
                <button onClick={fetchOrders}>Track Order</button>
              )}
            </div>
          );
        })}
      </div>

      {/* Rating Popup */}
      {selectedOrder && (
        <div className="rating-popup">
          <div className="rating-popup-container">
            <div className="rating-popup-title">
              <h3>Rate Your Order</h3>
              <img
                src={assets.cross_icon}
                alt="Close"
                onClick={() => setSelectedOrder(null)}
                className="close-icon"
              />
            </div>
            <div className="rating-popup-content">
              <p>Items:</p>
              <ul>
                {selectedOrder.items.map((item, index) => (
                  <li key={index} className="item-rating-row">
                    <span>{item.name}</span>
                    {renderRatingStars(item._id)} {/* Use actual food item _id */}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => submitRating(selectedOrder._id)}
              disabled={Object.keys(itemRatings).length === 0} // Disable if no ratings selected
            >
              Submit Ratings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;