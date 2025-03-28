import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/frontend_assets/assets';
import { jsPDF } from 'jspdf'; // Import jsPDF

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [itemRatings, setItemRatings] = useState({});
  const [isRated, setIsRated] = useState(false);

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

  const fetchOrderRatings = async (orderId) => {
    try {
      const response = await axios.get(`${url}/api/food/rate/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success && Object.keys(response.data.ratings).length > 0) {
        setItemRatings(response.data.ratings);
        setIsRated(true);
      } else {
        setItemRatings({});
        setIsRated(false);
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
    fetchOrderRatings(order._id);
  };

  // Function to generate and download PDF
  const generatePDF = (order) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = 15;
  
    // Title: Order Receipt
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Order Receipt", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
  
    // Draw a line under the title
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
  
    // Order Details
    doc.setFontSize(12);
  
    doc.setFont("helvetica", "bold");
    doc.text("Order ID:", margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(`${order._id}`, margin + 30, yPosition);
    yPosition += 7;
  
    doc.setFont("helvetica", "bold");
    doc.text("Name:", margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(`${order.address.firstName} ${order.address.lastName}`, margin + 30, yPosition);
    yPosition += 7;
  
    doc.setFont("helvetica", "bold");
    doc.text("Phone:", margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(`${order.address.phone}`, margin + 30, yPosition);
    yPosition += 7;
  
    doc.setFont("helvetica", "bold");
    doc.text("Address:", margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(`${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.Zipcode}`, margin + 30, yPosition);
    yPosition += 7;
  
    doc.setFont("helvetica", "bold");
    doc.text("Date:", margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(`${new Date(order.date).toLocaleString()}`, margin + 30, yPosition);
    yPosition += 10;
  
    // Table Header
    const tableStartY = yPosition;
    const col1X = margin;
    const col2X = margin + 80;
    const col3X = margin + 100;
    const col4X = margin + 120;
  
    doc.setFont("helvetica", "bold");
    doc.setFillColor(200, 200, 200); // Light gray background for header
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, "F"); // Background for header row
    doc.text("Item", col1X, yPosition + 6);
    doc.text("Qty.", col2X, yPosition + 6);
    doc.text("Price", col3X, yPosition + 6);
    doc.text("Amount", col4X, yPosition + 6);
    yPosition += 8;
  
    // Draw table borders
    doc.setLineWidth(0.2);
    doc.line(margin, tableStartY, pageWidth - margin, tableStartY); // Top border
    doc.line(margin, tableStartY, margin, yPosition); // Left border
    doc.line(pageWidth - margin, tableStartY, pageWidth - margin, yPosition); // Right border
    doc.line(margin, yPosition, pageWidth - margin, yPosition); // Bottom border after header
  
    // Table Content
    doc.setFont("helvetica", "normal");
    let totalItems = 0;
    let subtotal = 0;
  
    order.items.forEach((item, index) => {
      const amount = item.price * item.quantity;
      subtotal += amount;
      totalItems += item.quantity;
  
      // Background color for alternate rows
      if (index % 2 === 0) {
        doc.setFillColor(240, 240, 240); // Very light gray for alternate rows
        doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, "F");
      }
  
      doc.text(item.name, col1X, yPosition + 6);
      doc.text(item.quantity.toString(), col2X, yPosition + 6);
      doc.text(`${item.price.toFixed(2)}`, col3X, yPosition + 6);
      doc.text(`${amount.toFixed(2)}`, col4X, yPosition + 6);
      yPosition += 8;
  
      // Draw horizontal line for each row
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
    });
  
    // Draw vertical lines for table columns
    doc.line(col2X - 5, tableStartY, col2X - 5, yPosition); // Between Item and Qty
    doc.line(col3X - 5, tableStartY, col3X - 5, yPosition); // Between Qty and Price
    doc.line(col4X - 5, tableStartY, col4X - 5, yPosition); // Between Price and Amount
  
    // Calculate Delivery Charge based on subtotal
    let deliveryCharge = 0;
    if (subtotal >= 100 && subtotal < 300) {
      deliveryCharge = 50;
    } else if (subtotal >= 300 && subtotal < 500) {
      deliveryCharge = 70;
    } else if (subtotal >= 500) {
      deliveryCharge = 0; // Free delivery
    }
  
    // Calculate Grand Total
    const grandTotal = subtotal + deliveryCharge;
  
    // Summary
    yPosition += 10;
    doc.setFont("helvetica", "normal");
    doc.text(`Total Qty: ${totalItems}`, margin, yPosition);
    doc.text(`Sub Total: ${subtotal.toFixed(2)}`, col4X - 20, yPosition);
    yPosition += 7;
    doc.text(`Delivery Charge: ${deliveryCharge.toFixed(2)}`, col4X - 20, yPosition);
    yPosition += 7;
    doc.setFont("helvetica", "bold");
    doc.text(`Grand Total: ${grandTotal.toFixed(2)}`, col4X - 20, yPosition);
    yPosition += 7;
    doc.setFont("helvetica", "normal");
    doc.text(`Paid via: ${order.paymentMethod || "Online"}`, margin, yPosition);
  
    // Footer: Thank You Message
    yPosition = pageHeight - 20;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for your order!", pageWidth / 2, yPosition, { align: "center" });
  
    // Download the PDF
    doc.save(`Order_${order._id}.pdf`);
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
              <div className="order-actions">
                {isDelivered ? (
                  <button onClick={() => openRatingPopup(order)}>Rate Order</button>
                ) : (
                  <button onClick={fetchOrders}>Track Order</button>
                )}
                <button onClick={() => generatePDF(order)}>Print</button>
              </div>
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