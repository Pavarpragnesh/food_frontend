import React from 'react'
import './Footer.css'
import { assets } from '../../assets/frontend_assets/assets';
const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" />
            <p>A juicy grilled chicken patty topped with spicy mayo and fresh lettuce, served in a toasted bun.</p>
            <li><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d67619.9243731564!2d72.91248202369843!3d20.586113376015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0c335580ae8a3%3A0x9889309121cf9790!2sCodeSynergiX!5e1!3m2!1sen!2sin!4v1742278678870!5m2!1sen!2sin" width="200" height="100" Style="border:0;" allowfullScreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></li>
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
              <li>Home</li>
              <li>About us</li>
              <li>Delivery</li>
              <li>Privacy policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
              <li>+1-212-456-7890</li>
              <li>contact@tomato.com</li>
              <div className='footer-social-icons'>
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
              </div>
            </ul>
        </div>
      </div>
      <hr/>
      <p className="footer-copyright">copyright 2024 © Tomato.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer;
