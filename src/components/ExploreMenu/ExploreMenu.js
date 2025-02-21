import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./ExploreMenu.css";

const ExploreMenu = ({ category, setCategory }) => {
  const { categories, url } = useContext(StoreContext);

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your craving and elevate your dining experience, one delicious meal at a time.
      </p>
      <div className="explore-menu-list">
        {categories.map((item, index) => (
          <div
            key={index}
            onClick={() => setCategory((prev) => (prev === item.name ? "All" : item.name))}
            className="explore-menu-list-item"
          >
            <img className={category === item.name ? "active" : ""} src={`${url}/images/${item.image}`} alt={item.name} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
