import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/frontend_assets/assets';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [itemRatings, setItemRatings] = useState({});
  const [isRated, setIsRated] = useState(false); // Track if the order is already rated

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Fetch existing ratings for the selected order
  const fetchOrderRatings = async (orderId) => {
    try {
      const response = await axios.get(`${url}/api/food/rate/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success && Object.keys(response.data.ratings).length > 0) {
        setItemRatings(response.data.ratings);
        setIsRated(true); // Order is already rated
      } else {
        setItemRatings({});
        setIsRated(false); // Order not yet rated
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
      setItemRatings({});
      setIsRated(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

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

  const submitRating = async (orderId) => {
    try {
      const response = await axios.post(
        `${url}/api/food/rate`,
        { orderId, ratings: itemRatings },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        alert("Ratings submitted successfully!");
        setSelectedOrder(null);
        setItemRatings({});
        setIsRated(true);
        fetchOrders();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting ratings:", error);
      alert("Failed to submit ratings.");
    }
  };

  const renderRatingStars = (itemId) => {
    const stars = [1, 2, 3, 4, 5];
    return (
      <div className="rating-stars">
        {stars.map((star) => (
          <span
            key={star}
            className={`star ${star <= (itemRatings[itemId] || 0) ? 'filled' : ''}`}
            onClick={!isRated ? () => setItemRatings((prev) => ({ ...prev, [itemId]: star })) : null}
            style={{ cursor: isRated ? 'default' : 'pointer' }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const openRatingPopup = (order) => {
    setSelectedOrder(order);
    fetchOrderRatings(order._id); // Fetch ratings when popup opens
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
                {order.items.map((item, itemIndex) =>
                  itemIndex === order.items.length - 1
                    ? `${item.name} X ${item.quantity}`
                    : `${item.name} X ${item.quantity}, `
                )}
              </p>
              <p>₹{order.amount}.00</p>
              <p>Items: {order.items.length}</p>
              <p>
                <b className={getStatusClass(order.status)}>{order.status}</b>
              </p>
              {isDelivered ? (
                <button onClick={() => openRatingPopup(order)}>Rate Order</button>
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
                    {renderRatingStars(item._id)}
                  </li>
                ))}
              </ul>
            </div>
            {isRated ? (
              <p className="already-rated">Already Rated</p>
            ) : (
              <button
                onClick={() => submitRating(selectedOrder._id)}
                disabled={Object.keys(itemRatings).length === 0}
              >
                Submit Ratings
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;