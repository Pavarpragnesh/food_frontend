import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:5001";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [user, setUser] = useState(null);
  

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

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

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

  const removeFromCart = async (itemId, removeAll = false) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (removeAll || updatedCart[itemId] === 1) {
        delete updatedCart[itemId];
      } else {
        updatedCart[itemId] -= 1;
      }
      return updatedCart;
    });

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId, removeAll },
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
    try {
      const response = await axios.get(`${url}/api/food/list1`);
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
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
        // Optionally fetch user details here if login doesn't provide them
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (token) {
      loadCartData(token);
    } else {
      setCartItems({});
      setUser(null); // Clear user data on logout
    }
  }, [token]);

  

  const contextValue = {
    categories,
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    user,
    setUser, 
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;