// Delivery.js
import React from "react";
import { Modal } from "antd";
import "./Delivery.css"; // We'll create this CSS file for styling

const Delivery = ({ visible, onCancel }) => {
  return (
    <Modal
      title="Delivery Process"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
    >
      <div className="delivery-process">
        <div className="delivery-step">
          <div className="step-icon" style={{ backgroundColor: "#9b59b6" }}>
            <span role="img" aria-label="select-item">📋</span>
          </div>
          <p>Select Item</p>
        </div>
        <div className="delivery-arrow">➡️</div>

        <div className="delivery-step">
          <div className="step-icon" style={{ backgroundColor: "#3498db" }}>
            <span role="img" aria-label="add-to-cart">🛒</span>
          </div>
          <p>Add to Cart</p>
        </div>
        <div className="delivery-arrow">➡️</div>

        <div className="delivery-step">
          <div className="step-icon" style={{ backgroundColor: "#1abc9c" }}>
            <span role="img" aria-label="payment">💳</span>
          </div>
          <p>Payment</p>
        </div>
        <div className="delivery-arrow">➡️</div>

        <div className="delivery-step">
          <div className="step-icon" style={{ backgroundColor: "#2980b9" }}>
            <span role="img" aria-label="packing">🔄</span>
          </div>
          <p>order processing</p>
        </div>
        <div className="delivery-arrow">➡️</div>

        <div className="delivery-step">
          <div className="step-icon" style={{ backgroundColor: "#e67e22" }}>
            <span role="img" aria-label="shipping">🚚</span>
          </div>
          <p>out of delivery</p>
        </div>
        <div className="delivery-arrow">➡️</div>

        <div className="delivery-step">
          <div className="step-icon" style={{ backgroundColor: "#2ecc71" }}>
            <span role="img" aria-label="delivered">🏠</span>
          </div>
          <p>Delivered</p>
        </div>
      </div>
    </Modal>
  );
};

export default Delivery;