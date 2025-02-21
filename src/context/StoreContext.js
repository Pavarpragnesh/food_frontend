import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:5001"
  const [token,setToken] = useState("");
  const [food_list,setFoodList] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${url}/api/category/list`);
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  
  const addToCard = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };
  

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list?.find((product) => product._id === item);
        if (itemInfo?.price) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount || 0;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url+"/api/food/list");
    setFoodList(response.data.data);
  }

  const loadCartData = async (Token) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { Authorization: `Bearer ${Token}` } }
      );
      setCartItems(response.data.cartData || {});
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchCategories();
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
      }
    };
    loadData();
  }, []);
  
  // Watch for token changes and load cart data
  useEffect(() => {
    if (token) {
      loadCartData(token);
    } else {
      setCartItems({}); // Clear cart when token is removed (logout)
    }
  }, [token]);
  
  const contextValue = {
    categories,
    food_list,
    cartItems,
    setCartItems,
    addToCard,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
