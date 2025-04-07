import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Offer.css';

const Offer = () => {
  const { offers, fetchOffers } = useContext(StoreContext);

  useEffect(() => {
    fetchOffers(); // Fetch offers when component mounts
  }, [fetchOffers]);

  // State to manage copy feedback
  const [copyStatus, setCopyStatus] = useState({});

  // Handler to copy text to clipboard
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopyStatus(prev => ({ ...prev, [code]: true }));
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [code]: false }));
      }, 2000); // Reset after 2 seconds
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const formatDiscount = (discountType, discountValue) => {
    return discountType === 'percentage' 
      ? `${discountValue}%` 
      : `${discountValue}₹`;
  };

  return (
    <div className="offer-container">
      <h2>Special Offers</h2>
      {offers.length > 0 ? (
        <Slider {...settings}>
          {offers.map((offer) => (
            <div key={offer._id} className="offer-card">
              <div className="offer-header">
                <h3>{offer.name}</h3>
                <div className="offer-code">
                  Code: {offer.code}
                  <button 
                    className="copy-btn" 
                    onClick={() => handleCopy(offer.code)}
                    title={copyStatus[offer.code] ? "Copied!" : "Copy to clipboard"}
                  >
                    {copyStatus[offer.code] ? '✔' : '📋'}
                  </button>
                </div>
              </div>
              
              <div className="offer-details">
                <p><strong>Valid From:</strong> {new Date(offer.startDateTime).toLocaleString()}</p>
                <p><strong>Valid Until:</strong> {new Date(offer.endDateTime).toLocaleString()}</p>
                <p><strong>Discount:</strong> {formatDiscount(offer.discountType, offer.discountValue)}</p>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p>No offers available at the moment.</p>
      )}
    </div>
  );
};

export default Offer;