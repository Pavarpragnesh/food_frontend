// Footer.js
import React, { useState } from "react";
import { Modal } from "antd";
import Terms from "../Terms/Terms";
import Delivery from "../Delivery/Delivery"; // Import the new Delivery component
import "./Footer.css";
import { assets } from "../../assets/frontend_assets/assets";

const Footer = () => {
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false); // For Terms modal
  const [isDeliveryModalVisible, setIsDeliveryModalVisible] = useState(false); // For Delivery modal

  // Functions for Terms modal
  const showTermsModal = () => {
    setIsTermsModalVisible(true);
  };

  const handleTermsCancel = () => {
    setIsTermsModalVisible(false);
  };

  // Functions for Delivery modal
  const showDeliveryModal = () => {
    setIsDeliveryModalVisible(true);
  };

  const handleDeliveryCancel = () => {
    setIsDeliveryModalVisible(false);
  };

  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.pavar} alt="" className="logo"/>
          <p>
            A juicy grilled chicken patty topped with spicy mayo and fresh
            lettuce, served in a toasted bun.
          </p>
          <li>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d67619.9243731564!2d72.91248202369843!3d20.586113376015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0c335580ae8a3%3A0x9889309121cf9790!2sCodeSynergiX!5e1!3m2!1sen!2sin!4v1742278678870!5m2!1sen!2sin"
              width="200"
              height="100"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </li>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li onClick={showDeliveryModal} style={{ cursor: "pointer" }}>
              Delivery
            </li>
            <li onClick={showTermsModal} style={{ cursor: "pointer" }}>
              Privacy policy
            </li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+1-212-456-7890</li>
            <li>contact@pavar.com</li>
            <div className="footer-social-icons">
              <img src={assets.facebook_icon} alt="" />
              <img src={assets.twitter_icon} alt="" />
              <img src={assets.linkedin_icon} alt="" />
            </div>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        copyright 2025 © pavar.com - All Right Reserved.
      </p>

      {/* Terms Modal */}
      <Modal
        title="Users Terms and Conditions"
        open={isTermsModalVisible}
        onCancel={handleTermsCancel}
        footer={null}
        width={900}
      >
        <Terms />
      </Modal>

      {/* Delivery Modal */}
      <Delivery
        visible={isDeliveryModalVisible}
        onCancel={handleDeliveryCancel}
      />
    </div>
  );
};

export default Footer;