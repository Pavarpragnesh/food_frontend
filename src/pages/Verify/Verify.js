import React, { useContext, useEffect } from 'react';
import './Verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success") === "true"; // Convert string to boolean
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    if (!orderId) {
      alert("Invalid order. Redirecting...");
      navigate("/");
      return;
    }

    try {
      const response = await axios.post(`${url}/api/order/verify`, { success, orderId });

      if (response.data.success) {
        alert("Payment successful! Redirecting to orders...");
        navigate("/myorders");
      } else {
        alert("Payment failed. Order has been deleted.");
        navigate("/");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      alert("Payment verification failed. Please try again.");
      navigate("/");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []); // Run once on mount

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
